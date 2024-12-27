// controllers/userController.js
const bcrypt = require("bcryptjs");
const { User, Issue } = require("../models");
const { generateToken } = require("../utils/auth");

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message || error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "email", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch issues reported by the user
    const issues = await Issue.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    // Calculate issue statistics
    const totalIssues = issues.length;
    const openIssues = issues.filter((issue) => issue.status === "open").length;
    const inProgressIssues = issues.filter(
      (issue) => issue.status === "in progress"
    ).length;
    const completedIssues = issues.filter(
      (issue) => issue.status === "completed"
    ).length;

    res.json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      stats: {
        totalIssues,
        openIssues,
        inProgressIssues,
        completedIssues,
      },
      issues,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile data", error });
  }
};

const elevateToAdmin = async (req, res) => {
  try {
    // // Check if the requesting user is an admin
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const { userId } = req.params; // Get the user ID to elevate

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the user's role to "admin"
    user.role = "worker";
    await user.save();

    res.status(200).json({ message: "User elevated to admin", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to elevate user to admin", error });
  }
};

const getWorkers = async (req, res) => {
  try {
    const workers = await User.findAll({
      where: { role: "worker" },
      attributes: ["id", "username"], // Only send necessary data
    });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workers", error });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user role", error });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "username", "role"], // Only send necessary data
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  elevateToAdmin,
  getWorkers,
  updateUserRole,
  getUserById,
};
