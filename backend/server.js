const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: "https://your-frontend.onrender.com", // Update with actual frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB before starting the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(error => {
  console.error("❌ MongoDB Connection Failed:", error.message);
  process.exit(1); // Exit if database connection fails
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);

// Health Check Route
app.get("/", (req, res) => res.send("API is running..."));
