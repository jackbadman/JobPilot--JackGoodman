import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, setToken } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitForm = event => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailAddress: form.email.trim(),
        password: form.password
      })
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Login failed.");
        }
        if (!data.token) {
          throw new Error("Login failed: missing auth token.");
        }
        setToken(data.token);
      })
      .then(() => navigate("/dashboard"))
      .catch(err => {
        clearToken();
        setError(err.message);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Log in to Job Pilot</h1>
          <p className="page-subtitle">
            Enter your email and password to continue.
          </p>
        </div>
      </header>

      <form className="auth-card" onSubmit={submitForm}>
        <label className="form-field">
          Email
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={event => updateField("email", event.target.value)}
            required
          />
        </label>
        <label className="form-field">
          Password
          <input
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={event => updateField("password", event.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </div>
      </form>

      <p className="page-subtitle">
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
