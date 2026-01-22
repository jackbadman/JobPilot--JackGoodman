import { useEffect } from "react";

function App() {
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    fetch(`${apiBaseUrl}/api/jobs`)
      .then(res => res.json())
      .then(data => console.log("Jobs from backend:", data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div>
      <h1>Job Pilot Frontend</h1>
    </div>
  );
}

export default App;
