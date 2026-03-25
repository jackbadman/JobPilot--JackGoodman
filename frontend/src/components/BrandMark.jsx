export default function BrandMark({ compact = false, invert = false }) {
  return (
    <div className={`brand-mark${compact ? " brand-mark-compact" : ""}${invert ? " brand-mark-invert" : ""}`}>
      <img className="brand-logo" src="/logo.jpg" alt="Job Pilot logo" />
      <div className="brand-copy">
        <span className="brand-name">Job Pilot</span>
        <span className="brand-tagline">Launch your application pipeline</span>
      </div>
    </div>
  );
}
