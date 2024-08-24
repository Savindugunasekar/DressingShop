import React from 'react'

export const PayButton = ({purchasedProducts,purchasedItems,userId,totalAmount}) => {

    const handleCheckout = async()=>{

        try {

            const response = await fetch('http://localhost:4000/stripe/create-checkout-session',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    purchasedItems,
                    purchasedProducts,
                    userId,
                    totalAmount
                })
            })
    
            const data = await response.json()
    
            if(data.url){
                window.location.href = data.url
            }
    
            
        } catch (error) {

            throw(error)
            
        }

        

    }

  return (
    <>
      <button onClick={() => handleCheckout()}>Check out</button>
    </>
  )
}
