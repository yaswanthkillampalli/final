import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import FilterComponent from "../components/FilterComponent"; // ✅ Correct import
import { fetchRecipes } from "../api/axiosInstance";
import "../styles.css";

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [filters, setFilters] = useState({ category: "all", cookingTime: "all" });
    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await fetchRecipes();
                setRecipes(data);
                setFilteredRecipes(data);
            } catch (error) {
                console.error("Error loading recipes:", error);
            }
        };
        loadRecipes();
    }, []);

    const applyFilters = ({ category, cookingTime }) => {
        let filtered = recipes;

        if (category !== "all") {
            filtered = filtered.filter(recipe => recipe.recipeType.toLowerCase() === category);
        }

        if (cookingTime !== "all") {
            filtered = filtered.filter(recipe => {
                const time = recipe.cookingTime || 0;
                if (cookingTime === "30") return time < 30;
                if (cookingTime === "60") return time >= 30 && time <= 60;
                if (cookingTime === "60+") return time > 60;
                return true;
            });
        }

        setFilteredRecipes(filtered);
    };

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} />
            <main className="recipe-feed">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>🍽️ Latest Recipes</h2>
                        <button
                            className="btn btn-outline-secondary"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#filterOffcanvas"
                        >
                            🔍 Filter
                        </button>
                    </div>

                    {/* ✅ Filter Component */}
                    <FilterComponent onFilterApply={applyFilters} />

                    <div className="row g-4">
                        {filteredRecipes.length === 0 ? (
                            <p>No recipes available.</p>
                        ) : (
                            filteredRecipes.map((recipe) => (
                                <div className="col-md-4 col-lg-4 col-xl-3" key={recipe._id}>
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* ✅ Floating "New Post" Button */}
            {isLoggedIn && (
                <Link to="/newpost" className="floating-btn">
                    ➕
                </Link>
            )}
        </>
    );
}
