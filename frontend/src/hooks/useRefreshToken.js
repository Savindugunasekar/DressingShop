import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export const useRefreshToken = () => {
  const { setAuth } = useContext(ShopContext);

  const refresh = async () => {
    try {
      const response = await fetch("/refresh", {
        method: "GET",
        // credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();

      // Assuming setAuth updates the state with a function that takes the previous state
      setAuth((prev) => ({
        ...prev,
        accessToken: data.accessToken,
      }));
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error; // Handle or propagate the error as needed
    }
  };

  return refresh;
};
