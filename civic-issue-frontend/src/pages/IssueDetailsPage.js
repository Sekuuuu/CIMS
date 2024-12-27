// src/pages/IssueDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";
import IssueDetailsHeader from "../components/IssueDetailsHeader";
import IssueDetailsPriority from "../components/IssueDetailsPriority";
import IssueDetailsStatus from "../components/IssueDetailsStatus";
import IssueMap from "../components/IssueMap";
import CommentSection from "../components/CommentSection";
import WorkerAssignment from "../components/WorkerAssignment";

const IssueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const [assignedWorker, setAssignedWorker] = useState(null);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const response = await axiosInstance.get(`/issues/${id}`);
        setIssue(response.data);

        if (response.data.assignedWorkerId) {
          const workerResponse = await axiosInstance.get(
            `/users/${response.data.assignedWorkerId}`
          );
          setAssignedWorker(workerResponse.data);
        }
        fetchComments();
      } catch (error) {
        toast.error("Failed to load issue details.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/comments/${id}`);
        setComments(response.data);
      } catch (error) {
        toast.error("Failed to load comments.");
      }
    };

    fetchIssueDetails();
  }, [id, navigate]);

  const handlePriorityChange = async (newPriority) => {
    try {
      await axiosInstance.put(`/issues/${id}/priority`, {
        priority: newPriority,
      });
      setIssue((prev) => ({ ...prev, priority: newPriority }));
      toast.success("Priority updated successfully.");
    } catch (error) {
      toast.error("Failed to update priority.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.put(`/issues/${id}/status`, { status: newStatus });
      setIssue((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status updated successfully.");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await axiosInstance.post(`/comments/${id}`, {
        content: newComment,
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted.");
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  if (loading) return <p>Loading issue details...</p>;
  if (!issue) return <p>Issue not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <IssueDetailsHeader issue={issue} />
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IssueDetailsPriority
                priority={issue.priority}
                role={role}
                onPriorityChange={handlePriorityChange}
              />
              <IssueDetailsStatus
                status={issue.status}
                role={role}
                onStatusChange={handleStatusChange}
              />
            </div>

            {/* Map */}
            {issue.latitude && issue.longitude && (
              <div className="rounded-lg overflow-hidden shadow-md">
                <IssueMap
                  latitude={issue.latitude}
                  longitude={issue.longitude}
                  title={issue.title}
                  description={issue.description}
                />
              </div>
            )}

            {/* Worker Assignment */}
            {role === "admin" && (
              <div className="bg-gray-50 rounded-lg p-6">
                <WorkerAssignment
                  issueId={issue.id}
                  currentWorkerId={issue.assignedWorkerId}
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <CommentSection
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                role={role}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsPage;
