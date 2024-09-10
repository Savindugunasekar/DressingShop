const express = require("express");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const multer = require("multer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const credentials = require("./middleware/credentials");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const db = require("./db"); // Ensure this module is set up to handle PostgreSQL queries
const corsOptions = require("./CorsOptions");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const app = express();
const PORT = process.env.PORT || 4000;
app.use(credentials);

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const session = require("express-session");
const { BlobServiceClient } = require("@azure/storage-blob");

app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

const upload = multer({ storage: multer.memoryStorage() });

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient("ecomcontainer");

const uploadImageToAzure = async (buffer, originalName) => {
  const blobName = `product image/${uuidv4()}-${path.basename(originalName)}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(buffer);
  return blockBlobClient.url;
};

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }), // Parse the raw body as a Buffer
  async (req, res) => {
    let data;
    let eventType;

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret) {
      let event;
      const signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
        console.log("Webhook signature verified");
      } catch (err) {
        console.error(
          `⚠️  Webhook signature verification failed: ${err.message}`
        );
        return res.sendStatus(400);
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    console.log(`Event received: ${eventType}`);
    console.log(`Event data: ${JSON.stringify(data)}`);

    // Handle checkout session completed
    if (eventType === "checkout.session.completed") {
      try {
        const customer = await stripe.customers.retrieve(data.customer);
        console.log("Customer retrieved:", customer);

        // Call createOrder and make sure it's awaited
        const order = await createOrder(customer, data);

        console.log("Order successfully created:", order);
      } catch (err) {
        console.error("Error creating order:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error creating order" });
      }
    }

    // Send success response back to Stripe
    res.status(200).end();
  }
);

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = await uploadImageToAzure(
      req.file.buffer,
      req.file.originalname
    );

    res.json({
      success: true,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Error uploading image" });
  }
});

app.post("/addproduct", async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subcategory,
      new_price,
      old_price,
      size_S,
      size_M,
      size_L,
      size_XL,
    } = req.body;

    // Insert product details into the database
    const queryText = `
      INSERT INTO product (name, image, category, subcategory, new_price, old_price, s,me, l, xl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;

    const values = [
      name,
      image,
      category,
      subcategory,
      new_price,
      old_price,
      size_S,
      size_M,
      size_L,
      size_XL,
    ];
    const result = await db.query(queryText, values);

    res.json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing request" });
  }
});

// Updating a product
app.post("/updateproduct", async (req, res) => {
  try {
    const queryText = `
            UPDATE product 
            SET name = $1,
                category = $2,
                subcategory = $3,
                new_price = $4,
                old_price = $5,
                s = $6,
                me = $7,
                l = $8,
                xl = $9
            WHERE id = $10
            RETURNING *`;
    const values = [
      req.body.name,
      req.body.category,
      req.body.subcategory,
      req.body.new_price,
      req.body.old_price,
      req.body.size_S,
      req.body.size_M,
      req.body.size_L,
      req.body.size_XL,
      req.body.id,
    ];
    const updatedProduct = await db.query(queryText, values);
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Failed to update product" });
  }
});

// Removing a product
app.post("/removeproduct", async (req, res) => {
  try {
    const removedProduct = await db.query(
      "DELETE FROM product WHERE id=$1 RETURNING *",
      [req.body.id]
    );
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.log(error);
  }
});

// Get a product by ID
app.post("/getproduct", async (req, res) => {
  try {
    const product = await db.query("SELECT * FROM product WHERE id=$1", [
      req.body.id,
    ]);
    res.json(product.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

// Get all products
app.get("/allproducts", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM product");
    let products = result.rows;
    res.json(products);
  } catch (error) {
    console.log(error);
  }
});

/** User Management **/

//google integration

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `https://dressing-shop-server.vercel.app/auth/google/callback`,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let userResult = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [profile.email]
        );

        let user;
        if (userResult.rows.length === 0) {
          // If user does not exist, create a new user
          let cart = {};
          for (let i = 0; i < 300; i++) {
            cart[i] = 0;
          }
          user = await db.query(
            "INSERT INTO users (name, email, password, cartdata, refreshtoken) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [profile.displayName, profile.email, profile.id, cart, "dummy"]
          );
          user = user.rows[0];
        } else {
          user = userResult.rows[0];
        }

        // Generate tokens
        const userId = user.id;
        const accessToken = jwt.sign(
          { userInfo: { userId: userId } },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        const refreshToken = jwt.sign(
          { userId: userId },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        await db.query("UPDATE users SET refreshtoken=$1 WHERE id=$2", [
          refreshToken,
          userId,
        ]);

        // Store tokens in the request object for use in the callback route
        request.accessToken = accessToken;
        request.refreshToken = refreshToken;
        request.userId = userId;

        // Call done to complete the authentication process
        done(null, user); // Correct usage of done
      } catch (error) {
        done(error, null); // Correct error handling
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    // Successful authentication handler
    res.cookie("jwt", req.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Get the access token from req.user or wherever it's stored after authentication
    const accessToken = req.accessToken; // Adjust this according to how your access token is stored

    // Redirect to the frontend with access token as a URL parameter
    res.redirect(
      `https://dressing-shop-server.vercel.app/?accessToken=${accessToken}`
    );
  }
);

// User signup
app.post("/signup", async (req, res) => {
  try {
    const emailCheck = await db.query("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);

    if (emailCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "This email already exists" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const newUser = await db.query(
      "INSERT INTO users (name, email, password, cartdata,refreshtoken) VALUES ($1, $2, $3, $4,$5) RETURNING id",
      [req.body.username, req.body.email, req.body.password, cart, "dummy"]
    );

    const userId = newUser.rows[0].id;

    const accessToken = jwt.sign(
      {
        userInfo: {
          userId: userId,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { userId: userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await db.query("UPDATE users SET refreshtoken=$1 WHERE id=$2", [
      refreshToken,
      userId,
    ]);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, accessToken, userId });
  } catch (error) {
    console.log(error);
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const passCompare = req.body.password === user.password;

      if (passCompare) {
        // const tokenData = { user: { id: user.id } };
        // const token = jwt.sign(tokenData, 'secret_ecom');

        const accessToken = jwt.sign(
          {
            UserInfo: {
              userId: user.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15min" }
        );

        const refreshToken = jwt.sign(
          { userId: user.id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        //store refresh token in cookie

        await db.query("UPDATE users SET refreshtoken=$1 WHERE id=$2", [
          refreshToken,
          user.id,
        ]);

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, accessToken: accessToken, userId: user.id });
      } else {
        return res.json({ success: false, error: "Wrong Password" });
      }
    } else {
      return res.json({ success: false, error: "Wrong email ID" });
    }
  } catch (error) {
    console.log(error);
  }
});

//refresh part

app.get("/refresh", async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  try {
    const userResult = await db.query(
      "SELECT * FROM users WHERE refreshtoken = $1",
      [refreshToken]
    );
    const user = userResult.rows[0];

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error || user.id !== decoded.userId) {
          return res.sendStatus(403);
        }

        // Token verification successful, generate new access token
        const accessToken = jwt.sign(
          {
            UserInfo: {
              userId: user.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15min",
          }
        );

        // Send the new access token in the response
        res.json({ accessToken: accessToken });
      }
    );
  } catch (err) {
    console.error("Error in refresh endpoint:", err);
    res.sendStatus(500); // Handle server error
  }
});

//logout

app.get("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  const userResult = await db.query(
    "SELECT * FROM users WHERE refreshtoken=$1",
    [refreshToken]
  );

  if (!userResult.rows.length > 0) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  const userId = userResult.rows[0].id;

  await db.query("UPDATE users SET refreshtoken=$1 WHERE id=$2", ["", userId]);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return res.sendStatus(204);
});

/** Miscellaneous **/

// New collection data
app.get("/newcollection", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM product");
    const products = result.rows;
    const newCollection = products.slice(-8);
    res.json(newCollection);
  } catch (error) {
    console.log(error);
  }
});

// Popular in women's section
app.get("/popularinwomen", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM product WHERE category = $1", [
      "women",
    ]);
    const popularItems = result.rows.slice(-4);

    res.json(popularItems);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch popular items" });
  }
});

// Checkout and update inventory

const createMergedItems = (purchasedItems, purchasedProducts) => {
  console.log("Purchased Items:", JSON.stringify(purchasedItems));
  console.log("Purchased Products:", JSON.stringify(purchasedProducts));
  let mergedItems = [];

  purchasedItems.forEach((item) => {
    let product = purchasedProducts.find((p) => p.id === item.itemId);

    if (product) {
      mergedItems.push({
        id: product.id,
        name: product.name,
        price: product.new_price,
        quantity: item.quantity,
      });
    }
  });

  return mergedItems;
};

app.post("/stripe/create-checkout-session", async (req, res) => {
  const { userId, purchasedItems, totalAmount, purchasedProducts } = req.body;

  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        purchasedItems: JSON.stringify(purchasedItems),
        totalAmount: totalAmount,
      },
    });

    const mergedItems = createMergedItems(purchasedItems, purchasedProducts);

    console.log(`merges items are ${JSON.stringify(mergedItems)} `);

    const line_items = mergedItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name, // Make sure item.name is defined correctly
          },
          unit_amount: Math.round(item.price * 100), // Convert price to cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,

      mode: "payment",
      customer: customer.id,
      success_url: `https://dressing-shop-server.vercel.app/checkout-success`,
      cancel_url: `https://dressing-shop-server.vercel.app/cart`,
    });

    res.send({ url: session.url });
  } catch (error) {
    throw error;
  }
});

const createOrder = async (customer, data) => {
  try {
    const purchasedItems = JSON.parse(customer.metadata.purchasedItems);
    const totalAmount = customer.metadata.totalAmount;
    const userId = customer.metadata.userId;

    console.log("Creating order for user:", userId);
    console.log("Purchased items:", purchasedItems);
    console.log("Total amount:", totalAmount);

    const newOrder = await db.query(
      "INSERT INTO orders (customerid, purchaseditems, total_amount) VALUES ($1, $2, $3) RETURNING *",
      [userId, JSON.stringify(purchasedItems), totalAmount]
    );

    for (const item of purchasedItems) {
      let sizeColumn;
      switch (item.size) {
        case "S":
          sizeColumn = "s";
          break;
        case "M":
          sizeColumn = "me";
          break;
        case "L":
          sizeColumn = "l";
          break;
        case "XL":
          sizeColumn = "xl";
          break;
        default:
          throw new Error("Invalid size");
      }

      await db.query(
        `UPDATE product SET ${sizeColumn} = ${sizeColumn} - $2 WHERE id = $1`,
        [item.itemId, item.quantity]
      );
    }

    console.log("Order created successfully:", newOrder.rows[0]);
    return newOrder.rows[0];
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to process order creation");
  }
};

// Start the server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.log("Error: " + error);
  }
});
