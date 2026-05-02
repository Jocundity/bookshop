import { useState, useEffect } from "react";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem("token");

    // Fetch cart from database
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/cart-items/", {
            headers: {
                "Authorization": `Token ${token}`
            }
        })
       .then(response => response.json())
       .then(data => setCartItems(data.results))
       .catch(error => console.error("Error fetching cart: ", error)); 
    }, [token]);

    const cartTotal = cartItems.reduce((total, item) => {return total + item.total_price}, 0);

    const updateQuantity = (item, amount) => {
        const newQuantity = item.quantity + amount;

        // Don't let quantity drop below one or go above stock lovel
        if (newQuantity < 1 || newQuantity > item.book.stock) {
            return
        }

        // Update quantity in database
        fetch(`http://127.0.0.1:8000/api/cart-items/${item.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                quantity: newQuantity
            })
        })
        .then(response => response.json())
        // Display cart on page
        .then(data => setCartItems((prev) => 
            prev.map(i => 
            i.id === item.id ? data : i)
            )
        )
        .catch(error => console.error("Error updating cart: ", error));
    }

    const removeItem = (item) => {
        const confirmed = confirm("Are you sure you want to remove this item?");
        if (!confirmed) {
            return;
        }

        const itemId = item.id;

        // Remove item from database
        fetch(`http://127.0.0.1:8000/api/cart-items/${itemId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${token}`,
            }
        })
        // Update cart on page
        .then(() => setCartItems((prev) => 
            prev.filter((item) => item.id != itemId)))
        .catch(error => console.error("Error deleting item: ", error));
    }

    // Checkout (clear cart and reduce stock)
    const handleCheckout = () => {
        const confirmed = confirm("Are you sure ypu want to place this order?");
        if (!confirmed) {
            return;
        }

        fetch("http://127.0.0.1:8000/api/orders/checkout/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Checkout failed");
            }
            return response.json();
        })
        .then(data => {
            alert("Order placed successfully!");

            // Clear cart on page
            setCartItems([]);
        })
        .catch(error => alert(error.message));

    }

    return (
        <>
            <h1>My Cart</h1>
            <div className="card">
                {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                    <>
                        {cartItems.map((item) => (
                        <div key={item.id}>
                            <div className="cart-row">
                                <img className="thumbnail" src={item.book.thumbnail} alt={item.book.title} />
                                <div>
                                    <p>Book: {item.book.title}</p>
                                    <p>Total: £{item.total_price.toFixed(2)}</p>
                                    <br></br>
                                    <p >Quantity:
                                        <button onClick={() => updateQuantity(item, -1)} disabled={item.quantity <= 1} style={{ margin: "0 10px" }}>-</button>{item.quantity}
                                        <button onClick={() => updateQuantity(item, 1)} disabled={item.quantity >= item.book.stock} style={{ marginLeft: "10px" }}>+</button>
                                    </p>
                                    <br></br>
                                    {item.quantity >= item.book.stock && <p className="form-error">Only {item.book.stock} in stock</p>}
                                    <button onClick={() => removeItem(item)}>Remove</button>
                                </div>
                            </div>

                            <hr></hr>
                        </div>
                        ))}
                        <h2> Total: £{cartTotal.toFixed(2)}</h2>
                        <button onClick={handleCheckout}>Checkout</button>
                    </>
                )}
                
            </div>
            
        </>
    );
}