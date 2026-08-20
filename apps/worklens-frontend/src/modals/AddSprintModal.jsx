import { useState } from "react";
import "../styles/Modal.css";

function AddSprintModal({ isOpen, onClose, onSave, projects, isLoading }) {
  const [selectedProject, setSelectedProject] = useState("");
  const [sprintName, setSprintName] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!selectedProject.trim()) {
      newErrors.project = "Project is required.";
    }
    if (!sprintName.trim()) {
      newErrors.sprintName = "Sprint name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("Selected Project ID:", selectedProject);
      console.log("Sprint Name:", sprintName.trim());
      await onSave(selectedProject, sprintName.trim());
      const projectName = projects.find((p) => p.id === selectedProject)?.projectName || selectedProject;
      setSuccess(`Sprint "${sprintName.trim()}" created in project "${projectName}" successfully!`);
      setSelectedProject("");
      setSprintName("");
      setErrors({});
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to create sprint." });
    }
  };

  const handleClose = () => {
    setSelectedProject("");
    setSprintName("");
    setErrors({});
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
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-dialog"
        style={{
        pointerEvents: "auto",
        position: "relative",
        zIndex: 1001,
        }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Add Sprint</h2>
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
              <>
                <div className="modal-form-group">
                  <label htmlFor="projectSelect" className="modal-label">
                    Project
                  </label>
                  <select
                    id="projectSelect"
                    className={`modal-input modal-select${
                      errors.project ? " modal-input--error" : ""
                    }`}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    disabled={isLoading || projects.length === 0}
                    autoFocus
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                  {errors.project && (
                    <div className="modal-error-message">{errors.project}</div>
                  )}
                </div>

                <div className="modal-form-group">
                  <label htmlFor="sprintName" className="modal-label">
                    Sprint Name
                  </label>
                  <input
                    id="sprintName"
                    type="text"
                    className={`modal-input${errors.sprintName ? " modal-input--error" : ""}`}
                    placeholder="Enter sprint name"
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.sprintName && (
                    <div className="modal-error-message">{errors.sprintName}</div>
                  )}
                </div>

                {errors.submit && (
                  <div className="modal-error-message modal-error-message--block">
                    {errors.submit}
                  </div>
                )}
              </>
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

export default AddSprintModal;
