export default function JobsTable({ jobs }) {
  if (!jobs.length) return <p>No applications found.</p>;

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
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job._id}>
            <td>{job.company}</td>
            <td>{job.jobTitle}</td>
            <td>{job.jobStatus?.name || "—"}</td>
            <td>{job.jobType1?.name || "—"}</td>
            <td>{job.location?.name || "—"}</td>
            <td>
              {new Date(job.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
