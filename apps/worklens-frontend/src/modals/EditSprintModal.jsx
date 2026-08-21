import { useState, useEffect } from "react";
import "../styles/Modal.css";
import { getAllowedSprintStatuses } from "../api/sprints";

function EditSprintModal({ isOpen, sprint, onClose, onSave, isLoading }) {
  const [sprintName, setSprintName] = useState("");
  const [statusId, setStatusId] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sprint || !isOpen) return;

    setSprintName(sprint.sprintName || sprint.name || "");
    setStatusId(sprint.currentStatus?.recordStatusId || "");

    const fetchStatuses = async () => {
      try {
        const data = await getAllowedSprintStatuses();
        setStatuses(data);
      } catch (err) {
        setError(err.message || "Failed to load statuses.");
      }
    };

    fetchStatuses();
  }, [sprint, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!sprintName.trim()) {
      setError("Sprint name is required.");
      return;
    }

    try {
      await onSave({
        sprintId: sprint.id || sprint.sprintId,
        sprintName: sprintName.trim(),
        selectedRecordStatusId: Number(statusId),
      });
    } catch (err) {
      setError(err.message || "Failed to update sprint.");
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
          <h2 className="modal-title">Edit Sprint</h2>

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
              <label className="modal-label">
                Project Name
              </label>

              <input
                type="text"
                className="modal-input"
                value={sprint?.projectName || ""}
                disabled
              />
            </div>

            <div className="modal-form-group">
              <label
                htmlFor="editSprintName"
                className="modal-label"
              >
                Sprint Name
              </label>

              <input
                id="editSprintName"
                type="text"
                className="modal-input"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="modal-form-group">
              <label
                htmlFor="editSprintStatus"
                className="modal-label"
              >
                Status
              </label>

              <select
                id="editSprintStatus"
                className="modal-input"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select Status</option>

                {statuses.map((item) => (
                  <option
                    key={item.recordStatusId}
                    value={item.recordStatusId}
                  >
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

export default EditSprintModal;