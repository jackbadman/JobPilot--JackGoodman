/**
 * Dashboard view: loads summary metrics and job list.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import JobsTable from "../components/JobsTable";
import { apiFetch } from "../utils/api";

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

  return (
    <div>
      <div className="page-header">
        <h1>Application Dashboard</h1>
        <Link className="create-button" to="/jobs/new">
          Create application
        </Link>
      </div>

      {summary && <SummaryCards summary={summary} />}

      <JobsTable jobs={jobs} onDelete={handleDelete} />
    </div>
  );
}
