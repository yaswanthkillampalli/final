const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model

module.exports = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided or format incorrect" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch full user details (excluding password)
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = { id: user._id, username: user.username, email: user.email }; // ✅ Store full user info
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" }); // 🛑 Use 403 instead of 400
    }
};
