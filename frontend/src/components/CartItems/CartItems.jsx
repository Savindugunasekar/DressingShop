import React, { useContext, useState } from 'react';
import './CartItems.css';

import { ShopContext } from '../../context/ShopContext';
import { PayButton } from '../PayButton/PayButton';

const CartItems = (props) => {
    const userId = localStorage.getItem('user');
    const { all_product, cartItems, removeFromCart } = useContext(ShopContext);

    // Calculate purchased items based on cartItems
    const purchasedItemsId = Object.keys(cartItems).filter(key => cartItems[key] !== 0).map(Number);
    const purchasedProducts = all_product.filter(item => purchasedItemsId.includes(item.id));

    // Calculate purchased items with details (id, quantity, size)
    const purchasedItems = Object.keys(cartItems)
        .filter(key => cartItems[key].quantity > 0)
        .map(key => ({
            itemId: parseInt(key),
            quantity: cartItems[key].quantity,
            size: cartItems[key].size
        }));

    // Calculate total cost function
    const totalcost = () => {
        let totalCost = 0;
        for (const product of purchasedProducts) {
            totalCost += cartItems[product.id].quantity * product.new_price;
        }
        return totalCost.toFixed(2);
    };

    const [totalAmount, setTotalAmount] = useState(null);

    // Function to handle checkout
    // const handleCheckout = async () => {
    //     await fetch('http://localhost:4000/checkout', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             userId: userId,
    //             purchasedItems: purchasedItems,
    //             totalAmount: totalcost(), // Call totalcost() to get the current total amount
    //             purchasedProducts:purchasedProducts
    //         })
    //     });
    // };

    return (
        <div className="itemList">
            <div className='topics'>
                <p>Shopping Cart</p>
            </div>

            <table className='cart-table'>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Size</th>
                        <th>Total</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {purchasedProducts.map(item => (
                        <tr className='itemtile' key={item.id}>
                            <td className='product'>
                                <img src={item.image} alt={item.name} />
                            </td>
                            <td className='title'>
                                {item.name}
                            </td>
                            <td className='price'>
                                ${item.new_price}
                            </td>
                            <td className='quantity'>
                                {cartItems[item.id].quantity}
                            </td>
                            <td className='size'>
                                {cartItems[item.id].size}
                            </td>
                            <td className='total'>
                                ${(item.new_price * cartItems[item.id].quantity).toFixed(2)}
                            </td>
                            <td className='remove'>
                                <i onClick={() => removeFromCart(item.id)} className="fa-solid fa-x"></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='totalcost'>
                <h1>Subtotal: ${totalcost()}</h1>
                <PayButton purchasedItems={purchasedItems} purchasedProducts={purchasedProducts} userId={userId} totalAmount={totalAmount}/>
            </div>
        </div>
    );
};

export default CartItems;
