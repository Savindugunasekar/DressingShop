import React, { useState, useEffect } from "react";
import "./Updateproduct.css";
import { useLocation, useParams } from "react-router-dom";

const Updateproduct = () => {
  const { id } = useParams(); // Get the ID from the URL
  const location = useLocation();
  const { item } = location.state || {}; // Destructure item from state if available

  // Initialize state with product details
  const [productDetails, setProductDetails] = useState({
    name: item?.name || "",
    category: item?.category || "",
    subcategory: item?.subcategory || "",
    new_price: item?.new_price || "",
    old_price: item?.old_price || "",
    size_S: item?.size_S || "",
    size_M: item?.size_M || "",
    size_L: item?.size_L || "",
    size_XL: item?.size_XL || "",
  });

  const productHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async () => {
    try {
      const updateResponse = await fetch(
        `https://dressing-shop-server.vercel.app/updateproduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productDetails),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update product");
      }

      const updateData = await updateResponse.json();
      if (updateData.success) {
        alert("Product updated");
      } else {
        throw new Error("Update operation failed");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const renderSubcategory = () => {
    switch (productDetails.category) {
      case "men":
        return (
          <div className="subcategory">
            <label>Sub Category</label>
            <br />
            <select
              onChange={productHandler}
              value={productDetails.subcategory}
              name="subcategory"
              id="subproductcategory"
            >
              <option value="">Select</option>
              <option value="t-shirt">T-shirt</option>
              <option value="shirt">Shirt</option>
              <option value="hoodie">Hoodie</option>
            </select>
          </div>
        );
      case "women":
        return (
          <div className="subcategory">
            <label>Sub Category</label>
            <br />
            <select
              onChange={productHandler}
              value={productDetails.subcategory}
              name="subcategory"
              id="subproductcategory"
            >
              <option value="">Select</option>
              <option value="dresses">Dresses</option>
              <option value="t-shirt">T-shirt</option>
              <option value="blouse">Blouse</option>
            </select>
          </div>
        );
      case "kids":
        return (
          <div className="subcategory">
            <label>Sub Category</label>
            <br />
            <select
              onChange={productHandler}
              value={productDetails.subcategory}
              name="subcategory"
              id="subproductcategory"
            >
              <option value="">Select</option>
              <option value="t-shirt">T-shirt</option>
              <option value="shirt">Shirt</option>
              <option value="hoodie">Hoodie</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="productform">
      <div className="formcontainer">
        <div className="productname">
          <label htmlFor="productname">Product Title</label>
          <br />
          <input
            value={productDetails.name}
            onChange={productHandler}
            type="text"
            name="name"
            id="productname"
          />
        </div>
        <div className="prices">
          <div className="price1">
            <label htmlFor="price">Price</label>
            <br />
            <input
              value={productDetails.old_price}
              type="number"
              onChange={productHandler}
              name="old_price"
              id="price"
            />
          </div>
          <div className="price2">
            <label htmlFor="offerprice">Offer Price</label>
            <br />
            <input
              onChange={productHandler}
              value={productDetails.new_price}
              name="new_price"
              type="number"
              id="offerprice"
            />
          </div>
        </div>
        <div className="sizes">
          <div className="size-input">
            <label htmlFor="sizeS">Size S</label>
            <br />
            <input
              value={productDetails.size_S}
              type="number"
              onChange={productHandler}
              name="size_S"
              id="sizeS"
            />
          </div>
          <div className="size-input">
            <label htmlFor="sizeM">Size M</label>
            <br />
            <input
              value={productDetails.size_M}
              type="number"
              onChange={productHandler}
              name="size_M"
              id="sizeM"
            />
          </div>
          <div className="size-input">
            <label htmlFor="sizeL">Size L</label>
            <br />
            <input
              value={productDetails.size_L}
              type="number"
              onChange={productHandler}
              name="size_L"
              id="sizeL"
            />
          </div>
          <div className="size-input">
            <label htmlFor="sizeXL">Size XL</label>
            <br />
            <input
              value={productDetails.size_XL}
              type="number"
              onChange={productHandler}
              name="size_XL"
              id="sizeXL"
            />
          </div>
        </div>
        {renderSubcategory()}
        <div className="submitbutton">
          <input onClick={updateProduct} type="submit" value="UPDATE" />
        </div>
      </div>
    </div>
  );
};

export default Updateproduct;
