import React, { useContext, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom

import './CSS/Shop.css';
import Hero from "../components/Hero/Hero";
import Popular from "../components/Popular/Popular";
import Banner from "../components/Banner/Banner";
import Newcollection from "../components/Newcollection/Newcollection";
import Newsletter from "../components/Newsletter/Newsletter";
import { ShopContext } from "../context/ShopContext";

const Shop = () => {
  const ref = useRef(null);
  const { setAuth } = useContext(ShopContext);
  const location = useLocation(); // Hook from react-router-dom to get current location

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      setAuth({ accessToken: accessToken });
    } else {
      console.log('Access Token not found.');
    }
  }, [location.search, setAuth]);

  const isInView = useInView(ref, { once: true });
  const maincontrols = useAnimation();

  useEffect(() => {
    if (isInView) {
      maincontrols.start('visible');
    }
  }, [isInView, maincontrols]);

  return (
    <div ref={ref} className="shop-container">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 }
        }}
        initial='hidden'
        animate={maincontrols}
        transition={{
          duration: 0.5,
          delay: 0.25
        }}
        className="shoppage"
      >
        <Hero />
        <Popular />
        <Banner />
        <Newcollection />
        <Newsletter />
      </motion.div>
    </div>
  );
}

export default Shop;
