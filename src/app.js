const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/students", studentRoutes);

module.exports = app; 

app.get("/test", (req, res) => {
  res.send("WORKING");
});

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

require("./routes/studentRoutes")