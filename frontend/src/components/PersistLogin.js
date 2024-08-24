import React, { useContext, useEffect, useState } from "react";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { ShopContext } from "../context/ShopContext";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useRefreshToken();

  const { auth } = useContext(ShopContext);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    console.log(`isloading: ${isLoading}`);
    console.log(`at: ${auth.accessToken}`);
  }, [isLoading]);

  return <>{isLoading ? <p>Loading</p> : <Outlet />}</>;
};

export default PersistLogin;
