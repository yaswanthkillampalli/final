import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Recent from "./pages/Recent";
import About from "./pages/About";
import Search from "./pages/Search";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import Published from "./pages/Published";
import Liked from "./pages/Liked";
import Saved from "./pages/Saved";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipe from "./pages/Recipe";
import Navbar from "./components/Navbar";
import "./styles.css";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    // Listen for token changes (e.g., logout or login in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/recent" element={<Recent />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/recipe/:id" element={<Recipe />} />

                {/* Protected Routes - Only accessible when logged in */}
                {isLoggedIn ? (
                    <>
                        <Route path="/newpost" element={<NewPost />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/published" element={<Published />} />
                        <Route path="/liked" element={<Liked />} />
                        <Route path="/saved" element={<Saved />} />
                    </>
                ) : (
                    <>
                        <Route path="/newpost" element={<Navigate to="/login" />} />
                        <Route path="/profile" element={<Navigate to="/login" />} />
                        <Route path="/published" element={<Navigate to="/login" />} />
                        <Route path="/liked" element={<Navigate to="/login" />} />
                        <Route path="/saved" element={<Navigate to="/login" />} />
                    </>
                )}

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 404 Page */}
                <Route path="*" element={<h2 className="container text-center mt-5">404 - Page Not Found</h2>} />
            </Routes>
        </Router>
    );
}
