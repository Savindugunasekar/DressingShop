import React from 'react'
import './Sidebar.css'
import addicon from '../../assets/Product_Cart.svg'
import producticon from '../../assets/Product_list_icon.svg'
import { Link } from 'react-router-dom'
const Sidebar = () => {
    return (
        <div className='Sidebar'>

            <Link to='/addproduct/men' style={{ textDecoration: "none" }}>
                <div className='addproductmen'>
                    <img src={addicon} alt="" />
                    <h4 >Add Men's Product</h4>

                </div>
            </Link>
            <Link to='/addproduct/women' style={{ textDecoration: "none" }}>
                <div className='addproductwomen'>
                    <img src={addicon} alt="" />
                    <h4 >Add Women's Product</h4>

                </div>
            </Link>
            <Link to='/addproduct/kids' style={{ textDecoration: "none" }}>
                <div className='addproductkids'>
                    <img src={addicon} alt="" />
                    <h4 >Add Kids Product</h4>

                </div>
            </Link>




            <Link to='/productlist'
                style={{ textDecoration: "none" }} ><div className="productlist">
                    <img src={producticon} alt="" />
                    <h4 >Product List</h4>

                </div></Link>






        </div>
    )
}

export default Sidebar
