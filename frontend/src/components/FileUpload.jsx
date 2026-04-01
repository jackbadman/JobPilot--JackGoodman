import "./FileUpload.css";

const ACCEPTED_TYPES = ".pdf,.png,.jpg,.jpeg,.doc,.docx";

const getFileName = file => file?.filename || file?.name || "Untitled file";

/**
 * File picker used by job forms. Uploading is handled by the parent submit flow.
 */
export default function FileUpload({
  files = [],
  existingFiles = [],
  onFilesChange,
  disabled = false
}) {
  const onFileChange = event => {
    const pickedFiles = Array.from(event.target.files || []);
    if (!pickedFiles.length) return;
    onFilesChange?.([...files, ...pickedFiles]);
    event.target.value = "";
  };

  const removeFile = index => {
    onFilesChange?.(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <section className="upload-card" aria-label="File upload">
      <h3 className="upload-title">Attach files</h3>
      <p className="upload-help">Allowed: PDF, DOC, DOCX, PNG, JPG. Max size: 5MB each.</p>

      <input
        className="input"
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        onChange={onFileChange}
        disabled={disabled}
      />

      {existingFiles.length ? (
        <div className="upload-file-list">
          {existingFiles.map(file => (
            <div
              key={file._id || file.publicId || file.url || getFileName(file)}
              className="upload-file-row"
            >
              {file.url ? (
                <a
                  className="upload-file-link"
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {getFileName(file)}
                </a>
              ) : (
                <span>{getFileName(file)}</span>
              )}
              <span className="upload-file-badge">Uploaded</span>
            </div>
          ))}
        </div>
      ) : null}

      {files.length ? (
        <div className="upload-file-list">
          {files.map((file, index) => (
            <div key={`${getFileName(file)}-${file.size}-${index}`} className="upload-file-row">
              <span>{getFileName(file)}</span>
              <button
                type="button"
                className="table-action danger"
                onClick={() => removeFile(index)}
                disabled={disabled}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
