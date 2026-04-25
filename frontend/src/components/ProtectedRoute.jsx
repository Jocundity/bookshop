
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    
    // Redirect to login page if user is not logged in
    if (!token) {
        return <Navigate to="/login" />
    }

    return children;

}