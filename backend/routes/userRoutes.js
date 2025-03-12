// backend/routes/userRoutes.js
const express = require("express");
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    followUserByUsername,
    unfollowUserByUsername,
    checkUsernameAvailability,
    searchUserByUsername,
    getUserRecipes,
    likeRecipe,
    unlikeRecipe,
    saveRecipe,
    removeSavedRecipe,
} = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get & Update Current User Profile
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);

// Search User by Username
router.get("/search/:username", searchUserByUsername);

// Check Username Availability
router.get("/check-username/:username", checkUsernameAvailability);

// Follow & Unfollow a User by Username
router.post("/follow/username/:username", authenticate, followUserByUsername);
router.post("/unfollow/username/:username", authenticate, unfollowUserByUsername);

// Like & Unlike a Recipe
router.post("/like", authenticate, likeRecipe);
router.post("/unlike", authenticate, unlikeRecipe);

// Save & Remove a Saved Recipe
router.post("/save", authenticate, saveRecipe);
router.post("/unsave", authenticate, removeSavedRecipe);

// Get User's Recipes
router.get("/:userId/recipes", getUserRecipes);

module.exports = router;