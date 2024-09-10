import React, { useContext } from "react";
import './Hero.css'
import whitegirl from '../Assets/whitegirl-removebg.png'
import { ShopContext } from "../../context/ShopContext";





const Hero = () => {

    const {auth} = useContext(ShopContext)

    

    
    




    return (
        <div className="hero">
            <div className="hero-desc">
                <div className="headings">
                    <h2> Step into the store</h2>
                    <h1>Unleash Your Fasion Story</h1>

                    <h1>acccesstoken {auth.accessToken}</h1>
                    <h1>userId: {auth.userId}</h1>

                    

                  
                </div>


            </div>
            <div className="hero-image">
                <img src={whitegirl} alt="" />
            </div>
        </div>
    );
}



export default Hero










