import React from 'react'
import './Discountbanner.css'

const Discountbanner = (props) => {
  return (
    <div className='Discountbanner'>
        <div className='content'>
        <h1 className='pt1'>FLAT <span>50%</span> OFF</h1>
        <button>EXPLORE NOW</button>
        </div>

        <div className='image'>
            <img src={props.image} alt="" />
        </div>

        
      
    </div>
  )
}

export default Discountbanner
