const API_URL = "/api/students";

async function fetchStudents() {
  const response = await fetch(API_URL);
  const students = await response.json();
  const table = document.getElementById("studentTable");

  table.innerHTML = "";

  students.forEach((student) => {
    table.innerHTML += `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.age}</td>
        <td>
          <button class="edit" onclick="editStudent('${student.id}')">Edit</button>
          <button class="delete" onclick="deleteStudent('${student.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

async function addStudent() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value.trim();

  if (!name || !email || !age) {
    alert("All fields are required");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, age })
  });

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("age").value = "";

  fetchStudents();
}

async function deleteStudent(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchStudents();
}

async function editStudent(id) {
  const name = prompt("Enter new name");
  const email = prompt("Enter new email");
  const age = prompt("Enter new age");

  if (!name || !email || !age) {
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, age })
  });

  fetchStudents();
}

fetchStudents();
