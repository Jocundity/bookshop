import { useState, useEffect } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token");

    // Fetch orders from database
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/orders/", {
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setOrders(data.results))
        .catch(error => console.error("Error fetching orders:", error ))
    }, [token]);


    return (
        <>
            <h1>My Orders</h1>
            <div>
                {orders.length === 0 ? <p>You haven't placed any orders yet</p> : (
                    orders.map((order) => (
                        <div key={order.id} className="card">
                            <p>Order Placed: {new Date(order.placed).toLocaleString("en-GB")}</p>
                            <p>Order Total: £{Number(order.total_price).toFixed(2)}</p>
                            <hr></hr>
                            <h4 className="items-heading">Items:</h4>
                            {order.items.map((item) => (
                                <div key={item.id} style={{marginBottom: "10px"}}>
                                    <p>Title: {item.book.title}</p>
                                    <p>Price: £{item.book.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Total Price: £{Number(item.total_price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}