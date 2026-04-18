import { Link } from "react-router-dom"

export default function Header() {
    return (
        <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <h2>My Bookshop</h2>
            <nav>
                <Link to="/" style={{ marginRight: "10px"} }>Home</Link>
                <Link to="/cart" style={{ marginRight: "10px" }}>Cart</Link>
                <Link to="/orders">Orders</Link>
            </nav>
        </header>
    );
}
