// routes/issueRoutes.js
const express = require("express");
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssuePriority,
  updateIssueStatus,
  deleteIssue,
  assignWorker,
} = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", authMiddleware, upload.single("photo"), createIssue); // Now supports file upload
router.get("/", authMiddleware, getIssues);
router.get("/:id", authMiddleware, getIssueById);
router.put("/:id/priority", authMiddleware, updateIssuePriority);
router.put("/:id/status", authMiddleware, updateIssueStatus);
router.delete("/:id", authMiddleware, deleteIssue);
router.post("/:issueId/assign-worker", authMiddleware, assignWorker);

module.exports = router;
