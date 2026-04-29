import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (localStorage.getItem('token')) {
      navigate(storedUser?.role === 'mentor' ? '/dashboard/mentor' : '/dashboard/student');
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Login failed.');
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
          <h2>Login to your dashboard</h2>
          <p className="hero-copy">Pick up where you left off and manage student progress, attendance, and campus circulars.</p>
          <ul className="feature-list">
            <li>Mentor and student accounts</li>
            <li>Fast access to marks and attendance</li>
            <li>Clean, modern university interface</li>
          </ul>
        </div>
        <div className="auth-card">
          <div className="auth-panel">
          <form onSubmit={handleSubmit}>
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
              placeholder="Your password"
              required
            />
            <button type="submit">Login</button>
          </form>
          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          {message && <div className="feedback">{message}</div>}
        </div>
        </div>
      </section>
    </main>
  );
}
