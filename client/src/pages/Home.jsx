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
      <section className="container home-container">
        <div className="home-header">
          <button type="button" className="ghost theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
        <div className="brand-badge">Student Sphere</div>
        <h1>Student Sphere</h1>
        <p className="lead">Simple student management with login, signup, and leaderboard all in one place.</p>
        <div className="cta-row">
          <Link to="/signup" className="btn">Sign Up</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </section>
    </main>
  );
}
