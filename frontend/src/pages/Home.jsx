
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
        .then(response => {
            if (!response.ok) {
                throw new Error("Error adding item to cart");
            } else {
                alert("Added to cart");
            }

            return response.json()
        })
        .catch(error => alert(error.message));
    }

    return (
        <>
            <div className="hero">
                <h2>Welcome to our shop!</h2>
                <p>Whether you're searching for an elusive first edition or just hoping to stumble upon a forgotten gem,
                     our rare and antique books are sure to tickle your fancy. Let us help you discover your next treasure.</p>
            </div>
            <h1>Books</h1>
            <div className="books">
                {books.map((book) => (
                    <div key={book.id} className="card">
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