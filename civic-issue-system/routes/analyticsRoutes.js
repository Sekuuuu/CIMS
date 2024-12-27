// routes/analyticsRoutes.js
const express = require("express");
const {
  getIssueAnalytics,
  getIssueTrends,
  getFrequentIssueTypes,
  getResolutionTime,
  getStats,
} = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getIssueAnalytics);
router.get("/trends", authMiddleware, getIssueTrends); // Issues trends over time
router.get("/frequent", authMiddleware, getFrequentIssueTypes); // Top 5 frequent issue types
router.get("/resolution-time", authMiddleware, getResolutionTime); // Average resolution time
router.get("/stats", authMiddleware, authMiddleware, getStats);
module.exports = router;
