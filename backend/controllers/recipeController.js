const Recipe = require("../models/Recipe");

// Create a New Recipe
exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, cookingTime, recipeType, image } = req.body;
        if (!req.user) return res.status(401).json({ message: "Please log in" });

        // Handle instructions: array or string
        let parsedInstructions = instructions;
        if (!Array.isArray(instructions)) {
            parsedInstructions = typeof instructions === "string" ? [instructions] : [];
        }

        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            instructions: parsedInstructions,
            cookingTime,
            recipeType,
            image,
            author: req.user.id,
        });

        await newRecipe.save();
        res.status(201).json({ message: "Recipe created", recipe: newRecipe });
    } catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Get All Recipes (with basic pagination)
exports.getRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const recipes = await Recipe.find()
            .populate("author", "username profileImage")
            .skip(skip)
            .limit(limit);
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Search Recipes
exports.searchRecipes = async (req, res) => {
    try {
        const { query, recipeType, sortBy, page = 1, limit = 10 } = req.query;
        let filter = {};

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { ingredients: { $regex: query, $options: "i" } },
            ];
        }

        if (recipeType && ["Veg", "Non-Veg"].includes(recipeType)) {
            filter.recipeType = recipeType;
        }

        let recipesQuery = Recipe.find(filter);
        if (sortBy === "trending") recipesQuery = recipesQuery.sort({ likes: -1 });
        else if (sortBy === "recent") recipesQuery = recipesQuery.sort({ createdAt: -1 });

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const recipes = await recipesQuery.skip(skip).limit(parseInt(limit));
        res.json(recipes);
    } catch (error) {
        console.error("Error searching recipes:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// backend/controllers/recipeController.js
exports.fetchRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ status: "Published" })
            .populate("author", "username profileImage")
            .sort({ createdAt: -1 });
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Delete Recipe (Only by Owner)
exports.deleteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the owner can delete this" });
        }

        await recipe.deleteOne();
        res.json({ message: "Recipe deleted" });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Like a Recipe (Toggle Like/Unlike)
exports.likeRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const alreadyLiked = recipe.likes.includes(userId);
        if (alreadyLiked) {
            recipe.likes = recipe.likes.filter((id) => id.toString() !== userId);
            await recipe.save();
            return res.status(200).json({ message: "Like removed", likes: recipe.likes.length });
        }

        recipe.likes.push(userId);
        await recipe.save();
        res.status(200).json({ message: "Recipe liked", likes: recipe.likes.length });
    } catch (error) {
        console.error("Error liking recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Save a Recipe
exports.saveRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        if (recipe.savedBy.includes(userId)) {
            return res.status(400).json({ message: "Already saved" });
        }

        recipe.savedBy.push(userId);
        await recipe.save();
        res.status(200).json({ message: "Recipe saved", savedBy: recipe.savedBy.length });
    } catch (error) {
        console.error("Error saving recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Unsave a Recipe
exports.unsaveRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        recipe.savedBy = recipe.savedBy.filter((id) => id.toString() !== userId);
        await recipe.save();
        res.status(200).json({ message: "Recipe unsaved", savedBy: recipe.savedBy.length });
    } catch (error) {
        console.error("Error unsaving recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.saveDraft = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, cookingTime, recipeType, image } = req.body;
        const author = req.user.id;

        const newDraft = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            cookingTime,
            recipeType,
            image,
            author,
            status: "Draft",
        });

        await newDraft.save();
        res.status(201).json({ message: "Draft saved", recipe: newDraft });
    } catch (error) {
        console.error("Error saving draft:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.addRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, cookingTime, prepTime, servings, difficulty, recipeType, image } = req.body;
        const author = req.user.id;
        const recipe = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            cookingTime,
            prepTime,
            servings,
            difficulty,
            recipeType,
            image,
            author,
            status: "Published",
        });
        await recipe.save();
        res.status(201).json({ message: "Recipe added", recipeId: recipe._id });
    } catch (error) {
        console.error("Error adding recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.editRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { title, description, ingredients, instructions, cookingTime, prepTime, servings, difficulty, recipeType, image } = req.body;
        const recipe = await Recipe.findOne({ _id: recipeId, author: req.user.id });
        if (!recipe) return res.status(404).json({ message: "Recipe not found or not authorized" });

        recipe.title = title;
        recipe.description = description;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;
        recipe.cookingTime = cookingTime;
        recipe.prepTime = prepTime;
        recipe.servings = servings;
        recipe.difficulty = difficulty;
        recipe.recipeType = recipeType;
        recipe.image = image;

        await recipe.save();
        res.status(200).json({ message: "Recipe updated", recipeId: recipe._id });
    } catch (error) {
        console.error("Error updating recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate("author", "username");
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.status(200).json(recipe);
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Share Recipe
exports.shareRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        const shareLink = `${process.env.FRONTEND_URL}/recipe/${recipeId}`;
        res.json({ message: "Share link ready", shareLink });
    } catch (error) {
        console.error("Error sharing recipe:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// Add to backend/controllers/recipeController.js
exports.getTrendingRecipes = async (req, res) => {
    try {
        const trendingRecipes = await Recipe.find({ status: "Published" })
            .sort({ "likes.length": -1 })
            .limit(10)
            .populate("author", "username profileImage");
        res.status(200).json(trendingRecipes);
    } catch (error) {
        console.error("Error fetching trending recipes:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};