import React, { useContext } from 'react';
import './Newcollection.css';

import Item from '../Item/Item';
import { ShopContext } from '../../context/ShopContext';

const Newcollection = () => {
    
    const { all_product } = useContext(ShopContext);

    
    const lastEightProducts = all_product.slice(-8);

    return (
        <div className='Newcollection'>
            <h1>New Arrivals</h1>
            <div className='new-items'>
                {lastEightProducts.map((item, i) => (
                    <Item 
                        key={i} 
                        id={item.id} 
                        image={item.image} 
                        name={item.name} 
                        new_price={item.new_price} 
                        old_price={item.old_price} 
                    />
                ))}
            </div>
        </div>
    );
}

export default Newcollection;
