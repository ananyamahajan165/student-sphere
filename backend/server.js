const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

app.get("/", (req, res) => {
    res.send("Backend running");
});

app.listen(5000, () => console.log("Server running on port 5000"));