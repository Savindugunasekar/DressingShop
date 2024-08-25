import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ show, onClose, product, onSave }) => {
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: '',
    subcategory: '',
    new_price: '',
    old_price: '',
    size_S: '',
    size_M: '',
    size_L: '',
    size_XL: '',
  });

  useEffect(() => {
    if (product) {
      setProductDetails({
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        new_price: product.new_price,
        old_price: product.old_price,
        size_S: product.size_S,
        size_M: product.size_M,
        size_L: product.size_L,
        size_XL: product.size_XL,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave({
      ...product,
      ...productDetails,
    });
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Product</h2>
        <label>Name:</label>
        <input type="text" name="name" value={productDetails.name} onChange={handleChange} />
        <label>Category:</label>
        <input type="text" name="category" value={productDetails.category} onChange={handleChange} />
        <label>Subcategory:</label>
        <input type="text" name="subcategory" value={productDetails.subcategory} onChange={handleChange} />
        <label>Old Price:</label>
        <input type="number" name="old_price" value={productDetails.old_price} onChange={handleChange} />
        <label>New Price:</label>
        <input type="number" name="new_price" value={productDetails.new_price} onChange={handleChange} />
        <div className='sizes'>
          <div className="size-input">
            <label htmlFor="sizeS">Size S</label><br />
            <input type="number" name="size_S" value={productDetails.size_S} onChange={handleChange} />
          </div>
          <div className="size-input">
            <label htmlFor="sizeM">Size M</label><br />
            <input type="number" name="size_M" value={productDetails.size_M} onChange={handleChange} />
          </div>
          <div className="size-input">
            <label htmlFor="sizeL">Size L</label><br />
            <input type="number" name="size_L" value={productDetails.size_L} onChange={handleChange} />
          </div>
          <div className="size-input">
            <label htmlFor="sizeXL">Size XL</label><br />
            <input type="number" name="size_XL" value={productDetails.size_XL} onChange={handleChange} />
          </div>
        </div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Modal;
