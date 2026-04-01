/**
 * Edit job form view; loads lookup data and existing job details.
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";
import FileUpload from "../components/FileUpload";

const emptyOption = { _id: "", name: "Select..." };

const toDateInputValue = value => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function EditJobPage() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      apiFetch("http://localhost:5000/api/lookup/job-statuses").then(res => res.json()),
      apiFetch("http://localhost:5000/api/lookup/job-types").then(res => res.json()),
      apiFetch("http://localhost:5000/api/lookup/work-types").then(res => res.json()),
      apiFetch("http://localhost:5000/api/lookup/locations").then(res => res.json()),
      apiFetch(`http://localhost:5000/api/jobs/${id}`).then(res => {
        if (!res.ok) {
          throw new Error("Failed to load application.");
        }
        return res.json();
      })
    ])
      .then(([jobStatuses, jobTypes, workTypes, locations, job]) => {
        if (!isMounted) return;
        setLookups({ jobStatuses, jobTypes, workTypes, locations });
        setForm({
          company: job.company || "",
          jobTitle: job.jobTitle || "",
          location: job.location?._id || "",
          jobStatus: job.jobStatus?._id || "",
          jobType: job.jobType?._id || "",
          workType: job.workType?._id || "",
          salary: job.salary ?? "",
          appliedDate: toDateInputValue(job.appliedDate),
          closingDate: toDateInputValue(job.closingDate)
        });
        setExistingFiles(Array.isArray(job.files) ? job.files : []);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message || "Failed to load application.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const selectOptions = useMemo(
    () => ({
      jobStatuses: [emptyOption, ...lookups.jobStatuses],
      jobTypes: [emptyOption, ...lookups.jobTypes],
      workTypes: [emptyOption, ...lookups.workTypes],
      locations: [emptyOption, ...lookups.locations]
    }),
    [lookups]
  );

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const uploadFilesForJob = async () => {
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobId", id);

      const response = await apiFetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || `Failed to upload ${file.name}.`);
      }
    }
  };

  const submitForm = async event => {
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

    try {
      const updateResponse = await apiFetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const updateData = await updateResponse.json().catch(() => null);
      if (!updateResponse.ok) {
        throw new Error(updateData?.error || "Failed to update application.");
      }

      await uploadFilesForJob();
      setSelectedFiles([]);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Edit Application</h2>
          <button
            type="button"
            className="ghost-button"
            onClick={() => navigate("/dashboard")}
          >
            Close
          </button>
        </div>

        {loading ? (
          <p>Loading application...</p>
        ) : (
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

            <div className="form-span">
              <FileUpload
                files={selectedFiles}
                existingFiles={existingFiles}
                onFilesChange={setSelectedFiles}
                disabled={submitting}
              />
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="form-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button className="create-button" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
