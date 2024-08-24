import React, { useState } from 'react';
import './Addproduct.css';
import uploadarea from '../../assets/upload_area.svg';

const Addproduct = (props) => {
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: props.category,
        subcategory: '',
        new_price: null,
        old_price: null,
        size_S: null,
        size_M: null,
        size_L: null,
        size_XL: null,
        image: ""
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const productHandler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        });
    };

    const addProduct = async () => {
        setLoading(true);
        let product = { ...productDetails };
        let formData = new FormData();
        formData.append('image', image);

        try {
           
            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });
            const uploadData = await uploadResponse.json();

            if (uploadData.success) {
                
                product.image = uploadData.image_url;

               
                const productResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
                const productData = await productResponse.json();

                if (productData.success) {
                    alert("Product added successfully");
                    resetForm();
                } else {
                    alert("Failed to add product");
                }
            } else {
                alert("Image upload failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the product");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setProductDetails({
            name: "",
            category: props.category,
            subcategory: '',
            new_price: null,
            old_price: null,
            size_S: null,
            size_M: null,
            size_L: null,
            size_XL: null,
            image: ""
        });
        setImage(null);
    };

    const renderSubcategory = () => {
        const subcategories = {
            men: ["T-shirt", "Shirt", "Hoodie"],
            women: ["Dresses", "T-shirt", "Blouse"],
            kids: ["T-shirt", "Shirt", "Hoodie"]
        };

        return (
            <div className="subcategory">
                <label>Sub Category</label><br />
                <select onChange={productHandler} value={productDetails.subcategory} name='subcategory' id="subproductcategory">
                    <option value="">Select</option>
                    {subcategories[props.category]?.map(subcategory => (
                        <option key={subcategory} value={subcategory.toLowerCase()}>{subcategory}</option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className='productform'>
            <div className='formcontainer'>
                <div className="productname">
                    <label htmlFor="productname">Product Title</label><br />
                    <input
                        type="text"
                        id="productname"
                        name="name"
                        value={productDetails.name}
                        onChange={productHandler}
                    />
                </div>
                <div className='prices'>
                    <div className="price1">
                        <label htmlFor="price">Price</label><br />
                        <input
                            type="number"
                            id='price'
                            name='old_price'
                            value={productDetails.old_price}
                            onChange={productHandler}
                        />
                    </div>
                    <div className="price2">
                        <label htmlFor="offerprice">Offer Price</label><br />
                        <input
                            type="number"
                            id='offerprice'
                            name='new_price'
                            value={productDetails.new_price}
                            onChange={productHandler}
                        />
                    </div>
                </div>
                <div className='sizes'>
                    <div className="size-input">
                        <label htmlFor="sizeS">Size S</label><br />
                        <input
                            type="number"
                            id='sizeS'
                            name='size_S'
                            value={productDetails.size_S}
                            onChange={productHandler}
                        />
                    </div>
                    <div className="size-input">
                        <label htmlFor="sizeM">Size M</label><br />
                        <input
                            type="number"
                            id='sizeM'
                            name='size_M'
                            value={productDetails.size_M}
                            onChange={productHandler}
                        />
                    </div>
                    <div className="size-input">
                        <label htmlFor="sizeL">Size L</label><br />
                        <input
                            type="number"
                            id='sizeL'
                            name='size_L'
                            value={productDetails.size_L}
                            onChange={productHandler}
                        />
                    </div>
                    <div className="size-input">
                        <label htmlFor="sizeXL">Size XL</label><br />
                        <input
                            type="number"
                            id='sizeXL'
                            name='size_XL'
                            value={productDetails.size_XL}
                            onChange={productHandler}
                        />
                    </div>
                </div>
                {renderSubcategory()}
                <div className="imageinput">
                    <label htmlFor="productimage" className="upload-icon">
                        <img src={image ? URL.createObjectURL(image) : uploadarea} alt="Upload" style={{ height: "120px", margin: "20px 0" }} />
                    </label>
                    <input
                        type="file"
                        id="productimage"
                        name="image"
                        className="file-input"
                        accept="image/*"
                        onChange={imageHandler}
                        hidden
                    />
                </div>
                <div className="submitbutton">
                    <button onClick={addProduct} disabled={loading}>
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Addproduct;
