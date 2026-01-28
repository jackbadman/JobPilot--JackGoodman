import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import JobsTable from "../components/JobsTable";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [jobs, setJobs] = useState([]);

  // Fetch dashboard summary
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/summary")
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  // Fetch job applications
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then(res => res.json())
      .then(setJobs)
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Application Dashboard</h1>
        <Link className="create-button" to="/jobs/new">
          Create application
        </Link>
      </div>

      {summary && <SummaryCards summary={summary} />}

      <JobsTable jobs={jobs} />
    </div>
  );
}
