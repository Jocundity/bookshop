import { useState, useEffect } from "react";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem("token");

    // Fetch cart
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/cart-items/", {
            headers: {
                "Authorization": `Token ${token}`
            }
        })
       .then(response => response.json())
       .then(data => setCartItems(data.results))
       .catch(error => console.error("Error fetching cart: ", error)); 
    }, []);

    const cartTotal = cartItems.reduce((total, item) => {return total + item.total_price}, 0);


    return (
        <>
            <h1>My Cart</h1>
            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                cartItems.map((item) => (
                    <div key={item.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                        <p>Book: {item.book.title}</p>
                        <p>Total: £{item.total_price.toFixed(2)}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>
                ))
            )}
            <h2>Total: £{cartTotal.toFixed(2)}</h2>
            
        </>
    );
}