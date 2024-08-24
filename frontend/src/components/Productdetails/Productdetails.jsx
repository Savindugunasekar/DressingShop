import React, { useContext } from 'react'
import './Productdetails.css'
import { ShopContext } from '../../context/ShopContext';
import { useState } from 'react';




const Productdetails = (props) => {

  const { productinfo } = props;

  const {addToCart} = useContext(ShopContext)
  const [size,setSize]= useState('S')
  const [count,setCount]= useState(1)

  const handleSizeClick = (newSize) => {
    setSize(newSize);
    
  };

  const getRemainingItems = () => {
    switch (size) {
      case 'S':
        return productinfo.s;
      case 'M':
        return productinfo.me;
      case 'L':
        return productinfo.l;
      case 'XL':
        return productinfo.xl;
      default:
        return 0;
    }
  };

  const addCount = ()=>{
    setCount(prevCount=>prevCount+1)
  }

  const reductCount =()=>{
   setCount( prevCount=> (prevCount>1 ? prevCount-1 : 1) )
  }





  return (
    <div className='productdetails'>
      <div className="slides">
        <div className="image-container">
          <img src={productinfo.image} alt="" />
        </div>
        <div className="image-container">
          <img src={productinfo.image} alt="" />
        </div>
        <div className="image-container">
          <img src={productinfo.image} alt="" />
        </div>
        <div className="image-container">
          <img src={productinfo.image} alt="" />
        </div>
      </div>

      <div className="bigimage">
        <img src={productinfo.image} alt="" />
      </div>

      <div className="info">
        <h1 className='text-3xl'>{productinfo.name}</h1>
       
      <div className='prices'>
        <p>${productinfo.new_price} <span>${productinfo.old_price}</span></p>
      </div>

      <div className='dressdescription'>
        Flattering flutter sleeves and a chic overlap collar elevate this striped peplum hem blouse for sophisticated style.
      </div>

      <h2 className='text-xl mb-2'>Choose your size:</h2>

      <div className='sizes'>
      
      <div className={`sizebox ${size === 'S' ? 'active' : ''}`} onClick={() => handleSizeClick('S')}>
        S
      </div>
      <div className={`sizebox ${size === 'M' ? 'active' : ''}`} onClick={() => handleSizeClick('M')}>
        M
      </div>
      <div className={`sizebox ${size === 'L' ? 'active' : ''}`} onClick={() => handleSizeClick('L')}>
        L
      </div>
      <div className={`sizebox ${size === 'XL' ? 'active' : ''}`} onClick={() => handleSizeClick('XL')}>
        XL
      </div>
    </div>

    <p>Remaining items: {getRemainingItems()}</p>

    <div className='flex items-center mt-5'>

    <i onClick={addCount} class="countbox fa-solid fa-plus"></i>
    <p className='text-2xl font-semibold mx-5'>{count}</p>
    <i onClick={reductCount} class="countbox fa-solid fa-minus"></i>

    </div>

      <button onClick={()=>{addToCart(productinfo.id,size,count)}}>ADD TO CART</button>

      </div>
    </div>

  )
}

export default Productdetails
