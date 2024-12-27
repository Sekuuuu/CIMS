// src/components/IssueDetailsHeader.js
import React from "react";

const IssueDetailsHeader = ({ issue }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          ID: #{issue.id}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {new Date(issue.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Reported by:{" "}
          {issue.User && issue.User.username
            ? issue.User.username
            : "Anonymous"}
        </div>
      </div>

      <p className="text-gray-700 text-lg leading-relaxed">
        {issue.description}
      </p>

      {issue.photoUrl && (
        <div className="mt-4">
          <div className="relative h-96 w-full overflow-hidden rounded-lg">
            <img
              src={`http://localhost:3000${issue.photoUrl}`}
              alt="Issue"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {issue.tags?.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default IssueDetailsHeader;
