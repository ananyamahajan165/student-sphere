const express = require("express");
const path = require("path");
const app = require("./src/app");

const PORT = 5001;

app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});