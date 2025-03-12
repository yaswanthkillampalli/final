// src/components/RecipeCard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { likeRecipe, unlikeRecipe, saveRecipe, removeSavedRecipe, shareRecipe, followUserByUsername, fetchCurrentUser } from "../api/axiosInstance";
import "../styles.css";

export default function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const isLoggedIn = !!sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("userId");

    useEffect(() => {
        if (currentUserId) {
            setIsLiked(recipe.likedBy?.some(id => id.toString() === currentUserId));
            setIsSaved(recipe.savedBy?.some(id => id.toString() === currentUserId));
            const checkFollowing = async () => {
                try {
                    const currentUser = await fetchCurrentUser();
                    setIsFollowing(currentUser.following.some(user => user._id.toString() === recipe.author?._id?.toString()));
                } catch (error) {
                    console.error("Error checking following status:", error);
                }
            };
            checkFollowing();
        }
    }, [recipe.likedBy, recipe.savedBy, recipe.author?._id, currentUserId]);

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert("Please log in to like recipes.");
        try {
            if (isLiked) {
                await unlikeRecipe(recipe._id);
                setIsLiked(false);
            } else {
                await likeRecipe(recipe._id);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("❌ Error toggling like:", error);
        }
    };

    const handleSaveToggle = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert("Please log in to save recipes.");
        try {
            if (isSaved) {
                await removeSavedRecipe(recipe._id);
                setIsSaved(false);
            } else {
                await saveRecipe(recipe._id);
                setIsSaved(true);
            }
        } catch (error) {
            console.error("❌ Error toggling save:", error);
        }
    };

    const handleShare = (e) => {
        e.preventDefault();
        shareRecipe(recipe._id);
    };

    const handleFollow = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert("Please log in to follow users.");
        try {
            await followUserByUsername(recipe.author.username);
            setIsFollowing(true);
        } catch (error) {
            console.error("❌ Error following user:", error);
        }
    };

    const handleViewRecipe = (e) => {
        e.preventDefault();
        if (!recipe._id) {
            console.error("❌ Recipe ID is missing!");
            return;
        }
        navigate(`/recipe/${recipe._id}`);
    };

    return (
        <div className="recipe-card">
            <div className="recipe-header">
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={recipe.author?.profileImage || "/default-profile.jpg"}
                        alt="Profile"
                        className="recipe-author-img"
                    />
                    <span className="recipe-author-name">{recipe.author?.username || "Unknown User"}</span>
                </div>
                {isLoggedIn && currentUserId !== recipe.author?._id?.toString() && (
                    <button
                        className={`follow-btn ${isFollowing ? "following" : ""}`}
                        onClick={handleFollow}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                )}
            </div>

            <div className="recipe-img-container">
                <img src={recipe.image || "/default-recipe.jpg"} className="recipe-img" alt={recipe.title} />
            </div>

            <div className="recipe-body">
                <h5 className="recipe-title">{recipe.title}</h5>
                <div className="recipe-details">
                    <span><i className="fa-solid fa-clock"></i> {recipe.cookingTime || "N/A"}</span>
                    <span><i className="fa-solid fa-user-group"></i> {recipe.servings || "N/A"} servings</span>
                    <span><i className="fa-solid fa-gauge"></i> {recipe.difficulty || "N/A"}</span>
                </div>
                <div className={`recipe-actions ${!isLoggedIn ? "logged-out" : ""}`}>
                    {isLoggedIn ? (
                        <>
                            <button
                                className={`like-btn ${isLiked ? "liked" : ""}`}
                                onClick={handleLikeToggle}
                                title={isLiked ? "Unlike" : "Like"}
                            >
                                <i className="fa-solid fa-heart"></i>
                            </button>
                            <button className="share-btn" onClick={handleShare} title="Share">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                            <button
                                className={`save-btn ${isSaved ? "saved" : ""}`}
                                onClick={handleSaveToggle}
                                title={isSaved ? "Unsave" : "Save"}
                            >
                                <i className="fa-solid fa-bookmark"></i>
                            </button>
                        </>
                    ) : (
                        <button className="share-btn" onClick={handleShare} title="Share">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    )}
                </div>
            </div>

            <Link
                to={`/recipe/${recipe._id}`}
                className="btn btn-sm btn-outline-success mt-2 w-100"
                onClick={handleViewRecipe}
            >
                View Recipe
            </Link>
            {isLoggedIn && currentUserId === recipe.author?._id?.toString() && (
                <Link
                    to={`/edit/${recipe._id}`}
                    className="btn btn-sm btn-outline-primary mt-2 w-100"
                >
                    Edit Recipe
                </Link>
            )}
        </div>
    );
}