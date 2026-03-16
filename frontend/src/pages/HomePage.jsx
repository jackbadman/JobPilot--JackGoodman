import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div>
            <BrandMark />
            <p className="eyebrow">Job Pilot</p>
            <h1 className="hero-title">Turn a messy job hunt into a clear pipeline.</h1>
            <p className="hero-subtitle">
              Capture every application, keep important dates visible, and
              move through interviews with a dashboard that stays focused on
              what matters.
            </p>
          </div>

          <div className="home-actions">
            <Link className="create-button" to="/login">
              Log in
            </Link>
            <Link className="ghost-button" to="/signup">
              Create account
            </Link>
          </div>

          <div className="hero-stats" aria-label="Product benefits">
            <div className="hero-stat">
              <span className="hero-stat-value">1 place</span>
              <span className="hero-stat-label">for roles, files, and deadlines</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">Clear</span>
              <span className="hero-stat-label">status tracking from apply to offer</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">Faster</span>
              <span className="hero-stat-label">reviews before the next application sprint</span>
            </div>
          </div>
        </div>

        <aside className="hero-aside" aria-label="Feature overview">
          <div className="feature-card">
            <p className="eyebrow">Overview</p>
            <h2>Designed for repeat applications, not just one-off tracking.</h2>
            <p>
              Job Pilot keeps your search legible when volume increases:
              application history, attached documents, and recent activity stay
              visible without clutter.
            </p>
          </div>

          <div className="feature-card">
            <h3>What the UI should do</h3>
            <p>Show momentum quickly, reduce form friction, and make each record easy to scan.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
