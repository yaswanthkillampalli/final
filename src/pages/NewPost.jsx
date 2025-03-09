import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/axiosInstance";
import "../styles.css";

export default function NewPost() {
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        title: "",
        description: "",
        ingredients: [""],
        instructions: [""],
        cookingTime: "",
        category: "",
        image: null,
    });

    const handleChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };

    const addIngredient = () => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
    };

    const addInstruction = () => {
        setRecipe({ ...recipe, instructions: [...recipe.instructions, ""] });
    };

    const handleImageChange = (e) => {
        setRecipe({ ...recipe, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(recipe).forEach((key) => {
            formData.append(key, key === "ingredients" || key === "instructions" ? JSON.stringify(recipe[key]) : recipe[key]);
        });

        try {
            await createRecipe(formData);
            navigate("/home");
        } catch (error) {
            console.error("Error creating recipe:", error);
        }
    };

    return (
        <div className="container mt-4">
            <button className="backButton" onClick={() => navigate(-1)}>⬅ Back</button>
            <h2>New Recipe</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Recipe Title" onChange={handleChange} required />
                <textarea name="description" placeholder="Recipe Description" onChange={handleChange} required />

                <label>Ingredients</label>
                {recipe.ingredients.map((ingredient, index) => (
                    <input key={index} type="text" value={ingredient} onChange={(e) => {
                        const updatedIngredients = [...recipe.ingredients];
                        updatedIngredients[index] = e.target.value;
                        setRecipe({ ...recipe, ingredients: updatedIngredients });
                    }} required />
                ))}
                <button type="button" onClick={addIngredient}>+ Add Ingredient</button>

                <label>Instructions</label>
                {recipe.instructions.map((step, index) => (
                    <textarea key={index} rows="2" value={step} onChange={(e) => {
                        const updatedInstructions = [...recipe.instructions];
                        updatedInstructions[index] = e.target.value;
                        setRecipe({ ...recipe, instructions: updatedInstructions });
                    }} required />
                ))}
                <button type="button" onClick={addInstruction}>+ Add Step</button>

                <input type="text" name="cookingTime" placeholder="Cooking Time (e.g., 30 mins)" onChange={handleChange} required />
                <select name="category" onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                </select>

                <input type="file" accept="image/*" onChange={handleImageChange} required />
                <button type="submit" className="btn btn-success">Publish</button>
            </form>
        </div>
    );
}
