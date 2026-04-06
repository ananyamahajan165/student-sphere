const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // 👈 IMPORTANT

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

app.use("/api/students", studentRoutes);

module.exports = app;