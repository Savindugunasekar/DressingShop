import React, { useContext, useState } from "react";
import "./CSS/ShopCategory.css";

import DiscountBanner from "../components/Discountbanner/Discountbanner";

import girlimage from "../components/Assets/exclusive_image.png";
import manimage from "../components/Assets/manimage.png";
import kidimage from "../components/Assets/kidimage.png";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  let source;

  switch (props.imageNum) {
    case "0":
      source = manimage;
      break;
    case "1":
      source = girlimage;
      break;
    case "2":
      source = kidimage;
      break;
    default:
      source = null;
  }

  const products = all_product.filter(
    (product) => product.category === props.category
  );

  const [subcategory, setSubcategory] = useState(null);

  const renderedSubcategories = new Set();

  const subCategoryList = subcategory
    ? products.filter((product) => product.subcategory === subcategory)
    : products;

  return (
    <div className="ShopCategory">
      <DiscountBanner image={source} />

      <div className="flex mr-10 gap-5">
        <div className="subcategoryButtons">
          <ul className="flex flex-col gap-0">
            <li
              className={`w-[20vw] py-5 text-lg px-10 border-b-2 border-gray-200 hover:bg-gray-200 transition-all ${subcategory === null ? 'activesub' : ''}`}
              onClick={() => setSubcategory(null)}
            >
              All
            </li>
            {products.map((product, index) => {
              if (!renderedSubcategories.has(product.subcategory)) {
                renderedSubcategories.add(product.subcategory);
                return (
                  <li
                    key={index}
                    className={`w-[20vw] py-5 text-lg px-10 border-b-2 border-gray-200 hover:bg-gray-200 transition-all ${subcategory === product.subcategory ? 'activesub' : ''}`}
                    onClick={() => setSubcategory(product.subcategory)}
                  >
                    {product.subcategory}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>

        <div className="w-full" >
          {subCategoryList.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              image={item.image}
              name={item.name}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
