import { useState } from "react";
import { useEffect } from "react";
import Modal from "../components/Modal";

export default function Dashboard() {
    const token = localStorage.getItem("token");

    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");

    const [addBookModal, setAddBookModal] = useState(false);

    const [editBookModal, setEditBookModal] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);

    // Add Book form variables
    const [addThumbnail, setAddThumbnail] = useState(null);
    const [addTitle, setAddTitle] = useState("");
    const [addAuthor, setAddAuthor] = useState("");
    const [addSellersNote, setAddSellersNote] = useState("");
    const [addPrice, setAddPrice] = useState("");
    const [addStock, setAddStock] = useState(0);

    // Fetch books
    useEffect(() => {
        const url = search ? `http://127.0.0.1:8000/api/books/?search=${search}` :
            "http://127.0.0.1:8000/api/books/"

        fetch(url)
            .then(response => response.json())
            .then(data => setBooks(data.results))
            .catch(error => console.error("Error fetching books:", error));
    }, [search]);

    // Delete book from database
    const handleDelete = (book) => {
        const bookId = book.id;

        const confirmed = confirm("Are you sure you want to delete this book?");
        if (!confirmed) {
            return;
        }

        fetch(`http://127.0.0.1:8000/api/books/${bookId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error deleting book from database");
            }

            alert("Book deleted successfully.");

            // Update books on screen
            setBooks(prev => prev.filter(book => book.id != bookId));
        })
        .catch(error => alert(error));
    };

    // Add book to database
    const handleAdd =(e) => {
        e.preventDefault();

        // Ensure that prices are positive and contain 2 decimal places
        const priceRegex = /^(0|[1-9]\d*)\.\d{2}$/;
        if(!priceRegex.test(addPrice)) {
            alert("Please enter a valid price (e.g. 1.50).");
            return;
        }

        const formData = new FormData();
        formData.append("thumbnail", addThumbnail);
        formData.append("title", addTitle);
        formData.append("author", addAuthor);
        formData.append("seller_note", addSellersNote);
        formData.append("price", addPrice);
        formData.append("stock", addStock);

        fetch("http://127.0.0.1:8000/api/books/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`
            },
            body: formData
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    throw data;
                }
                return data;
            })
        })
        .then((data) => {
            alert("Item added successfully");

            // Close modal and reset form
            setAddBookModal(false);
            setAddThumbnail(null);
            setAddTitle("");
            setAddAuthor("");
            setAddSellersNote("");
            setAddPrice("");
            setAddStock(0);


            // Update books on page
            setBooks(prev => [...prev, data])
        })
        .catch(error => alert(error));
    };

    // Update book data in database
    const handleEdit = (e) => {
        e.preventDefault();

        const confirmed = confirm("Are you sure you want to make these changes?");
        if (!confirmed) {
            return;
        }

        const formData = new FormData();
        if (addThumbnail instanceof File) {
            formData.append("thumbnail", addThumbnail);
        }
        formData.append("title", addTitle);
        formData.append("author", addAuthor);
        formData.append("seller_note", addSellersNote);
        formData.append("price", addPrice);
        formData.append("stock", addStock);

        fetch(`http://127.0.0.1:8000/api/books/${currentBook.id}/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Token ${token}`
            },
            body: formData
        })
        .then(response => response.json().then(data => {
            if (!response.ok) {
                throw new Error(JSON.stringify(data));
            }
            return data;
        }))
        .then (data => {
            alert("Book updated successfully.");

            // Show updated book data on page
            setBooks(prev => prev.map(book => book.id === data.id ? data : book));

            // Close modal and reset current book
            setEditBookModal(false);
            setCurrentBook(null);
        })
        .catch(error => alert(error.message));
    };

    return (
        <>
            <h1>Book Seller's Dashboard</h1>
            <div className="inventory">
                <div className="inventory-header">
                    <h2>Manage your inventory</h2>
                    <button onClick={() => {
                        setAddBookModal(true);
                        setAddThumbnail(null);
                        setAddTitle("");
                        setAddAuthor("");
                        setAddSellersNote("");
                        setAddPrice("");
                        setAddStock(0);
                        }}>Add Book</button>
                    <Modal isOpen={addBookModal} onClose={() => setAddBookModal(false)}>
                        <form onSubmit={handleAdd}>
                            <h2>Add Book</h2>
                            <div className="form-row">
                                <label>Cover Image: </label>
                                <input
                                    required
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setAddThumbnail(e.target.files[0])}
                                ></input>
                            </div>
                            <div className="form-row">
                                <label>Title: </label>
                                <input
                                    required
                                    type="text"
                                    value={addTitle}
                                    onChange={(e) => setAddTitle(e.target.value)}
                                ></input>
                            </div>
                            <div className="form-row">
                                <label>Author: </label>
                                <input
                                    required
                                    type="text"
                                    value={addAuthor}
                                    onChange={(e) => setAddAuthor(e.target.value)}></input>
                            </div>
                            <div className="form-row">
                                <label>Book Seller's Note: </label>
                                <input
                                    required
                                    type="text"
                                    value={addSellersNote}
                                    onChange={(e) => setAddSellersNote(e.target.value)}></input>
                            </div>
                            <div className="form-row">
                                <label>Price: </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="1.00"
                                    value={addPrice}
                                    onChange={(e) => setAddPrice(e.target.value)}></input>
                            </div>
                            <div className="form-row">
                                <label>Stock: </label>
                                <input
                                    required
                                    type="number"
                                    value={addStock}
                                    min="0"
                                    step="1"
                                    onChange={(e) => setAddStock(e.target.value)}></input>
                            </div>
                            <button type="submit">Submit</button>
                        </form>
                    </Modal>
                </div>
                <div className="search">
                    <input type="text"
                        placeholder="🔎 Seach by author or title"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}></input>
                </div>

                <div className="books">
                    {books.map((book) => (
                        <div key={book.id} className="card">
                            <img className="thumbnail" src={book.thumbnail} alt={book.title} />
                            <h3>{book.title}</h3>
                            <h4>{book.author}</h4>
                            <p>Book Seller's Note: {book.seller_note}</p>
                            <hr></hr>
                            <p>Price: £{book.price}</p>
                            <p>Stock: {book.stock}</p>
                            <button className="delete-button" onClick={() => handleDelete(book)}>Delete</button>
                            <button 
                                onClick={() => {
                                    setEditBookModal(true);
                                    setCurrentBook(book);
                                    setAddThumbnail(null);
                                    setAddTitle(book.title);
                                    setAddAuthor(book.author);
                                    setAddSellersNote(book.seller_note);
                                    setAddPrice(book.price);
                                    setAddStock(book.stock);
                                }}
                                style={{marginLeft: "1rem"}}>Edit</button>
                        </div>
                    ))}
                    <Modal isOpen={editBookModal} onClose={() => setEditBookModal(false)}>
                        <form onSubmit={handleEdit}>
                            <h2>Edit Book</h2>
                            <div className="form-row">
                                <label>Cover Image: </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setAddThumbnail(e.target.files[0])}
                                ></input>
                            </div>
                            <div className="form-row">
                                <label>Title: </label>
                                <input
                                    required
                                    type="text"
                                    value={addTitle}
                                    onChange={(e) => setAddTitle(e.target.value)}
                                ></input>
                            </div>
                            <div className="form-row">
                                <label>Author: </label>
                                <input
                                    required
                                    type="text"
                                    value={addAuthor}
                                    onChange={(e) => setAddAuthor(e.target.value)}></input>
                            </div>
                            <div className="form-row">
                                <label>Book Seller's Note: </label>
                                <input
                                    required
                                    type="text"
                                    value={addSellersNote}
                                    onChange={(e) => setAddSellersNote(e.target.value)}></input>
                            </div>
                            <div className="form-row">
                                <label>Price: </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="1.00"
                                    value={addPrice}
                                    onChange={(e) => setAddPrice(e.target.value)}></input>
                            </div>
                            <div className="form-row">
                                <label>Stock: </label>
                                <input
                                    required
                                    type="number"
                                    value={addStock}
                                    min="0"
                                    step="1"
                                    onChange={(e) => setAddStock(e.target.value)}></input>
                            </div>
                            <button type="submit">Submit changes</button>
                        </form>
                    </Modal>
                </div>

            </div>
        </>
    );
}