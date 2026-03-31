const API = "http://localhost:5000/api/students";

async function addStudent() {
  const name = document.getElementById("name").value;
  const marks = document.getElementById("marks").value;

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, marks })
  });

  alert("Student added");
}

async function getRanking() {
  const res = await fetch(API + "/rank");
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach((s) => {
    const li = document.createElement("li");
    li.innerText = `${s.rank}. ${s.name} - ${s.marks}`;
    list.appendChild(li);
  });
}