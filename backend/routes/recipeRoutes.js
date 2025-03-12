const express = require("express");
const {
    getRecipes,
    addRecipe,
    searchRecipes,
    editRecipe,
    deleteRecipe,
    getRecipeById,
    likeRecipe,
    saveRecipe,
    unsaveRecipe,
    saveDraft,
    shareRecipe,
    getTrendingRecipes, 
} = require("../controllers/recipeController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Like a Recipe (toggle behavior)
router.post("/:recipeId/like", authenticate, likeRecipe);

// Save & Unsave a Recipe
router.post("/:recipeId/save", authenticate, saveRecipe);
router.post("/:recipeId/unsave", authenticate, unsaveRecipe);

// Get Recipes
router.get("/", getRecipes);
router.get("/search", searchRecipes);
router.get("/:id", getRecipeById);

// Create, Edit & Delete Recipes
router.post("/", authenticate, addRecipe);
router.put("/:recipeId", authenticate, editRecipe);
router.delete("/:recipeId", authenticate, deleteRecipe);
router.get("/:id", getRecipeById); // Assumed for fetching

// Save Draft
router.post("/draft", authenticate, saveDraft); // Changed from "/:recipeId/draft"

// Share Recipe
router.post("/:recipeId/share", authenticate, shareRecipe);
router.get("/trending", getTrendingRecipes);

module.exports = router;