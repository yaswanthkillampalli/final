import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import "../styles.css";

export default function Saved() {
    const navigate = useNavigate();
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        const loadSavedRecipes = async () => {
            try {
                const data = await fetchUserProfile();
                if (data?.savedRecipes) {
                    setSavedRecipes(data.savedRecipes);
                } else {
                    setSavedRecipes([]);
                }
            } catch (error) {
                console.error("Error fetching saved recipes:", error);
            }
        };
        loadSavedRecipes();
    }, []);

    return (
        <>
            <button className="backButton" onClick={() => navigate(-1)}>⬅ Back</button>
            <main className="recipe-feed">
                <div className="container">
                    <h1 className="mb-4">💾 Saved Recipes</h1>
                    <div className="row g-4">
                        {savedRecipes.length === 0 ? (
                            <p>No saved recipes yet.</p>
                        ) : (
                            savedRecipes.map((recipe) => (
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
