import { Link, useNavigate } from "react-router-dom"

export default function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <h2>My Bookshop</h2>
            <nav>
                <Link to="/" style={{ marginRight: "10px"}}>Home</Link>
                <Link to="/cart" style={{ marginRight: "10px" }}>Cart</Link>
                <Link to="/orders" style={{ marginRight: "10px" }}>Orders</Link>
                {token ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
            </nav>
        </header>
    );
}
