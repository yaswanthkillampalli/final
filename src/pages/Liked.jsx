import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import "../styles.css";

export default function Liked() {
    const navigate = useNavigate();
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!sessionStorage.getItem("token");

    useEffect(() => {
        const loadLikedRecipes = async () => {
            if (!isLoggedIn) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                const data = await fetchUserProfile();
                if (data?.likedRecipes) {
                    setLikedRecipes(data.likedRecipes);
                } else {
                    setLikedRecipes([]);
                }
            } catch (error) {
                console.error("Error fetching liked recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        loadLikedRecipes();
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;
    if (loading) return <p className="loading-text">Loading liked recipes...</p>;

    return (
        <>
            <button className="backButton" onClick={() => navigate(-1)}>⬅ Back</button>
            <main className="recipe-feed">
                <div className="container">
                    <h1 className="mb-4">❤️ Liked Recipes</h1>
                    <div className="row g-4">
                        {likedRecipes.length === 0 ? (
                            <p>No liked recipes yet.</p>
                        ) : (
                            likedRecipes.map((recipe, index) => (
                                <div className="col-md-4 col-lg-4 col-xl-3" key={recipe._id || index}>
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
