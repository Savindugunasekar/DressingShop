import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import LoginSignup from "./pages/LoginSignup";
import Footer from "./components/Footer/Footer";
import { useContext } from "react";
import { ShopContext } from "./context/ShopContext";
import PersistLogin from "./components/PersistLogin";
import { CheckoutSuccess } from "./components/CheckoutSuccess/CheckoutSuccess";

function App() {
  const { cartItems } = useContext(ShopContext);

  const purchasedItemsValues = Object.values(cartItems).filter(
    (item) => item.quantity > 0
  );

  // Calculate total quantity
  const sum = purchasedItemsValues.reduce(
    (total, currentValue) => total + currentValue.quantity,
    0
  );

  return (
    <div>
      <BrowserRouter>
        {/* <Navbar/> */}
        <Navbar countItems={sum} />

        <Routes>
          <Route path="/" element={<Shop />} />
          <Route
            path="/men"
            element={<ShopCategory category="men" imageNum="0" />}
          />
          <Route
            path="/women"
            element={<ShopCategory category="women" imageNum="1" />}
          />

          <Route
            path="/kids"
            element={<ShopCategory category="kids" imageNum="2" />}
          />
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>

          <Route element={<PersistLogin />}>
            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout-success" element={<CheckoutSuccess />} />

          </Route>

          <Route path="/login" element={<LoginSignup />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
