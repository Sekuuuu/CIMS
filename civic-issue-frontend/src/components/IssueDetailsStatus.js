// src/components/IssueDetailsStatus.js
import React from "react";

const IssueDetailsStatus = ({ status, role, onStatusChange }) => {
  return (
    <div className="mb-6">
      <p className="text-lg font-medium text-gray-800">
        <strong>Status:</strong> {status}
      </p>
      {(role === "admin" || role === "worker") && (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      )}
    </div>
  );
};

export default IssueDetailsStatus;
