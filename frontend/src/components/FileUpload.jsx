import { useState } from "react";
import { apiFetch } from "../utils/api";

const ACCEPTED_TYPES = ".pdf,.png,.jpg,.jpeg,.doc,.docx";

/**
 * Uploads a file to the backend Cloudinary endpoint.
 */
export default function FileUpload({ jobId, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const onFileChange = event => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError("");
  };

  const onSubmit = async event => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose a file before uploading.");
      return;
    }
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (jobId) {
      formData.append("jobId", jobId);
    }

    try {
      const response = await apiFetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "File upload failed.");
      }

      setUploadedFile(data);
      if (typeof onUploaded === "function") {
        onUploaded(data);
      }
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="upload-card" aria-label="File upload">
      <h3 className="upload-title">Upload file</h3>
      <p className="upload-help">
        Allowed: PDF, DOC, DOCX, PNG, JPG. Max size: 5MB.
        {!jobId ? " File will be linked to your account until attached to a job." : ""}
      </p>

      <form className="upload-form" onSubmit={onSubmit}>
        <input
          className="input"
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={onFileChange}
          disabled={uploading}
        />

        <div className="upload-actions">
          <button type="submit" disabled={uploading || !selectedFile}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {error ? <p className="upload-error">{error}</p> : null}

      {uploadedFile?.url ? (
        <p className="upload-success">
          Uploaded: <a href={uploadedFile.url} target="_blank" rel="noreferrer">{uploadedFile.filename || uploadedFile.name || "View file"}</a>
        </p>
      ) : null}
    </section>
  );
}
