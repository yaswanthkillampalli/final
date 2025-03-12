import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        navigate("/login");
    }, [navigate]);

    return (
        <div className="logout-container">
            <h2>Logging out...</h2>
            <p>You will be redirected shortly.</p>
        </div>
    );
}