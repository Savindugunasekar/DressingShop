import React from 'react'
import './Newsletter.css'

const Newsletter = () => {
  return (
    <div className='Newsletter'>

        <h1>Unlock Exclusive Deals Delivered Straight to Your Inbox!</h1>
        <p>Subscribe to our newsletter and stay updated</p>
        <div className='input-box'>
            <input type="emai" placeholder='Your email id' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default Newsletter
