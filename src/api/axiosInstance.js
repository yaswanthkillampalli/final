import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",  // Ensure this is correct
    headers: { "Content-Type": "application/json" }
});

// ✅ Function to fetch user profile (Ensure token is included)
export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem("token"); // Ensure token exists
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await API.get("/user/profile", {
            headers: { Authorization: `Bearer ${token}` } // Include token
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        throw error;
    }
};

// 🔹 Attach Token to Requests if User is Logged In
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

/* ========================
    🏠 HOME PAGE REQUESTS
======================== */
// Fetch all recipes
export const fetchRecipes = async () => {
    try {
        const response = await API.get("/recipes");
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

// Fetch trending recipes
export const fetchTrendingRecipes = async () => {
    try {
        const response = await API.get("/recipes/trending");
        return response.data;
    } catch (error) {
        console.error("Error fetching trending recipes:", error);
        throw error;
    }
};

// Fetch recent recipes
export const fetchRecentRecipes = async () => {
    try {
        const response = await API.get("/recipes/recent");
        return response.data;
    } catch (error) {
        console.error("Error fetching recent recipes:", error);
        throw error;
    }
};

/* ========================
    🆕 NEW POST REQUESTS
======================== */
// Create a new recipe
export const createRecipe = async (recipeData) => {
    try {
        const response = await API.post("/recipes", recipeData);
        return response.data;
    } catch (error) {
        console.error("Error creating recipe:", error);
        throw error;
    }
};

/* ========================
    🔎 SEARCH REQUESTS
======================== */
// Search recipes with query
export const searchRecipes = async (query) => {
    try {
        const response = await API.get(`/recipes/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error searching recipes:", error);
        throw error;
    }
};

/* ========================
    🛠️ PROFILE & AUTH
======================== */
// Fetch User Profile


// Logout (Remove token)
export const logoutUser = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to non-logged-in home page
};

// Login User
export const loginUser = async (credentials) => {
    try {
        const response = await API.post("/auth/login", credentials);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// Register User
export const registerUser = async (userData) => {
    try {
        const response = await API.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};
// Fetch a single recipe by ID
export const fetchRecipeById = async (id) => {
    try {
        const response = await API.get(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
        throw error;
    }
};

// Like a recipe
export const likeRecipe = async (id) => {
    try {
        await API.post(`/recipes/${id}/like`);
    } catch (error) {
        console.error("Error liking recipe:", error);
        throw error;
    }
};

// Save a recipe
export const saveRecipe = async (id) => {
    try {
        await API.post(`/recipes/${id}/save`);
    } catch (error) {
        console.error("Error saving recipe:", error);
        throw error;
    }
};

export const updateUserProfile = async (updatedUser) => {
    try {
        const response = await API.put("/user/update", updatedUser);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};



export default API;
