// controllers/commentController.js
const { Comment, Issue, User } = require("../models");

const addComment = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { content } = req.body;

    const issue = await Issue.findByPk(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      issueId,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error });
  }
};

const getCommentsByIssueId = async (req, res) => {
  try {
    const { issueId } = req.params;
    const comments = await Comment.findAll({
      where: { issueId },
      include: [{ model: User, attributes: ["username"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.user.role !== "admin" && comment.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error });
  }
};

module.exports = {
  addComment,
  getCommentsByIssueId,
  deleteComment,
};
