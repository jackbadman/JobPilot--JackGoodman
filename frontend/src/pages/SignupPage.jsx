import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, setToken } from "../utils/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitForm = event => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        emailAddress: form.email.trim(),
        password: form.password
      })
    })
      .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Sign up failed.");
        }
        if (!data.token) {
          throw new Error("Sign up failed: missing auth token.");
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
          <p className="eyebrow">Get started</p>
          <h1>Create your Job Pilot account</h1>
          <p className="page-subtitle">
            Set up an account to start tracking applications.
          </p>
        </div>
      </header>

      <form className="auth-card" onSubmit={submitForm}>
        <label className="form-field">
          Name
          <input
            className="input"
            type="text"
            name="name"
            value={form.name}
            onChange={event => updateField("name", event.target.value)}
            required
          />
        </label>
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
            {submitting ? "Creating..." : "Sign up"}
          </button>
        </div>
      </form>

      <p className="page-subtitle">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
