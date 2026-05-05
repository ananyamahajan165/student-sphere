import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <main className="page-shell home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">Student Sphere</div>
          <div className="navbar-right">
            <button type="button" className="ghost theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/login" className="btn-sm">Login</Link>
            <Link to="/signup" className="btn-sm primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Smart Student Management System</h1>
          <p className="hero-subtitle">
            Manage students, track attendance, upload marks, and stay connected with real-time updates.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-lg">Get Started</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Key Features</h2>
          <p>Everything you need to manage student progress effectively</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>Dual Roles</h3>
            <p>Separate dashboards for mentors and students with role-based access.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Mark Tracking</h3>
            <p>Upload and track student marks across subjects with automatic percentage calculation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Attendance</h3>
            <p>Monitor and record student attendance with real-time percentage updates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Real-Time Sync</h3>
            <p>Students see mentor updates instantly with automatic data synchronization.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Campus Updates</h3>
            <p>Share announcements and important circulars with all students in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Auth</h3>
            <p>JWT-based authentication with secure password hashing and role-based access.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>A simple workflow for mentors and students</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up / Login</h3>
            <p>Create a mentor or student account with your credentials.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Access Dashboard</h3>
            <p>View your personalized dashboard with all relevant information.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Manage Data</h3>
            <p>Mentors add students, marks, and attendance records.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Real-Time View</h3>
            <p>Students instantly see their progress and metrics.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Student Sphere. All rights reserved.</p>
      </footer>
    </main>
  );
}
