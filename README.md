📘 Student Sphere – Student Management & Ranking System

📌 Project Overview

Student Sphere is a backend-based Student Management System built using Node.js and Express.js.
It allows users to perform CRUD operations on student data and provides a ranking system based on marks.


🚀 Features
➕ Add new student
📋 View all students
🔍 Get student by ID
✏️ Update student details
❌ Delete student
🏆 Rank students based on marks
🎯 Grade system (A+, A, B, C, F)
🥇 Get topper



🛠️ Tech Stack
Node.js
Express.js
JavaScript
JSON (File-based storage)
Nodemon


📁 Folder Structure
project/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── data/
│   └── students.json
│
├── src/
│   ├── controllers/
│   │   └── studentController.js
│   │
│   ├── routes/
│   │   └── student.routes.js
│   │
│   ├── utils/
│   │   ├── file.util.js
│   │   └── ranking.js
│   │
│   └── app.js
│
├── server.js
├── package.json
└── README.md