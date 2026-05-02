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
            <div className="card">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label>Username: </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        ></input>
                    </div>
                    {errors.username && <p className="form-error">{errors.username[0]}</p>}
                    <div className="form-row">
                        <label>Password: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></input>
                    </div>
                    {errors.password && <p className="form-error">{errors.password[0]}</p>}
                    <div className="form-row">
                        <label>Confirm Password: </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    </div>
                    {!passwordMatch && <p className="form-error">Passwords do not match</p>}
                    <button type="submit" disabled={!passwordMatch}>Sign Up</button>
                </form>
            </div>
        </>
    )
}