/**
 * Job list table with edit/delete actions.
 */
import { Link } from "react-router-dom";

export default function JobsTable({ jobs, onDelete }) {
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

  const getStatusClassName = statusName => {
    const normalized = String(statusName || "").toLowerCase();
    if (normalized.includes("interview")) return "status-pill status-interview";
    if (normalized.includes("offer")) return "status-pill status-offer";
    if (normalized.includes("reject")) return "status-pill status-rejected";
    if (normalized.includes("applied")) return "status-pill status-applied";
    return "status-pill status-unknown";
  };

  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <h2 className="table-title">Tracked applications</h2>
          <p className="table-subtitle">
            Review current roles, edit details, or remove records that are no longer relevant.
          </p>
        </div>
        <span className="table-count">{jobs.length} total</span>
      </div>

      {jobs.length ? (
        <div className="table-scroll">
          <table className="jobs-table">
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
                  <td className="cell-strong">{job.company}</td>
                  <td>{job.jobTitle}</td>
                  <td>
                    <span className={getStatusClassName(job.jobStatus?.name)}>
                      {job.jobStatus?.name || "Unknown"}
                    </span>
                  </td>
                  <td>{job.jobType?.name || "—"}</td>
                  <td>{job.location?.name || "—"}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <Link className="table-action" to={`/jobs/${job._id}/edit`}>
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
        </div>
      ) : (
        <div className="empty-state">
          <div>
            <p className="empty-title">No applications yet</p>
            <p className="empty-subtitle">
              Create your first application to start building a clearer view of your search.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
