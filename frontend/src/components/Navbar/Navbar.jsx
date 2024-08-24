import React, { useState, useContext } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart from "../Assets/navbar/cart_icon.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";

const Navbar = (props) => {
  const [scrolling, setScrolling] = useState(false);
  const { auth, setAuth } = useContext(ShopContext);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'GET',
        credentials: 'include' 
      })
      if (response.ok) {
       setAuth({})
        navigate("/"); // Navigate to home page after logout
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`navbar ${scrolling ? 'scrolled' : ''}`}>
      <div className="logo">
        <img src={logo} alt="Logo" height="60px" />
      </div>

      <ul>
        <li>
          <NavLink to="/" exact activeClassName="active">Shop</NavLink>
        </li>
        <li>
          <NavLink to="/men" activeClassName="active">Men</NavLink>
        </li>
        <li>
          <NavLink to="/women" activeClassName="active">Women</NavLink>
        </li>
        <li>
          <NavLink to="/kids" activeClassName="active">Kids</NavLink>
        </li>
      </ul>

      <div className="cart-login">
        <div className="cart-icon-container">
          <NavLink to="/Cart">
            <img src={cart} alt="Cart Icon" height="30px" />
          </NavLink>
          <div className="cartCount">{props.countItems}</div>
        </div>

        {auth.accessToken ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <NavLink to="/login"><button>Login</button></NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
