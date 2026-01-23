export default function SummaryCards({ summary }) {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div>
        <h3>Total Applications</h3>
        <p>{summary.totalApplications}</p>
      </div>
      <div>
        <h3>Recent (14 days)</h3>
        <p>{summary.recentCount}</p>
      </div>
    </div>
  );
}
