// components/WorkerAssignment.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";

const WorkerAssignment = ({ issueId, currentWorkerId }) => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(currentWorkerId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axiosInstance.get("/users/workers");
        setWorkers(response.data);
      } catch (error) {
        console.error("Error fetching workers:", error);
        toast.error("Failed to fetch workers");
      }
    };
    fetchWorkers();
  }, []);

  const handleAssignment = async () => {
    if (!selectedWorkerId) {
      toast.warning("Please select a worker first");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post(`/issues/${issueId}/assign-worker`, {
        workerId: parseInt(selectedWorkerId, 10),
      });
      toast.success("Worker assigned successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to assign worker");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Worker Assignment
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="worker-select"
            className="text-sm font-medium text-gray-700"
          >
            Select Worker
          </label>
          <div className="flex gap-4">
            <select
              id="worker-select"
              value={selectedWorkerId || ""}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Select a worker</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.username}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssignment}
              disabled={isLoading || !selectedWorkerId}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${
                  isLoading || !selectedWorkerId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Assigning...
                </>
              ) : (
                "Assign Worker"
              )}
            </button>
          </div>
        </div>

        {currentWorkerId && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="ml-2 text-sm text-blue-700">
                Currently assigned to:{" "}
                {workers.find((w) => w.id === parseInt(currentWorkerId))
                  ?.username || "Loading..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerAssignment;
