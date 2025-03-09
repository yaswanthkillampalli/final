import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api/axiosInstance";
import "../styles.css";

export default function Liked() {
    const navigate = useNavigate();
    const [likedRecipes, setLikedRecipes] = useState([]);

    useEffect(() => {
        const loadLikedRecipes = async () => {
            try {
                const data = await fetchUserProfile();
                setLikedRecipes(data.likedRecipes);
            } catch (error) {
                console.error("Error fetching liked recipes:", error);
            }
        };
        loadLikedRecipes();
    }, []);

    return (
        <>
            <button className="backButton" onClick={() => navigate(-1)}>⬅ Back</button>
            <main className="container mt-4">
                <h1>❤️ Liked Recipes</h1>
                <div className="row">
                    {likedRecipes.length === 0 ? (
                        <p>No liked recipes yet.</p>
                    ) : (
                        likedRecipes.map((recipe) => (
                            <div className="col-md-4 mb-4" key={recipe._id}>
                                <div className="card recipeCard">
                                    <img src={recipe.image} className="card-img-top" alt={recipe.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{recipe.title}</h5>
                                        <p className="card-text">{recipe.description.substring(0, 50)}...</p>
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
