// routes/commentRoutes.js
const express = require("express");
const {
  addComment,
  getCommentsByIssueId,
  deleteComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:issueId", authMiddleware, addComment); // Add a comment to an issue
router.get("/:issueId", authMiddleware, getCommentsByIssueId); // Get comments for an issue
router.delete("/:id", authMiddleware, deleteComment); // Delete a comment (admin or comment owner)

module.exports = router;
