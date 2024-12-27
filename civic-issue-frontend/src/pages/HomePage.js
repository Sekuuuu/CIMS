// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/issues");
        setIssues(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setError("Failed to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const filteredIssues =
    filter === "all"
      ? issues
      : issues.filter((issue) => issue.status === filter);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityInfo = (priority) => {
    const level = parseInt(priority);
    if (isNaN(level)) return { color: "text-gray-600", label: "Unassigned" };

    switch (level) {
      case 1:
        return { color: "text-red-600", label: "Critical Priority" };
      case 2:
        return { color: "text-orange-600", label: "Very High Priority" };
      case 3:
        return { color: "text-yellow-600", label: "High Priority" };
      case 4:
        return { color: "text-blue-600", label: "Medium Priority" };
      case 5:
        return { color: "text-indigo-600", label: "Moderate Priority" };
      case 6:
        return { color: "text-purple-600", label: "Low Priority" };
      case 7:
        return { color: "text-gray-600", label: "Very Low Priority" };
      default:
        return { color: "text-gray-600", label: "Unassigned" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">{error}</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community Issues</h1>
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Report New Issue
          </Link>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
              ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            All Issues
          </button>
          <button
            onClick={() => setFilter("open")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
              ${
                filter === "open"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Open
          </button>
          <button
            onClick={() => setFilter("in progress")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
              ${
                filter === "in progress"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
              ${
                filter === "completed"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Completed
          </button>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => {
            const priorityInfo = getPriorityInfo(issue.priority);
            return (
              <div
                key={issue.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {issue.photoUrl && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={`http://localhost:3000${issue.photoUrl}`}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {issue.title}
                    </h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`text-sm font-medium ${priorityInfo.color}`}
                      >
                        {priorityInfo.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      to={`/issue/${issue.id}`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No issues found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "Get started by creating a new issue."
                : `No ${filter} issues found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
