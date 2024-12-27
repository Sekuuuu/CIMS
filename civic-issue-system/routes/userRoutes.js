// routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  elevateToAdmin,
  getWorkers,
  updateUserRole,
  getUserById,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile); // Protected route

// Route to elevate a user to admin (only accessible by current admins)
router.put("/elevate/:userId", authMiddleware, elevateToAdmin);

router.get("/workers", authMiddleware, getWorkers);

router.put("/update-role/:userId", authMiddleware, updateUserRole);

router.get("/:id", authMiddleware, getUserById);

module.exports = router;
