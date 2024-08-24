import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../components/Breadcrum/Breadcrum";
import Productdetails from "../components/Productdetails/Productdetails";
import Related from "../components/Related/Related";
import { AnimatePresence, motion } from "framer-motion";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_product.find((e) => e.id === Number(productId));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initialState"
        animate="animateState"
        exit="exitState"
        transition={{
          duration: 0.5,
        }}
        variants={{
          initialState: {
            opacity: 0,
            x: "-100vw", // Slide in from the left (off the viewport width)
          },
          animateState: {
            opacity: 1,
            x: 0, // Center it in the viewport
          },
          exitState: {
            opacity: 0,
            x: "100vw", // Slide out to the right (off the viewport width)
          },
        }}
        className="mx-20"
      >
        <Breadcrum product={product} />
        <Productdetails productinfo={product} />
        <Related relatedproducts={product} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Product;
