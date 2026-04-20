const express = require("express");
const cors = require("cors");
const path = require("path");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// API routes
app.use("/api/students", studentRoutes);

module.exports = app;