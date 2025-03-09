import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { fetchTrendingRecipes } from "../api/axiosInstance";
import "../styles.css";

export default function Trending() {
    const [trendingRecipes, setTrendingRecipes] = useState([]);

    useEffect(() => {
        const loadTrendingRecipes = async () => {
            try {
                const data = await fetchTrendingRecipes();
                setTrendingRecipes(data);
            } catch (error) {
                console.error("Error fetching trending recipes:", error);
            }
        };
        loadTrendingRecipes();
    }, []);

    return (
        <>
            <Navbar isLoggedIn={!!localStorage.getItem("token")} />
            <main className="container mt-5">
                <h2>🔥 Trending Recipes</h2>
                <div className="row">
                    {trendingRecipes.map((recipe) => (
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
                    ))}
                </div>
            </main>
        </>
    );
}
