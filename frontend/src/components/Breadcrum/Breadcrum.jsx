import React from 'react'
import './Breadcrum.css'

const Breadcrum = (props) => {

    const {product} =props;

  return (
    <div className='Breadcrum'>

        HOME <i class="fa-solid fa-angle-right"></i> SHOP <i class="fa-solid fa-angle-right"></i> {product.category} <i class="fa-solid fa-angle-right"></i> {product.name}


      
    </div>
  )
}

export default Breadcrum
