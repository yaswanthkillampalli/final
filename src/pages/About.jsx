import Navbar from "../components/Navbar";
import "../styles.css";

export default function About() {
    return (
        <>
            <Navbar isLoggedIn={!!localStorage.getItem("token")} />
            <main className="container mt-5">
                <h1>About Us</h1>
                <p>Welcome to the Recipe Sharing Platform, where food lovers can share and discover amazing recipes!</p>
                <h3>Why Use Our Platform?</h3>
                <ul>
                    <li>📌 Share your favorite recipes</li>
                    <li>🔥 Explore trending dishes</li>
                    <li>❤️ Save and like recipes</li>
                    <li>👨‍🍳 Follow top chefs</li>
                </ul>
            </main>
        </>
    );
}
