import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyOption = { _id: "", name: "Select..." };

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "",
    jobTitle: "",
    location: "",
    jobStatus: "",
    jobType: "",
    workType: "",
    salary: "",
    appliedDate: "",
    closingDate: ""
  });
  const [lookups, setLookups] = useState({
    jobStatuses: [],
    jobTypes: [],
    workTypes: [],
    locations: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/lookup/job-statuses").then(res =>
        res.json()
      ),
      fetch("http://localhost:5000/api/lookup/job-types").then(res =>
        res.json()
      ),
      fetch("http://localhost:5000/api/lookup/work-types").then(res =>
        res.json()
      ),
      fetch("http://localhost:5000/api/lookup/locations").then(res =>
        res.json()
      )
    ])
      .then(([jobStatuses, jobTypes, workTypes, locations]) => {
        setLookups({ jobStatuses, jobTypes, workTypes, locations });
      })
      .catch(() => {
        setError("Failed to load dropdown data.");
      });
  }, []);

  const selectOptions = useMemo(() => ({
    jobStatuses: [emptyOption, ...lookups.jobStatuses],
    jobTypes: [emptyOption, ...lookups.jobTypes],
    workTypes: [emptyOption, ...lookups.workTypes],
    locations: [emptyOption, ...lookups.locations]
  }), [lookups]);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitForm = event => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      company: form.company.trim(),
      jobTitle: form.jobTitle.trim(),
      location: form.location,
      jobStatus: form.jobStatus,
      jobType: form.jobType,
      workType: form.workType,
      salary: form.salary ? Number(form.salary) : undefined,
      appliedDate: form.appliedDate || undefined,
      closingDate: form.closingDate || undefined
    };

    fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create application.");
        }
      })
      .then(() => navigate("/"))
      .catch(err => setError(err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Create Application</h2>
          <button
            type="button"
            className="ghost-button"
            onClick={() => navigate("/")}
          >
            Close
          </button>
        </div>

        <form className="form-grid" onSubmit={submitForm}>
          <label className="form-field">
            Company
            <input
              className="input"
              value={form.company}
              onChange={event => updateField("company", event.target.value)}
              required
            />
          </label>

          <label className="form-field">
            Job title
            <input
              className="input"
              value={form.jobTitle}
              onChange={event => updateField("jobTitle", event.target.value)}
              required
            />
          </label>

          <label className="form-field">
            Location
            <select
              className="input"
              value={form.location}
              onChange={event => updateField("location", event.target.value)}
              required
            >
              {selectOptions.locations.map(option => (
                <option key={option._id || "empty"} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            Status
            <select
              className="input"
              value={form.jobStatus}
              onChange={event => updateField("jobStatus", event.target.value)}
              required
            >
              {selectOptions.jobStatuses.map(option => (
                <option key={option._id || "empty"} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            Job type
            <select
              className="input"
              value={form.jobType}
              onChange={event => updateField("jobType", event.target.value)}
              required
            >
              {selectOptions.jobTypes.map(option => (
                <option key={option._id || "empty"} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            Work type
            <select
              className="input"
              value={form.workType}
              onChange={event => updateField("workType", event.target.value)}
              required
            >
              {selectOptions.workTypes.map(option => (
                <option key={option._id || "empty"} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            Salary
            <input
              className="input"
              type="number"
              min="0"
              value={form.salary}
              onChange={event => updateField("salary", event.target.value)}
            />
          </label>

          <label className="form-field">
            Applied date
            <input
              className="input"
              type="date"
              value={form.appliedDate}
              onChange={event => updateField("appliedDate", event.target.value)}
            />
          </label>

          <label className="form-field">
            Closing date
            <input
              className="input"
              type="date"
              value={form.closingDate}
              onChange={event => updateField("closingDate", event.target.value)}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <button type="button" className="ghost-button" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
