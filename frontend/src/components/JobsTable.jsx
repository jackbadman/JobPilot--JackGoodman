/**
 * Job list table with edit/delete actions.
 */
import { Link } from "react-router-dom";

export default function JobsTable({ jobs, onDelete }) {
  if (!jobs.length) return <p>No applications found.</p>;

  const confirmDelete = job => {
    if (!onDelete) return;
    const label = `${job.company} - ${job.jobTitle}`;
    const shouldDelete = window.confirm(
      `Delete this application?\n\n${label}`
    );
    if (shouldDelete) {
      onDelete(job._id);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>Job Title</th>
          <th>Status</th>
          <th>Type</th>
          <th>Location</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job._id}>
            <td>{job.company}</td>
            <td>{job.jobTitle}</td>
            <td>{job.jobStatus?.name || "—"}</td>
            <td>{job.jobType?.name || "—"}</td>
            <td>{job.location?.name || "—"}</td>
            <td>
              {new Date(job.createdAt).toLocaleDateString()}
            </td>
            <td>
              <div className="table-actions">
                <Link
                  className="table-action"
                  to={`/jobs/${job._id}/edit`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="table-action danger"
                  onClick={() => confirmDelete(job)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
