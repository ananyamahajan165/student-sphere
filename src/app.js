const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/student.routes");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/students", studentRoutes);

module.exports = app;