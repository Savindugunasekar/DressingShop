import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/LoginSignup.css";
import { ShopContext } from "../context/ShopContext";
import { jwtDecode } from "jwt-decode";
const LoginSignup = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(ShopContext);

  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const login = async () => {
    console.log("login function executed", formData);
    let responseData;
    await fetch(`https://dressing-shop-server.vercel.app/login`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      const accessToken = responseData.accessToken;

      const decoded = jwtDecode(accessToken);

      const userId = decoded?.UserInfo?.userId;

      setAuth({ accessToken: accessToken, userId: userId });
      setFormData({
        username: "",
        password: "",
        email: "",
      });

      navigate("/");
    } else {
      alert(responseData.error);
    }
  };

  const signup = async () => {
    console.log("signup function executed", formData);
    let responseData;
    await fetch(`https://dressing-shop-server.vercel.app/signup`, {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      const accessToken = responseData.accessToken;

      setAuth({ accessToken: accessToken });
      setFormData({
        username: "",
        password: "",
        email: "",
      });

      navigate("/");
    } else {
      alert(responseData.error);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect user to the Google login route
    window.location.href = `https://dressing-shop-server.vercel.app/auth/google`;
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="LoginSignup">
      <div className="Signupcard">
        <h1>{state}</h1>
        {state === "Sign Up" ? (
          <input
            name="username"
            value={formData.username}
            onChange={changeHandler}
            type="text"
            placeholder="Your name"
          />
        ) : null}
        <input
          name="email"
          onChange={changeHandler}
          value={formData.email}
          type="email"
          placeholder="Email address"
        />
        <input
          type="password"
          onChange={changeHandler}
          name="password"
          value={formData.password}
          placeholder="Password"
        />
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>

        <button className="mt-5" onClick={handleGoogleLogin}>
          Continue with Google
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span>
              <a
                href=""
                onClick={(event) => {
                  event.preventDefault();
                  setState("Login");
                }}
              >
                log in here
              </a>
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span>
              <a
                href=""
                onClick={(event) => {
                  event.preventDefault();
                  setState("Sign Up");
                }}
              >
                Click here
              </a>
            </span>
          </p>
        )}

        <label>
          <input type="checkbox" />
          By continuing, I agree to Terms & Conditions
        </label>
      </div>
    </div>
  );
};

export default LoginSignup;
