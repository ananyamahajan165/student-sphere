const API = "http://localhost:5001/api/students";

// ================= LOGIN =================
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(user => {

        // ✅ Store user info
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Role-based redirect
        if(user.role === "student") {
            window.location.href = "student-dashboard.html";
        } else {
            window.location.href = "teacher-dashboard.html";
        }

    })
    .catch(err => {
        alert("Login Failed");
        console.error(err);
    });
}

// ================= AUTH CHECK =================
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function checkAuth(requiredRole) {
    const user = getUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // ✅ Role restriction
    if (requiredRole && user.role !== requiredRole) {
        alert("Access Denied!");
        window.location.href = "login.html";
    }
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ================= ADD STUDENT =================
async function addStudent() {
    const user = getUser();

    // ❌ Only teacher can add
    if (user.role !== "teacher") {
        alert("Only teachers can add students!");
        return;
    }

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
    getStudents();
}

// ================= GET STUDENTS =================
async function getStudents() {
    const res = await fetch(API);
    const data = await res.json();

    display(data);
}

// ================= GET RANKING =================
async function getRanking() {
    const user = getUser();

    // ❌ Only teacher can view ranking
    if (user.role !== "teacher") {
        alert("Access Denied! Students cannot view ranking.");
        return;
    }

    const res = await fetch(API + "/rank");
    const data = await res.json();

    display(data);
}

// ================= GET TOPPER =================
async function getTopper() {
    const res = await fetch(API + "/topper");
    const data = await res.json();

    display([data]);
}

// ================= DISPLAY =================
function display(data) {
    const output = document.getElementById("output");
    output.innerHTML = "";

    data.forEach((s) => {
        const div = document.createElement("div");

        div.classList.add("card"); // for styling

        div.innerHTML = `
            <p>
                <b>${s.name}</b><br>
                ${s.email}<br>
                Age: ${s.age}<br>
                Marks: ${s.marks}
                ${s.rank ? "<br>Rank: " + s.rank : ""}
                ${s.grade ? "<br>Grade: " + s.grade : ""}
            </p>
        `;

        output.appendChild(div);
    });
}

// ================= DASHBOARD CONTROL =================
function setupDashboard() {
    const user = getUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Show name + role
    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.innerHTML = `${user.name} (${user.role})`;
    }

    // Hide ranking button for students
    if (user.role === "student") {
        const rankBtn = document.getElementById("rankBtn");
        if (rankBtn) rankBtn.style.display = "none";
    }
}