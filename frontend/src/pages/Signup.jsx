import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    // Password validator
    const passwordMatch = password === confirmPassword;

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({}); // clear previous errors
        
        fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    // retrieve errors from serializer and throw to catch block
                    throw data; 
                }
                return data;
            });   
        })
        .then(() => {
            alert("Account created successfully! Please log in.")
            navigate("/login");
        })
        .catch(error => {
            if (error.username || error.password) {
                setErrors(error);
            }
            else {
                alert("Something went wrong. Please try again.");
            }
        });
    };

    

    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    ></input>
                    {errors.username && <p style={{ color: "red" }}>{errors.username[0]}</p>}
                </div>
                <div>
                    <label>Password: </label>
                    <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ></input>
                    {errors.password && <p style={{ color: "red" }}>{errors.password[0]}</p>}
                </div>
                <div>
                    <label>Confirm Password: </label>
                    <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    {!passwordMatch && <p style={{ color: "red" }}>Passwords do not match</p>}
                </div>
                <button type="submit" disabled={!passwordMatch}>Sign Up</button>
            </form>
        </>
    )
}