import React, { useContext } from 'react';
import './Related.css';

import Item from '../Item/Item';
import { ShopContext } from '../../context/ShopContext';

const Related = (props) => {
    const { all_product } = useContext(ShopContext);
    const {relatedproducts } = props;

    // Filter related products based on the category
    const relatedProducts = all_product.filter(item => item.category ===relatedproducts.category);

    // Shuffle the related products array
    const shuffledProducts = relatedProducts.sort(() => Math.random() - 0.5);

    // Take the first four items
    const randomProducts = shuffledProducts.slice(0, 4);

    return (
        <div className='related'>
            <h2>Related Products</h2>
            <div className="relateditems">
                {randomProducts.map((item, i) => (
                    <Item key={i} id={item.id} image={item.image} name={item.name} new_price={item.new_price} old_price={item.old_price} />
                ))}
            </div>
        </div>
    );
};

export default Related;
