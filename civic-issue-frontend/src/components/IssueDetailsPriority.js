// src/components/IssueDetailsPriority.js
import React from "react";

const IssueDetailsPriority = ({ priority, role, onPriorityChange }) => {
  return (
    <div className="mb-6">
      <p className="text-lg font-medium text-gray-800">
        <strong>Priority:</strong> {priority || "Unassigned"}
      </p>
      {role === "admin" && (
        <select
          value={priority || ""}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>
            Select Priority
          </option>
          {[1, 2, 3, 4, 5, 6, 7].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default IssueDetailsPriority;
