import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchRecipes } from "../api/axiosInstance";
import "../styles.css";

export default function Home() {
    const [recipes, setRecipes] = useState([]);

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
            <main className="container mt-5">
                <h2>🍽️ Latest Recipes</h2>
                <div className="row">
                    {recipes.length === 0 ? (
                        <p>No recipes available.</p>
                    ) : (
                        recipes.map((recipe) => (
                            <div className="col-md-4 mb-4" key={recipe._id}>
                                <div className="card recipeCard">
                                    <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{recipe.title}</h5>
                                        <p className="card-text">{recipe.description.substring(0, 50)}...</p>
                                        <Link to={`/recipe/${recipe._id}`} className="btn btn-success">View Recipe</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </>
    );
}
