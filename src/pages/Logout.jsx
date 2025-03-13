// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        setTimeout(() => navigate("/login", { replace: true }), 1000); // Brief delay for feedback
    }, [navigate]);

    return (
        <div className="logout-container">
            <h2>Logging out...</h2>
            <p>You will be redirected to the login page shortly.</p>
        </div>
    );
}