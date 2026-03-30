const express = require("express");
const path = require("path");
const studentRoutes = require("./routes/student.routes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/students", studentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
