/**
 * Dashboard summary cards for totals and recent counts.
 */
import "./SummaryCards.css";

export default function SummaryCards({ summary }) {
  const items = [
    {
      label: "Total applications",
      value: summary.totalApplications ?? 0,
      meta: "All tracked roles in your pipeline"
    },
    {
      label: "Recent activity",
      value: summary.recentCount ?? 0,
      meta: "Applications created in the last 14 days"
    }
  ];

  return (
    <div className="summary-grid">
      {items.map(item => (
        <article key={item.label} className="summary-card">
          <span className="summary-label">{item.label}</span>
          <strong className="summary-value">{item.value}</strong>
          <span className="summary-meta">{item.meta}</span>
        </article>
      ))}
    </div>
  );
}
