import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

/* ========================
    🛠️ AUTHENTICATION REQUESTS
======================== */
export const registerUser = async (userData) => {
    try {
        const response = await API.post("/users/register", userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};



export const loginUser = async (credentials) => {
    try {
        const response = await API.post("/users/login", credentials);
        const { token, userId } = response.data;
        if (token) {
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("userId", userId);
            API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};



export const logoutUser = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    window.location.href = "/login";
};

/* ========================
    👤 USER REQUESTS
======================== */
export const getUserProfile = async () => {
    try {
        const response = await API.get("/users/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

export const updateUserProfile = async (updatedUser) => {
    try {
        const response = await API.put("/users/profile", updatedUser);
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

export const followUserByUsername = async (username) => {
    try {
        const response = await API.post(`/users/follow/username/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error following user:", error);
        throw error;
    }
};

export const checkUsernameAvailability = async (username) => {
    try {
        const response = await API.get(`/users/check-username/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error checking username:", error);
        throw error;
    }
};

export const searchUserByUsername = async (username) => {
    try {
        const response = await API.get(`/users/search/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error searching user:", error);
        throw error;
    }
};

export const getUserRecipes = async (userId) => {
    try {
        const response = await API.get(`/users/${userId}/recipes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

export const likeRecipeUser = async (recipeId) => {
    try {
        const response = await API.post("/users/like", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error liking recipe (user):", error);
        throw error;
    }
};

export const unlikeRecipeUser = async (recipeId) => {
    try {
        const response = await API.post("/users/unlike", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error unliking recipe (user):", error);
        throw error;
    }
};

export const saveRecipeUser = async (recipeId) => {
    try {
        const response = await API.post("/users/save", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error saving recipe (user):", error);
        throw error;
    }
};

export const removeSavedRecipeUser = async (recipeId) => {
    try {
        const response = await API.post("/users/unsave", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error unsaving recipe (user):", error);
        throw error;
    }
};

/* ========================
    🍳 RECIPE REQUESTS
======================== */
export const getRecipes = async () => {
    try {
        const response = await API.get("/recipes");
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};

export const addRecipe = async (recipeData) => {
    try {
        const response = await API.post("/recipes", recipeData);
        return response.data;
    } catch (error) {
        console.error("Error adding recipe:", error);
        throw error;
    }
};

export const searchRecipes = async (query, recipeType, sortBy, page = 1, limit = 10) => {
    try {
        const response = await API.get("/recipes/search", {
            params: { query, recipeType, sortBy, page, limit },
        });
        return response.data;
    } catch (error) {
        console.error("Error searching recipes:", error);
        throw error;
    }
};


export const deleteRecipe = async (recipeId) => {
    try {
        const response = await API.delete(`/recipes/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw error;
    }
};

export const getRecipeById = async (recipeId) => {
    try {
        const response = await API.get(`/recipes/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
        throw error;
    }
};

// src/api/axiosInstance.js (excerpt)
export const likeRecipe = async (recipeId) => {
    try {
        const response = await API.post("/users/like", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error liking recipe:", error);
        throw error;
    }
};

export const unlikeRecipe = async (recipeId) => {
    try {
        const response = await API.post("/users/unlike", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error unliking recipe:", error);
        throw error;
    }
};

export const saveRecipe = async (recipeId) => {
    try {
        const response = await API.post("/users/save", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error saving recipe:", error);
        throw error;
    }
};

export const removeSavedRecipe = async (recipeId) => {
    try {
        const response = await API.post("/users/unsave", { recipeId });
        return response.data;
    } catch (error) {
        console.error("Error removing saved recipe:", error);
        throw error;
    }
};

export const saveDraft = async (recipeData) => {
    try {
        const response = await API.post("/recipes/draft", recipeData);
        return response.data;
    } catch (error) {
        console.error("Error saving draft:", error);
        throw error;
    }
};

export const shareRecipe = async (recipeId) => {
    try {
        const response = await API.post(`/recipes/${recipeId}/share`);
        return response.data;
    } catch (error) {
        console.error("Error sharing recipe:", error);
        throw error;
    }
};
export const fetchCurrentUser = async () => {
    try {
        const response = await API.get("/users/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
};
// Add to src/api/axiosInstance.js
// src/api/axiosInstance.js (excerpt)
export const createRecipe = async (recipeData) => {
    try {
        const response = await API.post("/recipes", recipeData);
        return response.data;
    } catch (error) {
        console.error("Error creating recipe:", error);
        throw error;
    }
};

export const editRecipe = async (recipeId, recipeData) => {
    try {
        const response = await API.put(`/recipes/${recipeId}`, recipeData);
        return response.data;
    } catch (error) {
        console.error("Error editing recipe:", error);
        throw error;
    }
};

export const fetchRecipeById = async (recipeId) => {
    try {
        const response = await API.get(`/recipes/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
        throw error;
    }
};
export const unfollowUserByUsername = async (username) => {
    try {
        const response = await API.post(`/users/unfollow/username/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error unfollowing user:", error);
        throw error;
    }
};
// src/api/axiosInstance.js
export const fetchUserProfile = async () => {
    try {
        const response = await API.get("/users/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};
// src/api/axiosInstance.js
export const fetchRecipes = async () => {
    try {
        const response = await API.get("/recipes");
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};
export const fetchTrendingRecipes = async () => {
    try {
        const response = await API.get("/recipes");
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};
export const fetchRecentRecipes = async () => {
    try {
        const response = await API.get("/recipes");
        return response.data;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};
export default API;