const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static("public"));

// routes
app.use("/api/students", studentRoutes);

module.exports = app;
