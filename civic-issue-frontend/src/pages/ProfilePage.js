// src/pages/ProfilePage.js

import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setProfile(response.data);
      } catch (error) {
        toast.error("Failed to load profile data.");
      }
    };
    fetchProfile();
  }, []);

  const handleDeleteIssue = async (issueId) => {
    try {
      await axiosInstance.delete(`/issues/${issueId}`);
      setProfile((prev) => ({
        ...prev,
        issues: prev.issues.filter((issue) => issue.id !== issueId),
      }));
      toast.success("Issue deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete issue.");
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  const { user, stats, issues } = profile;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-white/30 flex items-center justify-center text-3xl font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-blue-100">{user.email}</p>
                <p className="mt-1 text-sm text-blue-200">
                  Member since 12/17/2024
                  {/* Member since {user.createdAt ? user.createdAt : "Unknown"} */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              Total Issues
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {stats.totalIssues}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Open</div>
            <div className="mt-2 text-3xl font-semibold text-yellow-600">
              {stats.openIssues}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">In Progress</div>
            <div className="mt-2 text-3xl font-semibold text-blue-600">
              {stats.inProgressIssues}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Completed</div>
            <div className="mt-2 text-3xl font-semibold text-green-600">
              {stats.completedIssues}
            </div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Issues</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {issues.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
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
                <p className="mt-2">No issues reported yet.</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {issue.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {issue.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            issue.status === "open"
                              ? "bg-yellow-100 text-yellow-800"
                              : issue.status === "in progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {issue.status}
                        </span>
                        {issue.priority && (
                          <span className="text-sm text-gray-500">
                            Priority: {issue.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                      <button
                        onClick={() => navigate(`/issue/${issue.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteIssue(issue.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Settings Section */}
        {/* <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Settings
            </h2>
          </div>
          <div className="p-6">
            <button
              onClick={() => navigate("/change-password")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Password
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
