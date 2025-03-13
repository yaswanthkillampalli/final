// src/components/RecipeCard.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { likeRecipe, unlikeRecipe, saveRecipe, removeSavedRecipe, shareRecipe, followUserByUsername, unfollowUserByUsername, fetchCurrentUser, fetchRecipeById } from "../api/axiosInstance";
import "../styles.css";

export default function RecipeCard({ recipe, onUpdate }) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(recipe.likes?.length || 0);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const isLoggedIn = !!sessionStorage.getItem("token");
    const currentUserId = sessionStorage.getItem("userId");

    useEffect(() => {
        const initializeStates = async () => {
            if (currentUserId) {
                try {
                    // Fetch the latest recipe data to ensure accuracy
                    const updatedRecipe = await fetchRecipeById(recipe._id);
                    setIsLiked(updatedRecipe.likedBy?.some(id => id.toString() === currentUserId) || false);
                    setIsSaved(updatedRecipe.savedBy?.some(id => id.toString() === currentUserId) || false);
                    setLikeCount(updatedRecipe.likes?.length || 0);

                    // Check if the current user is following the recipe author
                    const currentUser = await fetchCurrentUser();
                    setIsFollowing(
                        currentUser.following.some(user => user._id.toString() === recipe.author?._id?.toString())
                    );
                } catch (error) {
                    console.error("Error initializing states:", error);
                    // Fallback to props if fetch fails
                    setIsLiked(recipe.likedBy?.some(id => id.toString() === currentUserId) || false);
                    setIsSaved(recipe.savedBy?.some(id => id.toString() === currentUserId) || false);
                    setLikeCount(recipe.likes?.length || 0);
                }
            }
        };

        initializeStates();
    }, [recipe._id, currentUserId]); // Re-run if recipe ID or user ID changes

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert("Please log in to like recipes.");
        try {
            if (isLiked) {
                await unlikeRecipe(recipe._id);
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
            } else {
                await likeRecipe(recipe._id);
                setIsLiked(true);
                setLikeCount(prev => prev + 1);
            }
            // Refetch the recipe to ensure state is in sync with the server
            const updatedRecipe = await fetchRecipeById(recipe._id);
            setIsLiked(updatedRecipe.likedBy?.some(id => id.toString() === currentUserId) || false);
            setLikeCount(updatedRecipe.likes?.length || 0);
            if (onUpdate) onUpdate(updatedRecipe); // Notify parent component of update
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
            // Refetch the recipe to ensure state is in sync with the server
            const updatedRecipe = await fetchRecipeById(recipe._id);
            setIsSaved(updatedRecipe.savedBy?.some(id => id.toString() === currentUserId) || false);
            if (onUpdate) onUpdate(updatedRecipe);
        } catch (error) {
            console.error("❌ Error toggling save:", error);
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            const response = await shareRecipe(recipe._id);
            if (response.shareLink) {
                navigator.clipboard.writeText(response.shareLink);
                alert("Share link copied to clipboard!");
            }
        } catch (error) {
            console.error("❌ Error sharing recipe:", error);
        }
    };

    const handleFollowToggle = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return alert("Please log in to follow users.");
        try {
            if (isFollowing) {
                await unfollowUserByUsername(recipe.author.username);
                setIsFollowing(false);
            } else {
                await followUserByUsername(recipe.author.username);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("❌ Error toggling follow:", error);
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
                        onClick={handleFollowToggle}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
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
                <div className="recipe-stats">
                    <span><i className="fa-solid fa-heart"></i> {likeCount}</span>
                </div>
                <div className={`recipe-actions ${!isLoggedIn ? "logged-out" : ""}`}>
                    {isLoggedIn ? (
                        <>
                            <button
                                className={`like-btn ${isLiked ? "liked" : ""}`}
                                onClick={handleLikeToggle}
                                title={isLiked ? "Unlike" : "Like"}
                            >
                                <i className={`fa-heart ${isLiked ? "fas liked" : "far"}`}></i>
                            </button>
                            <button className="share-btn" onClick={handleShare} title="Share">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                            <button
                                className={`save-btn ${isSaved ? "saved" : ""}`}
                                onClick={handleSaveToggle}
                                title={isSaved ? "Unsave" : "Save"}
                            >
                                <i className={`fa-bookmark ${isSaved ? "fas saved" : "far"}`}></i>
                            </button>
                        </>
                    ) : (
                        <button className="share-btn" onClick={handleShare} title="Share">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    )}
                </div>
            </div>
            {isLoggedIn && currentUserId === recipe.author?._id?.toString() && (
                <Link
                    to={`/edit/${recipe._id}`}
                    className="btn btn-sm btn-outline-primary mt-2 w-100"
                >
                    Edit Recipe
                </Link>
            )}
            <Link
                to={`/recipe/${recipe._id}`}
                className="btn btn-sm btn-outline-success mt-2 w-100"
                onClick={handleViewRecipe}
            >
                View Recipe
            </Link>
            
        </div>
    );
}