import { useEffect, useState } from "react";
import SummaryCards from "../components/SummaryCards";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/summary")
      .then(res => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Application Dashboard</h1>
      {summary && <SummaryCards summary={summary} />}
    </div>
  );
}