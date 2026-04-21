import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                navigate("/");
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
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username: </label>
                        <input 
                            type="text"
                            value={username}
                            onChange ={(e) => setUsername(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label>Password: </label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
}