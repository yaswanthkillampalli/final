// backend/routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const {
    createRecipe,
    getRecipes,
    fetchTrendingRecipes,
    fetchRecentRecipes,
    searchRecipes,
    getRecipeById,
    editRecipe,
    deleteRecipe,
    likeRecipe,
    saveRecipe,
    unsaveRecipe,
    saveDraft,
    shareRecipe,
} = require("../controllers/recipeController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, createRecipe); // Create recipe
router.get("/", getRecipes); // Get all published recipes with pagination
router.get("/trending", fetchTrendingRecipes); // Fetch trending recipes
router.get("/recent", fetchRecentRecipes); // Fetch recent recipes
router.get("/search", searchRecipes); // Search recipes
router.get("/:id", getRecipeById); // Get recipe by ID
router.put("/:id", authenticate, editRecipe); // Edit recipe
router.delete("/:id", authenticate, deleteRecipe); // Delete recipe
router.post("/:id/like", authenticate, likeRecipe); // Like/unlike recipe
router.post("/:id/save", authenticate, saveRecipe); // Save recipe
router.post("/:id/unsave", authenticate, unsaveRecipe); // Unsave recipe
router.post("/draft", authenticate, saveDraft); // Save draft
router.post("/:id/share", authenticate, shareRecipe); // Share recipe

module.exports = router;