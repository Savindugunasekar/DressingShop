import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};

  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }

  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAllProducts] = useState([]);

  const [auth, setAuth] = useState({});

  useEffect(() => {
    fetch(`https://dressing-shop-server.vercel.app/allproducts`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data));
  }, []);

  const [cartItems, setCartItems] = useState(getDefaultCart());

  const addToCart = (itemId, size, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: { size: size, quantity: quantity },
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const contextValue = {
    all_product,
    cartItems,
    auth,
    setAuth,
    addToCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
