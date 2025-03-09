import { useState } from "react";
import { searchRecipes } from "../api/axiosInstance";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setQuery(query);
        if (query.length > 2) {
            const data = await searchRecipes(query);
            setResults(data);
        }
    };

    return (
        <main className="container mt-4">
            <input type="text" placeholder="Search for recipes..." value={query} onChange={handleSearch} />
            <ul>
                {results.map((recipe) => (
                    <li key={recipe._id}>{recipe.title}</li>
                ))}
            </ul>
        </main>
    );
}
