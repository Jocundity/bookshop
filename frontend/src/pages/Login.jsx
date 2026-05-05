import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }), 
        })
        .then(response => response.json())
        .then((data) => {
            if(data.token) {
                localStorage.setItem("token", data.token);

                // Get user info (username, and is_staff)
                fetch("http://127.0.0.1:8000/api/me/", {
                    headers: {
                        "Authorization": `Token ${data.token}`
                    }
                })
                .then(response => response.json())
                .then(user => {
                    localStorage.setItem("user", JSON.stringify(user));
                    navigate("/");
                });
                
            } else {
                alert("Invalid credentials")
                setUsername("");
                setPassword("");
            }
        })
        .catch(error => console.error(error))

    }

    return (
        <>
            <div className="card">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Username: </label>
                        <input 
                            type="text"
                            value={username}
                            onChange ={(e) => setUsername(e.target.value)}
                        ></input>
                    </div>
                    <div className="form-row">
                        <label>Password: </label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                </form>
                <p>Not registered with us yet? Click <Link to="/signup">here</Link> to sign up.</p>
            </div>
        </>
    );
}