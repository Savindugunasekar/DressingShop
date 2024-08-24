import React, { useState, useEffect } from 'react';
import { createContext } from 'react';

export const AdminContext = createContext(null);

const AdminContextProvider = (props) => {
    const [all_product, setAllProducts] = useState([]);

    useEffect(() => {
        fetch('https://dressing-shop-server.vercel.app/allproducts')
            .then((res) => res.json())
            .then((data) => setAllProducts(data))
            .catch((error) => console.error('Error fetching all products:', error));
    }, []);

    const contextValue = { all_product };

    return (
        <AdminContext.Provider value={contextValue}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
