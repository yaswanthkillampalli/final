const express = require("express");
const { getRecipes, addRecipe, searchRecipes, editRecipe, deleteRecipe, addReview } = require("../controllers/recipeController");
const authenticate = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

router.get("/", getRecipes);
router.get("/search", searchRecipes);
router.post("/", authenticate, addRecipe); // Protect adding recipes

// Edit Recipe (Protected)
router.put("/:recipeId", authenticate, editRecipe);

// Delete Recipe (Protected)
router.delete("/:recipeId", authenticate, deleteRecipe);

// Add a review to a recipe
router.post("/:recipeId/review", authenticate, addReview);


module.exports = router;
