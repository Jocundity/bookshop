import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMenuOpen(false);
        navigate("/");
    }

    return (
        <header>
            {!user?.is_staff ? <Link to="/" className="site-title">A.Z. Fell & Co.</Link> : <Link to="/dashboard" className="site-title">A.Z. Fell & Co.</Link>}
            <div className="header-right">
                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <nav className={menuOpen ? "open": ""}>
                {!user?.is_staff && <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>}
                {!user?.is_staff && <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>}
                {!user?.is_staff && <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>}
                {user?.is_staff && <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
                {token ? <button onClick={handleLogout} className="logout-button">Logout</button> : <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>}
            </nav>
        </header>
    );
}
