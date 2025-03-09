import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { fetchRecipes } from "../api/axiosInstance";
import "../styles.css";

export default function Home() {
    const [recipes, setRecipes] = useState([]);

    // Fetch recipes on component mount
    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await fetchRecipes();
                setRecipes(data);
            } catch (error) {
                console.error("Error loading recipes:", error);
            }
        };
        loadRecipes();
    }, []);

    return (
        <>
            <Navbar isLoggedIn={!!localStorage.getItem("token")} />
            <main className="recipe-feed">
                <div className="container">
                    <h2 className="mb-4">🍽️ Latest Recipes</h2>
                    <div className="row g-4">
                        {recipes.length === 0 ? (
                            <p>No recipes available.</p>
                        ) : (
                            recipes.map((recipe) => (
                                <div className="col-md-4 col-lg-4 col-xl-3" key={recipe._id}>
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}