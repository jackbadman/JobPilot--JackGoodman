/**
 * Dashboard view: loads summary metrics and job list.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import SummaryCards from "../components/SummaryCards";
import JobsTable from "../components/JobsTable";
import { clearToken } from "../utils/auth";
import { apiFetch } from "../utils/api";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [jobs, setJobs] = useState([]);

  const fetchSummary = () => {
    apiFetch("http://localhost:5000/api/dashboard/summary")
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load dashboard summary.");
        }
        setSummary(data);
      })
      .catch(console.error);
  };

  const fetchJobs = () => {
    apiFetch("http://localhost:5000/api/jobs")
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load applications.");
        }
        setJobs(data);
      })
      .catch(console.error);
  };

  // Fetch dashboard summary
  useEffect(() => {
    fetchSummary();
  }, []);

  // Fetch job applications
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = jobId => {
    apiFetch(`http://localhost:5000/api/jobs/${jobId}`, { method: "DELETE" })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to delete application.");
        }
      })
      .then(() => {
        setJobs(prev => prev.filter(job => job._id !== jobId));
        fetchSummary();
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    clearToken();
    window.location.replace("/");
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-banner">
        <div className="dashboard-banner-copy">
          <div className="dashboard-brand">
            <BrandMark compact />
          </div>
          <span className="dashboard-kicker">Pipeline view</span>
          <h1>Application Dashboard</h1>
          <p>
            Review your current search at a glance, then jump straight into the
            next application or cleanup task.
          </p>
        </div>

        <div className="dashboard-banner-actions">
          <Link className="ghost-button" to="/">
            Home
          </Link>
          <Link className="create-button" to="/jobs/new">
            Create application
          </Link>
          <button className="ghost-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>

      <div>
        {summary && <SummaryCards summary={summary} />}
      </div>
      <JobsTable jobs={jobs} onDelete={handleDelete} />
    </div>
  );
}
