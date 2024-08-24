import React from "react";
import "./Admin.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Route, Routes,BrowserRouter } from "react-router-dom";
import Addproduct from "../../components/Addproduct/Addproduct";
import Listproducts from "../../components/Listproducts.jsx/Listproducts";
import Updateproduct from "../../components/Updateproduct/Updateproduct";

const Admin = () => {
  return (
    <div className="admin">

        <BrowserRouter>
        
        <Sidebar/>



      <Routes>
        <Route path="/addproduct/men" element={<Addproduct category={'men'} />} />
        <Route path="/addproduct/women" element={<Addproduct category={'women'} />} />
        <Route path="/addproduct/kids" element={<Addproduct category={'kids'} />} />
        <Route path="/productlist" element={<Listproducts />} />
       

      </Routes></BrowserRouter>


      
    </div>
  );
};

export default Admin;
