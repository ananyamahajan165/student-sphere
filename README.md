# Student Details Platform

This is a simple Node.js and Express.js project that stores student details in a JSON file using the File System module.

## Features

- Add student details using Thunder Client
- View all student details in the browser
- Get single student by ID
- Update student by ID
- Delete student by ID
- Data is stored in `data/students.json`

## Tech Used

- Node.js
- Express.js
- FS module
- HTML
- CSS
- JavaScript

## Folder Structure

```text
project/
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

## Install and Run

```bash
npm install
npm start
```

Server runs on:

```text
http://localhost:3000
```

Frontend page:

```text
http://localhost:3000/index.html
```

## API Endpoints

### Get all students

```http
GET /api/students
```

### Get student by ID

```http
GET /api/students/:id
```

### Add student

```http
POST /api/students
Content-Type: application/json
```

```json
{
  "name": "Ananya",
  "email": "ananya@gmail.com",
  "age": 20
}
```

### Update student

```http
PUT /api/students/:id
Content-Type: application/json
```

```json
{
  "name": "Ananya Sharma",
  "email": "ananya123@gmail.com",
  "age": 21
}
```

### Delete student

```http
DELETE /api/students/:id
```

## Thunder Client Testing

Use Thunder Client in VS Code to test the APIs.

1. Start the server using `npm start`
2. Open Thunder Client
3. Create a `POST` request to `http://localhost:3000/api/students`
4. Add JSON body and send request
5. Open `http://localhost:3000/index.html` in the browser
6. Click `Refresh Students` to see updated data

## Notes

- Student data is stored in `data/students.json`
- Frontend only displays student details
- Add, update, and delete operations can be done using Thunder Client
