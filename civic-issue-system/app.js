// app.js
"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const issueRoutes = require("./routes/issueRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Make uploads folder publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true, // Allow credentials
};
app.use(cors(corsOptions)); //Uses CORS to allow cross-origin requests

// Basic route to test server
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Civic Issue System API");
});
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/comments", commentRoutes);

// Test database connection
db.sequelize
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((error) => console.error("Error connecting to the database:", error));

// Sync models with the database
// db.sequelize
//   .sync({ force: false }) // Use `force: true` in development to recreate tables
//   .then(() => console.log("Database synced!"))
//   .catch((error) => console.error("Error syncing the database:", error));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  // console.log(process.env.JWT_SECRET);
});
