import { useState, useEffect } from "react";
import "../styles/Modal.css";
import { getAllowedProjectStatuses } from "../api/projects";

function EditProjectModal({
  isOpen,
  project,
  onClose,
  onSave,
  isLoading,
}) {
  const [projectName, setProjectName] = useState("");
  const [statusId, setStatusId] = useState("");
  const [error, setError] = useState("");
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
  if (!project || !isOpen) return;

  setProjectName(project.projectName || project.name || "");
  setStatusId(project.currentStatus?.recordStatusId || "");
  console.log("CURRENT STATUS:", project.currentStatus);

  const fetchStatuses = async () => {
    try {
      const data = await getAllowedProjectStatuses();
      setStatuses(data);
    } catch (err) {
      setError(err.message || "Failed to load statuses.");
    }
  };

  fetchStatuses();
}, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      await onSave({
        projectId: project.projectId,
        projectName: projectName.trim(),
        selectedRecordStatusId: Number(statusId),
      });
    } catch (err) {
      setError(err.message || "Failed to update project.");
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
          <h2 className="modal-title">Edit Project</h2>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="modal-error-message">
                {error}
              </div>
            )}

            <div className="modal-form-group">
              <label
                htmlFor="editProjectName"
                className="modal-label"
              >
                Project Name
              </label>

              <input
                id="editProjectName"
                type="text"
                className="modal-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="modal-form-group">
              <label
                htmlFor="editProjectStatus"
                className="modal-label"
              >
                Status
              </label>

              <select
                id="editProjectStatus"
                className="modal-input"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                disabled={isLoading}
            >
                <option value="">Select Status</option>

                {statuses.map((item) => (
                    <option key={item.recordStatusId} value={item.recordStatusId}>
                        {item.statusName}
                    </option>
                ))}
            </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn--secondary"
              onClick={onClose}
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
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;