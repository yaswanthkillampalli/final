import { useState } from "react";
import { Link } from "react-router-dom";
import { likeRecipe, saveRecipe } from "../api/axiosInstance";
import "../styles.css";

export default function RecipeCard({ recipe }) {
    const [isLiked, setIsLiked] = useState(recipe.isLiked || false);
    const [isSaved, setIsSaved] = useState(recipe.isSaved || false);

    // Handle like button click
    const handleLike = async () => {
        try {
            await likeRecipe(recipe._id);
            setIsLiked(!isLiked); // Toggle like state
        } catch (error) {
            console.error("Error liking recipe:", error);
        }
    };

    // Handle save button click
    const handleSave = async () => {
        try {
            await saveRecipe(recipe._id);
            setIsSaved(!isSaved); // Toggle save state
        } catch (error) {
            console.error("Error saving recipe:", error);
        }
    };

    return (
        <div className="recipe-card">
            <div className="recipe-header">
                <div className="d-flex align-items-center gap-2">
                    <img src={recipe.author.profileImage} alt="Profile" className="recipe-author-img" />
                    <span className="recipe-author-name">{recipe.author.username}</span>
                </div>
                <button className="btn btn-sm btn-outline-primary follow-btn">Follow</button>
            </div>
            <div className="recipe-img-container">
                <img src={recipe.image} className="recipe-img" alt={recipe.title} />
            </div>
            <div className="recipe-body">
                <h5 className="recipe-title">{recipe.title}</h5>
                <p className="recipe-subtitle text-muted">{recipe.description}</p>
                <div className="recipe-details">
                    <span><i className="fa-solid fa-clock"></i> {recipe.cookingTime} mins</span>
                    <span><i className="fa-solid fa-pepper-hot"></i> {recipe.spiceLevel}</span>
                    <span><i className="fa-solid fa-users"></i> {recipe.servings} servings</span>
                </div>
                <div className="recipe-actions">
                    <button className={`like-btn ${isLiked ? "liked" : ""}`} onClick={handleLike}>
                        <i className="fa-solid fa-heart"></i>
                    </button>
                    <button className="share-btn" title="Share">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                    <button className={`save-btn ${isSaved ? "saved" : ""}`} onClick={handleSave}>
                        <i className="fa-solid fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}