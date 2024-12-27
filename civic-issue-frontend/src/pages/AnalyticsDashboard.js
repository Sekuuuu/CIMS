import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [frequentIssues, setFrequentIssues] = useState([]);
  const [resolutionTime, setResolutionTime] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get("/analytics");
        setAnalytics(response.data);

        const trendsResponse = await axiosInstance.get("/analytics/trends");
        setTrends(trendsResponse.data);

        const frequentResponse = await axiosInstance.get("/analytics/frequent");
        setFrequentIssues(frequentResponse.data);

        const resolutionResponse = await axiosInstance.get(
          "/analytics/resolution-time"
        );
        setResolutionTime(resolutionResponse.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  const { totalIssues, issuesByStatus, issuesByPriority } = analytics;

  // Status Chart Data
  const statusData = {
    labels: issuesByStatus.map((item) => item.status),
    datasets: [
      {
        label: "Issues by Status",
        data: issuesByStatus.map((item) => item.count),
        backgroundColor: ["#4C51BF", "#4299E1", "#48BB78"],
      },
    ],
  };

  // Priority Chart Data
  const priorityLabels = ["1", "2", "3", "4", "5", "6", "7"];
  const priorityCounts = priorityLabels.map((label) => {
    const priorityItem = issuesByPriority.find(
      (item) => item.priority === parseInt(label)
    );
    return priorityItem ? priorityItem.count : 0;
  });

  const priorityData = {
    labels: priorityLabels,
    datasets: [
      {
        label: "Issues by Priority",
        data: priorityCounts,
        backgroundColor: [
          "#E53E3E", // Red
          "#DD6B20", // Orange
          "#D69E2E", // Yellow
          "#38A169", // Green
          "#3182CE", // Blue
          "#805AD5", // Purple
          "#6B46C1", // Dark Purple
        ],
      },
    ],
  };

  // Trends Chart Data
  const trendsData = {
    labels: trends.map((item) => item.date),
    datasets: [
      {
        label: "Issues Reported Over Time",
        data: trends.map((item) => item.count),
        fill: false,
        borderColor: "#4299E1",
        tension: 0.3,
      },
    ],
  };

  // Frequent Issue Types Data
  const frequentIssuesData = {
    labels: frequentIssues.map((item) => item.title),
    datasets: [
      {
        label: "Top 5 Frequent Issues",
        data: frequentIssues.map((item) => item.count),
        backgroundColor: "#48BB78",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive overview of all reported issues and their statistics
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              Total Issues
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {totalIssues}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Open Issues</div>
            <div className="mt-2 text-3xl font-semibold text-indigo-600">
              {issuesByStatus.find((item) => item.status === "open")?.count ||
                0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              High Priority Issues
            </div>
            <div className="mt-2 text-3xl font-semibold text-red-600">
              {issuesByPriority.find((item) => item.priority === 1)?.count || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">
              Avg. Resolution Time
            </div>
            <div className="mt-2 text-3xl font-semibold text-green-600">
              {Number(resolutionTime[0]?.avgResolutionTime || 0).toFixed(1)}{" "}
              days
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Issues by Status
              </h2>
              <div className="h-[300px]">
                <Pie
                  data={statusData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Issues by Priority
              </h2>
              <div className="h-[300px]">
                <Bar
                  data={priorityData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Trends Over Time */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Issue Trends
              </h2>
              <div className="h-[300px]">
                <Line
                  data={trendsData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Frequent Issues */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Top Issue Types
              </h2>
              <div className="h-[300px]">
                <Bar
                  data={frequentIssuesData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
