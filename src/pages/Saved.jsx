import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, deleteRecipe } from "../api/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import "../styles.css";

export default function Published() {
    const navigate = useNavigate();
    const [publishedRecipes, setPublishedRecipes] = useState([]);

    useEffect(() => {
        const loadPublishedRecipes = async () => {
            try {
                const data = await fetchUserProfile();
                setPublishedRecipes(data.publishedRecipes);
            } catch (error) {
                console.error("Error fetching published recipes:", error);
            }
        };
        loadPublishedRecipes();
    }, []);

    // Handle recipe deletion
    const handleDelete = async (recipeId) => {
        try {
            await deleteRecipe(recipeId);
            setPublishedRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    return (
        <>
            <button className="backButton" onClick={() => navigate(-1)}>⬅ Back</button>
            <main className="recipe-feed">
                <div className="container">
                    <h1 className="mb-4">📌 Published Recipes</h1>
                    <div className="row g-4">
                        {publishedRecipes.length === 0 ? (
                            <p>No published recipes yet.</p>
                        ) : (
                            publishedRecipes.map((recipe) => (
                                <div className="col-md-4 col-lg-4 col-xl-3" key={recipe._id}>
                                    <RecipeCard recipe={recipe} />
                                    <div className="recipe-actions mt-2">
                                        <button
                                            className="btn btn-outline-primary btn-sm me-2"
                                            onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(recipe._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}