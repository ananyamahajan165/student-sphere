# Student Details Platform

A simple student details platform built with Node.js, Express.js, the File System module, and plain frontend files.

Student records are stored in a local JSON file, and the frontend displays student data in a simple table. New student records can be added, updated, or deleted using Thunder Client.

## Features

- Store student records in `students.json`
- Perform CRUD operations using REST APIs
- View student details on a simple frontend page
- Test APIs easily with Thunder Client
- Uses only Express, FS module, HTML, CSS, and JavaScript

## Tech Stack

- Node.js
- Express.js
- File System (`fs`) module
- HTML
- CSS
- JavaScript

## Project Structure

```text
student-sphere/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── data/
│   └── students.json
├── src/
│   ├── controllers/
│   │   └── student.controller.js
│   ├── routes/
│   │   └── student.routes.js
│   ├── utils/
│   │   └── file.util.js
│   └── app.js
├── server.js
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Run the Project

```bash
npm start
```

Server URL:

```text
http://localhost:3000
```

Frontend URL:

```text
http://localhost:3000/index.html
```

## API Endpoints

### 1. Get all students

```http
GET /api/students
```

### 2. Get student by ID

```http
GET /api/students/:id
```

### 3. Add a student

```http
POST /api/students
Content-Type: application/json
```

Example body:

```json
{
  "name": "Ananya",
  "email": "ananya@gmail.com",
  "age": 20
}
```

### 4. Update a student

```http
PUT /api/students/:id
Content-Type: application/json
```

Example body:

```json
{
  "name": "Ananya Sharma",
  "email": "ananya123@gmail.com",
  "age": 21
}
```

### 5. Delete a student

```http
DELETE /api/students/:id
```

## Thunder Client Usage

1. Run the server using `npm start`
2. Open Thunder Client in VS Code
3. Create a `POST` request to `http://localhost:3000/api/students`
4. Send student data in JSON format
5. Open `http://localhost:3000/index.html`
6. Click `Refresh Students` to view the latest student details

## Important Notes

- Data is stored in `data/students.json`
- The frontend is only for viewing student details
- CRUD operations can be tested using Thunder Client
- This project is suitable for college assignments and practical exams
