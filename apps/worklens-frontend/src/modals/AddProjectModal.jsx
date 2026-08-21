import { useState } from "react";
import "../styles/Modal.css";

function AddProjectModal({ isOpen, onClose, onSave, isLoading }) {
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!projectName.trim()) {
    setError("Project name is required.");
    return;
  }

  console.log("SAVE BUTTON CLICKED:", projectName.trim());

  try {
    await onSave(projectName.trim());
    setSuccess(`Project "${projectName.trim()}" created successfully!`);
    setProjectName("");

    setTimeout(() => {
      handleClose();
    }, 2000);
  } catch (err) {
    setError(err.message || "Failed to create project.");
  }
};

  const handleClose = () => {
    setProjectName("");
    setError("");
    setSuccess("");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
    className="modal-dialog"
    style={{
      pointerEvents: "auto",
      position: "relative",
      zIndex: 1001,
    }}
  >
        <div className="modal-header">
          <h2 className="modal-title">Add Project</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {success && (
              <div className="modal-success-message">
                <span className="modal-success-icon">✓</span>
                {success}
              </div>
            )}

            {!success && (
              <div className="modal-form-group">
                <label htmlFor="projectName" className="modal-label">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  className={`modal-input${error ? " modal-input--error" : ""}`}
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
                {error && <div className="modal-error-message">{error}</div>}
              </div>
            )}
          </div>

          {!success && (
            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn modal-btn--secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal-btn modal-btn--primary"
                disabled={isLoading}
                onClick={() => console.log("SAVE BUTTON ITSELF CLICKED")}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;
