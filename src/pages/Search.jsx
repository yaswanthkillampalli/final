import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes } from "../api/axiosInstance";
import "../styles.css";

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setQuery(query);
        if (query.length > 2) {
            try {
                const data = await searchRecipes(query);
                setResults(data);
            } catch (error) {
                console.error("Error searching recipes:", error);
            }
        } else {
            setResults([]);
        }
    };

    return (
        <main className="recipe-feed">
            <div className="container">
                <h1 className="mb-4">🔍 Search Recipes</h1>
                <input
                    type="text"
                    placeholder="Search for recipes..."
                    value={query}
                    onChange={handleSearch}
                    className="search-input"
                />
                <div className="row g-4">
                    {results.length === 0 ? (
                        <p>No results found.</p>
                    ) : (
                        results.map((recipe) => (
                            <div className="col-md-4 col-lg-4 col-xl-3" key={recipe._id}>
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}