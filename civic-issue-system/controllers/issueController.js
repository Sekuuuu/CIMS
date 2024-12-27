// controllers/issueController.js

const { Issue, User } = require("../models");
const { sendAssignmentEmail } = require("../utils/emailService");

// Create an Issue post with file upload
const createIssue = async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const userId = req.user.id;

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newIssue = await Issue.create({
      title,
      description,
      latitude,
      longitude,
      photoUrl,
      userId,
    });

    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ message: "Failed to create issue", error });
  }
};

//Get all issues
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"], // Only include necessary user fields
        },
      ],
      order: [
        ["priority", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve issues", error });
  }
};

// Get issues with dynamic priority adjustment
const getIssuesWithPriorityAdjustment = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    // Calculate adjusted priority for each issue
    const issuesWithAdjustedPriority = issues.map(issue => {
      const issueData = issue.get({ plain: true });
      
      
      const daysSinceCreation = Math.floor(
        (new Date() - new Date(issueData.createdAt)) / (1000 * 60 * 60 * 24)
      );


      // issueData.sortWeight = issueData.adjustedPriority + (daysSinceCreation * 0.1);
      // console.log(issueData.sortWeight);

      
      const agePriorityAdjustment = Math.floor(daysSinceCreation / 2);
      
      



      if (issueData.status !== 'completed') {
        // Adjust priority (within 1-7 range)
        issueData.adjustedPriority = Math.max(
          1,
          Math.min(7, issueData.priority - agePriorityAdjustment)
        );
      } else {
        issueData.adjustedPriority = issueData.priority;
      }

      // Add time-based weight for sorting
      issueData.sortWeight = issueData.adjustedPriority + (daysSinceCreation * 0.1);

      return issueData;
    });

    // Sort issues by adjusted priority and age
    const sortedIssues = issuesWithAdjustedPriority.sort((a, b) => {
      // First sort by adjusted priority
      if (a.adjustedPriority !== b.adjustedPriority) {
        return a.adjustedPriority - b.adjustedPriority;
      }
      // If priorities are equal, sort by creation date (older first)
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    res.json(sortedIssues);
  } catch (error) {
    console.error('Error retrieving issues with priority adjustment:', error);
    res.status(500).json({ message: "Failed to retrieve issues", error });
  }
};





//Get single issue by ID
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // If there's an assigned worker, fetch their details
    let assignedWorker = null;
    if (issue.assignedWorkerId) {
      assignedWorker = await User.findByPk(issue.assignedWorkerId, {
        attributes: ["id", "username"],
      });
    }

    // Combine the data
    const responseData = {
      ...issue.toJSON(),
      assignedWorker: assignedWorker,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching issue:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve issue", error: error.message });
  }
};

//Update issue priority for admins by ID
const updateIssuePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    console.log(req.user);

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const issue = await Issue.findByPk(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.priority = priority;
    await issue.save();

    res.json({ message: "Priority updated successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Failed to update priority", error });
  }
};

const assignWorker = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { workerId } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can assign workers" });
    }

    // Find the issue with its creator's information
    const issue = await Issue.findByPk(issueId, {
      include: [{ model: User, attributes: ["email"] }],
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Find the worker
    const worker = await User.findOne({
      where: { id: workerId, role: "worker" },
    });

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Update the issue with the assigned worker ID
    await issue.update({
      assignedWorkerId: workerId,
      assignedAt: new Date(),
      status: "in progress", // Optionally update status when worker is assigned
    });

    // Send email to the issue creator
    const emailSent = await sendAssignmentEmail(
      issue.User.email,
      issue.title,
      worker.username
    );

    // Fetch the updated issue to confirm changes
    const updatedIssue = await Issue.findByPk(issueId, {
      include: [
        { model: User, attributes: ["id", "username"] },
        {
          model: User,
          as: "assignedWorker",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json({
      message: "Worker assigned successfully",
      issue: updatedIssue,
      emailSent,
    });
  } catch (error) {
    console.error("Error assigning worker:", error);
    res.status(500).json({
      message: "Failed to assign worker",
      error: error.message,
    });
  }
};

//Update Issue Status for admins
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "worker") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const issue = await Issue.findByPk(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = status;
    await issue.save();

    res.json({ message: "Status updated successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};

//Delete Issue
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (req.user.role !== "admin" && issue.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this issue" });
    }

    await issue.destroy();
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete issue", error });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssuesWithPriorityAdjustment,
  getIssueById,
  updateIssuePriority,
  updateIssueStatus,
  deleteIssue,
  assignWorker,
};
