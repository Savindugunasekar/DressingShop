import React, { useState, useEffect } from "react";
import "./Listproducts.css";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";

const Listproducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const response = await fetch(
      `https://dressing-shop-server.vercel.app/allproducts`
    );
    const data = await response.json();
    setProducts(data);
  };

  const handleRemoveProduct = async (productId) => {
    const response = await fetch(
      `https://dressing-shop-server.vercel.app/removeproduct`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      }
    );

    const data = await response.json();
    if (data.success) {
      alert("Product removed successfully");
      setProducts(products.filter((product) => product.id !== productId));
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      const updateResponse = await fetch(
        `https://dressing-shop-server.vercel.app/updateproduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update product");
      }

      const updateData = await updateResponse.json();
      if (updateData.success) {
        alert("Product updated");

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      } else {
        throw new Error("Update operation failed");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="listproducts">
      <div className="topics">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="products">
        {products.map((item, i) => (
          <div className="itemtile" key={i}>
            <div className="product">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="title">
              <p>{item.name}</p>
            </div>
            <div className="nprice">${item.new_price}</div>
            <div className="oprice">${item.old_price}</div>
            <div className="category">{item.category}</div>
            <div>
              <button id="edit" onClick={() => handleEditProduct(item)}>
                Edit
              </button>
            </div>
            <div className="remove">
              <p
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveProduct(item.id)}
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Listproducts;
