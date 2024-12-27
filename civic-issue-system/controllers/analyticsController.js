// controllers/analyticsController.js
const { Issue, sequelize } = require("../models");

const getIssueAnalytics = async (req, res) => {
  try {
    // Total Issues
    const totalIssues = await Issue.count();

    // Issues by Status
    const issuesByStatus = await Issue.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
    });

    // Issues by Priority
    const issuesByPriority = await Issue.findAll({
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("priority")), "count"],
      ],
      group: ["priority"],
    });

    res.json({
      totalIssues,
      issuesByStatus,
      issuesByPriority,
    });
  } catch (error) {
    console.error("Error fetching issue analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics", error });
  }
};

const getStats = async (req, res) => {
  try {
    const totalIssues = await Issue.count();
    const openIssues = await Issue.count({
      where: { status: "open" },
    });
    const inProgressIssues = await Issue.count({
      where: { status: "in progress" },
    });
    const completedIssues = await Issue.count({
      where: { status: "completed" },
    });

    res.json({
      totalIssues,
      openIssues,
      inProgressIssues,
      completedIssues,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

const getIssueTrends = async (req, res) => {
  try {
    const issuesOverTime = await Issue.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["date"],
      order: [["date", "ASC"]],
    });

    res.json(issuesOverTime);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issue trends",
      error: error.message || error,
    });
  }
};

const getFrequentIssueTypes = async (req, res) => {
  try {
    const issueTypes = await Issue.findAll({
      attributes: [
        "title",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["title"],
      order: [[sequelize.literal("count"), "DESC"]],
      limit: 5, // Top 5 frequent issues
    });

    res.json(issueTypes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch frequent issue types", error });
  }
};

const getResolutionTime = async (req, res) => {
  try {
    const resolutionTimes = await Issue.findAll({
      where: { status: "completed" },
      attributes: [
        [
          sequelize.literal(`AVG("updatedAt"::date - "createdAt"::date)`),
          "avgResolutionTime",
        ],
      ],
    });

    res.json(resolutionTimes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resolution times", error });
  }
};

module.exports = {
  getIssueAnalytics,
  getIssueTrends,
  getFrequentIssueTypes,
  getResolutionTime,
  getStats,
};
