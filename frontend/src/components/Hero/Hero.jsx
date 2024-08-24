import React from "react";
import './Hero.css'
import whitegirl from '../Assets/whitegirl-removebg.png'





const Hero = () => {

    

    
    




    return (
        <div className="hero">
            <div className="hero-desc">
                <div className="headings">
                    <h2> Step into the store</h2>
                    <h1>Unleash Your Fasion Story</h1>

                    

                  
                </div>


            </div>
            <div className="hero-image">
                <img src={whitegirl} alt="" />
            </div>
        </div>
    );
}



export default Hero










