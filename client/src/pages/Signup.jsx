import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          profile: {
            enrollmentNumber: enrollmentNumber.trim(),
            department: department.trim(),
            semester: semester.trim(),
            year: year.trim(),
            phone: phone.trim(),
          },
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Signup failed.');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(data.user.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student');
    } catch (error) {
      setMessage('Unable to reach the server. Please try again.');
    }
  }

  return (
    <main className="page-shell auth-page">
      <section className="auth-grid">
        <div className="auth-hero">
          <div className="brand-badge">Student Sphere</div>
          <h2>Create your account</h2>
          <p className="hero-copy">Get started as a mentor or student with a smooth onboarding experience and university-grade dashboard.</p>
          <ul className="feature-list">
            <li>Mentors can add students and manage marks.</li>
            <li>Students can track attendance and subject performance.</li>
            <li>One platform for campus notices, results, and student details.</li>
          </ul>
        </div>
        <div className="auth-card">
          <div className="auth-panel">
          <form onSubmit={handleSubmit}>
            <label htmlFor="role">Account type</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
            </select>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
            {role === 'student' && (
              <>
                <label htmlFor="enrollmentNumber">Enrollment number</label>
                <input
                  id="enrollmentNumber"
                  type="text"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  placeholder="e.g. 2026UG010"
                  required
                />
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  required
                />
                <div className="field-row">
                  <div>
                    <label htmlFor="semester">Semester</label>
                    <input
                      id="semester"
                      type="text"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      placeholder="e.g. 5"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="year">Year</label>
                    <input
                      id="year"
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2026"
                      required
                    />
                  </div>
                </div>
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Student phone"
                  required
                />
              </>
            )}
            <button type="submit">Sign Up</button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          {message && <div className="feedback">{message}</div>}
        </div>
        </div>
      </section>
    </main>
  );
}
