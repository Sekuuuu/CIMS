// src/components/AdminMap.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axiosInstance from "../services/axiosInstance";

const AdminMap = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axiosInstance.get("/issues");
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };
    fetchIssues();
  }, []);

  return (
    <MapContainer
      center={[27.7172, 85.324]} // Default location
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {issues.map((issue) => (
        <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
          <Popup>
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
            <p>
              <strong>Priority:</strong> {issue.priority || "Unassigned"}
            </p>
            <p>
              <strong>Status:</strong> {issue.status}
            </p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AdminMap;
