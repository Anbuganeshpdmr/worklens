import { useState, useEffect } from "react";
import ModalSelect from "../components/ModalSelect";
import "../styles/Modal.css";
import {
  getAllowedSprintStatuses,
  getIndividualSprintDetails,
} from "../api/sprints";

function EditSprintModal({ isOpen, sprint, onClose, onSave, isLoading }) {
  const [sprintName, setSprintName] = useState("");
  const [statusId, setStatusId] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    if (!sprint || !isOpen) {
      setStatusId("");
      return () => {
        isCurrent = false;
      };
    }

    setSprintName(sprint.sprintName || sprint.name || "");
    setStatusId("");
    setStatuses([]);
    setError("");

    const fetchEditData = async () => {
      const sprintId = sprint.id || sprint.sprintId;

      try {
        const details = await getIndividualSprintDetails(sprintId);
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
          setError(err.message || "Failed to load sprint status.");
        }
      }

      try {
        const data = await getAllowedSprintStatuses();

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
  }, [sprint, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!sprintName.trim()) {
      setError("Sprint name is required.");
      return;
    }

    if (!statusId) {
      setError("Please select a status.");
      return;
    }

    try {
      await onSave({
        sprintId: sprint.id || sprint.sprintId,
        sprintName: sprintName.trim(),
        selectedStatusId: Number(statusId),
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

              <ModalSelect
                id="editSprintStatus"
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

export default EditSprintModal;