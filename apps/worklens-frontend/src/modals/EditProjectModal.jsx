import { useState, useEffect } from "react";
import ModalSelect from "../components/ModalSelect";
import "../styles/Modal.css";
import {
  getAllowedProjectStatuses,
  getIndividualProjectDetails,
} from "../api/projects";

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
    let isCurrent = true;

    if (!project || !isOpen) {
      setStatusId("");
      return () => {
        isCurrent = false;
      };
    }

    setProjectName(project.projectName || project.name || "");
    setStatusId("");
    setStatuses([]);
    setError("");

    const fetchEditData = async () => {
      const projectId = project.projectId || project.id;

      try {
        const details = await getIndividualProjectDetails(projectId);
        const currentStatus = details?.currentStatus;
        const currentStatusId =
          currentStatus?.statusId ??
          currentStatus?.StatusId ??
          details?.statusId ??
          details?.StatusId ??
          "";

        if (isCurrent) {
          setStatusId(currentStatusId ? String(currentStatusId) : "");
        }
      } catch (err) {
        if (isCurrent) {
          setStatusId("");
          setError(err.message || "Failed to load project status.");
        }
      }

      try {
        const data = await getAllowedProjectStatuses();

        if (isCurrent) {
          setStatuses(data);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message || "Failed to load statuses.");
        }
      }
    };

    fetchEditData();

    return () => {
      isCurrent = false;
    };
  }, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!statusId) {
      setError("Please select a status.");
      return;
    }

    try {
      await onSave({
        projectId: project.projectId,
        projectName: projectName.trim(),
        selectedStatusId: Number(statusId),
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

              <ModalSelect
                id="editProjectStatus"
                value={statusId}
                onChange={setStatusId}
                options={statuses.map((item) => ({
                  value: String(item.StatusId ?? item.statusId),
                  label: item.displayName ?? item.statusName,
                }))}
                placeholder="Select Status"
                ariaLabel="Status"
                disabled={isLoading}
              />
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