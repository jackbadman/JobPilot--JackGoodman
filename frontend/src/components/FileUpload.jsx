const ACCEPTED_TYPES = ".pdf,.png,.jpg,.jpeg,.doc,.docx";

/**
 * File picker used by job forms. Uploading is handled by the parent submit flow.
 */
export default function FileUpload({ files = [], onFilesChange, disabled = false }) {
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

      {files.length ? (
        <div className="upload-file-list">
          {files.map((file, index) => (
            <div key={`${file.name}-${file.size}-${index}`} className="upload-file-row">
              <span>{file.name}</span>
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
