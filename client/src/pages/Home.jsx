import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="page-shell home-page">
      <section className="container home-container">
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
