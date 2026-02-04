import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Job Pilot</p>
          <h1>Track your job applications with less friction.</h1>
          <p className="page-subtitle">
            Keep a clean, structured record of applications, deadlines, and
            progress in one place.
          </p>
        </div>
      </header>

      <section className="home-actions">
        <Link className="create-button" to="/login">
          Log in
        </Link>
        <Link className="ghost-button" to="/signup">
          Sign up
        </Link>
      </section>
    </div>
  );
}
