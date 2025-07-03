const { uploadMedia } = require("../helper/uploadMedia");
const { validateUser, validateLogin } = require("../helper/validation");
const User = require("../models/userModel");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        console.log("req.body", req.body);
        if (error) {
            return res.status(400).json({ error: "Validation Error", message: error.details.map(detail => detail.message) });
        }
        const { name, email, media, password, role } = req.body;

        const cloudMedia = await uploadMedia(media, "BlogUsers");

        if (!cloudMedia) {
            return res.status(500).json({ error: "Media Upload Failed", message: "Failed to upload media. Please try again." });
        }
        // Ensure media is a valid URL or handle it as needed
        // if (typeof cloudMedia !== 'string' || !cloudMedia.startsWith('http')) {
        //     return res.status(400).json({ error: "Invalid Media URL", message: "The provided media URL is invalid." });
        // }

        const hashedpassword = await bycrypt.hash(password, 10);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists", message: "A user with this email already exists." });
        }

        const newUser = await User.create({ name, email, password: hashedpassword, role, media: cloudMedia.url });
        if (!newUser) {
            return res.status(500).json({ error: "User creation failed", message: "Failed to create user. Please try again." });
        }
        res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({ error: "Validation Error", message: error.details.map(detail => detail.message) });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found", message: "No user found with this email." });
        }

        const isPasswordValid = await bycrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials", message: "Incorrect email or password." });
        }
        // Optionally, you can generate a JWT token here and send it back to the client
        const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        if (!token) {
            return res.status(500).json({ error: "Token generation failed", message: "Failed to generate authentication token." });
        }

        res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found", message: "No users available in the database." });
        }
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ error: "User not found", message: "No user found with this ID." });
        }
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
        console.error("Error in getUserById:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ error: "Validation Error", message: error.details.map(detail => detail.message) });
        }
        const { name, email, media, role } = req.body;
        const cloudMedia = await uploadMedia(media, "BlogUsers");
        if (!cloudMedia) {
            return res.status(500).json({ error: "Media Upload Failed", message: "Failed to upload media. Please try again." });
        }
        // Ensure media is a valid URL or handle it as needed
        if (typeof cloudMedia !== 'string' || !cloudMedia.startsWith('http')) {
            return res.status(400).json({ error: "Invalid Media URL", message: "The provided media URL is invalid." });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, media: uploadMedia, role }, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found", message: "No user found with this ID." });
        }
        res.status(200).json({ message: "User updated successfully", user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } });
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found", message: "No user found with this ID." });
        }
        res.status(200).json({ message: "User deleted successfully", user: { id: deletedUser._id, name: deletedUser.name, email: deletedUser.email, role: deletedUser.role } });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

const verifyToken = (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: "Token required", message: "Authentication token is required." });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            console.log("Decoded token:", decoded);
            if (err) {
                return res.status(401).json({ error: "Invalid token", message: "The provided token is invalid or expired." });
            }
            res.status(200).json({ message: "Token verified successfully", userId: decoded.id, name: decoded.name, role: decoded.role });
        });
    } catch (error) {
        console.error("Error in verifyToken:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

module.exports = {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    verifyToken
};