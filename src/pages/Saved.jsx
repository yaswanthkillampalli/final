import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api/axiosInstance";
import "../styles.css"; // Import Global Styles

export default function Saved() {
    const navigate = useNavigate();
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        const loadSavedRecipes = async () => {
            try {
                const data = await fetchUserProfile();
                setSavedRecipes(data.savedRecipes);
            } catch (error) {
                console.error("Error fetching saved recipes:", error);
            }
        };
        loadSavedRecipes();
    }, []);

    return (
        <>
            <button className="backButton" onClick={() => navigate(-1)}>⬅ Back</button>
            <main className="container mt-4">
                <h1>💾 Saved Recipes</h1>
                <div className="row">
                    {savedRecipes.length === 0 ? (
                        <p>No saved recipes yet.</p>
                    ) : (
                        savedRecipes.map((recipe) => (
                            <div className="col-md-4 mb-4" key={recipe._id}>
                                <div className="card recipeCard">
                                    <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{recipe.title}</h5>
                                        <p className="card-text">{recipe.description.substring(0, 50)}...</p>
                                        <button className="btn btn-outline-danger">❤️ {recipe.likes}</button>
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
