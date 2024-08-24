import React from 'react';
import './Item.css';


import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <div className="item">
      <Link to = {`/product/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.image} alt="" /></Link>
      
      <div className="item-info">
        <h4>{props.name}</h4>
        <p style={{ fontWeight: 500, fontSize:'25px' }}>
         ${props.new_price} <span style={{ marginLeft: 20, color: 'rgba(0, 0, 0, 0.652)', textDecoration: 'line-through', textDecorationColor: 'rgba(0, 0, 0, 0.447)' }}>${props.old_price}</span>
        </p>
      </div>
    </div>
  );
};

export default Item;
