const API_URL = "/api/students";
const table = document.getElementById("studentTable");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");

async function fetchStudents() {
  try {
    const response = await fetch(API_URL);
    const students = await response.json();

    table.innerHTML = "";

    if (!students.length) {
      message.textContent = "No student details available right now.";
      return;
    }

    message.textContent = "";

    students.forEach((student) => {
      table.innerHTML += `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.age}</td>
        </tr>
      `;
    });
  } catch (error) {
    table.innerHTML = "";
    message.textContent = "Unable to load student details.";
  }
}

refreshBtn.addEventListener("click", fetchStudents);

fetchStudents();
