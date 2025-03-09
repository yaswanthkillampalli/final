import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/axiosInstance";
import "../styles.css";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(formData);
            navigate("/home");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <div className="password-container">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <button type="submit">Login</button>
                {message && <p className="error-message">{message}</p>}
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
}
