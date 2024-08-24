import React, { useState,useEffect } from 'react'
import './Popular.css'
import Item from '../Item/Item'
import { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'





const Popular = () => {

  const {all_product} = useContext(ShopContext)

  const popular = all_product.filter((product)=>product.category==='women').slice(-4)




  return (
    <div className='popular'>

      <h1>Popular in Women</h1>
      <div className='popular-items'>

        {popular.map((item,i)=>{
          return <Item key={i} id={item.id} image={item.image} name = {item.name} new_price={item.new_price} old_price = {item.old_price}  />
        }
        )}

      </div>
      
    </div>
  )
}

export default Popular
