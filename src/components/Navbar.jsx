import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "../api/axiosInstance";
import "../styles.css";

export default function Navbar({ isLoggedIn }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (isLoggedIn) {
                try {
                    const data = await fetchUserProfile();
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
        };
        loadUserProfile();
    }, [isLoggedIn]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                {/* Navbar Toggler for Mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Left Section - Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/trending">Trending</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
                    </ul>
                </div>

                {/* Center - Logo */}
                <Link className="navbar-brand mx-auto" to="/">
                    <img src="/recipe-logo.jpg" className="recipe-logo-settings" alt="Recipe Logo" />
                </Link>

                {/* Right Section - Search & Profile */}
                <div className="d-flex align-items-center">
                    {/* Search Icon (Now Visible) */}
                    <i className="fas fa-search search-icon me-3" onClick={() => window.location.href = "/search"}></i>

                    {/* Profile Section */}
                    {isLoggedIn ? (
                        <div className="dropdown">
                            <a href="#" className="profile-toggle" data-bs-toggle="dropdown">
                                <img src={user?.profileImage || "/default-profile.jpg"} alt="Profile" className="rounded-circle profile-img" />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                <li><Link className="dropdown-item" to="/published">Published</Link></li>
                                <li><Link className="dropdown-item" to="/liked">Liked</Link></li>
                                <li><Link className="dropdown-item" to="/saved">Saved</Link></li>
                                <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item logout-btn" to="/logout">Logout</Link></li>
                            </ul>
                        </div>
                    ) : (
                        <Link className="btn btn-outline-success" to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
