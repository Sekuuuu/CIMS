// src/components/IssueMap.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const IssueMap = ({ latitude, longitude, title, description }) => {
  return (
    <div className="mb-6 rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {description}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default IssueMap;
