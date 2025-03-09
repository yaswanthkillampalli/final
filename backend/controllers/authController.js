const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
    const { username, fullName, email, password } = req.body;

    try {
        // Check if username or email is already taken
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: "Email or Username already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, userId: user._id, email: user.email });
    } catch (error) {
        console.error("Error in /login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
