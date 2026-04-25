
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    // Fetch books
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/books/")
        .then(response => response.json())
        .then(data => setBooks(data.results))
        .catch(error => console.error("Error fetching books:", error));
    }, []);

    const addToCart = (bookId) => {
        const token = localStorage.getItem("token");

        // Redirect to login page if not logged in
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://127.0.0.1:8000/api/cart-items/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            },
            body: JSON.stringify({
                book_id: bookId,
                quantity: 1,
            })
        })
        .then(response => response.json())
        .then(data => console.log("Added to cart:", data))
        .catch(error => console.error("Error adding to cart:", error))
    }

    return (
        <>
            <h1>Books</h1>
            <div>
                {books.map((book) => (
                    <div key={book.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                        <h3>{book.title}</h3>
                        <h4>{book.author}</h4>
                        <p>Price: £{book.price}</p>
                        <p>Stock: {book.stock}</p>

                        <button onClick={() => addToCart(book.id)} disabled={book.stock <= 0}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </>
    );
}