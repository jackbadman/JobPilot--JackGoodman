/**
 * Dashboard view: loads summary metrics and job list.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import JobsTable from "../components/JobsTable";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [jobs, setJobs] = useState([]);

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchSummary = () => {
    fetch("http://localhost:5000/api/dashboard/summary", {
      headers: authHeaders()
    })
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);
  };

  const fetchJobs = () => {
    fetch("http://localhost:5000/api/jobs", {
      headers: authHeaders()
    })
      .then(res => res.json())
      .then(setJobs)
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
    fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      method: "DELETE",
      headers: authHeaders()
    })
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
