const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

// API routes
app.use("/api/students", studentRoutes);

module.exports = app;

app.use(express.static("public"));