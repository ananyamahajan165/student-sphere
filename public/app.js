const API = "http://localhost:5001/api/students";

// Add student
async function addStudent() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  const marks = document.getElementById("marks").value;

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, age, marks })
  });

  alert("Student Added!");
}

// Get all students
async function getStudents() {
  const res = await fetch(API);
  const data = await res.json();

  display(data);
}

// Get ranking
async function getRanking() {
  const res = await fetch(API + "/rank");
  const data = await res.json();

  display(data);
}

// Get topper
async function getTopper() {
  const res = await fetch(API + "/topper");
  const data = await res.json();

  display([data]);
}

// Display function
function display(data) {
  const output = document.getElementById("output");
  output.innerHTML = "";

  data.forEach((s) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>
        <b>${s.name}</b> | ${s.email} | Age: ${s.age} | Marks: ${s.marks}
        ${s.rank ? "| Rank: " + s.rank : ""}
        ${s.grade ? "| Grade: " + s.grade : ""}
      </p>
    `;
    output.appendChild(div);
  });
}

function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(user => {

        if(user.role === "student") {
            window.location.href = "/student-dashboard.html";
        } else {
            window.location.href = "/teacher-dashboard.html";
        }

    });
}