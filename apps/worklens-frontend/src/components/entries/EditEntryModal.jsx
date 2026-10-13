import { useState, useEffect } from "react";
import { updateEntryPeriod } from "../../api/entry";
import { flattenEntry } from "./entryMapper";
import { useEntryContext } from "../../context/EntryContext";
import "../../styles/Modal.css";

function formatDateForInput(val) {
  if (!val) return "";
  if (typeof val === "string") {
    let d = val.trim();
    if (d.includes("T")) {
      d = d.split("T")[0];
    }
    return d;
  }
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  return String(val);
}

function formatTimeForInput(val) {
  if (!val) return "";
  if (typeof val === "string") {
    let t = val.trim();
    if (t.includes("T")) {
      t = t.split("T")[1];
    }
    // Remove timezone suffix if any
    t = t.split("Z")[0].split("+")[0];
    // Remove milliseconds / microseconds if any
    t = t.split(".")[0];
    return t;
  }
  return String(val);
}

function formatToLocalDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const cleanDate = dateStr.trim();
  let cleanTime = timeStr.trim();
  if (cleanTime.includes("T")) {
    cleanTime = cleanTime.split("T")[1];
  }
  cleanTime = cleanTime.split(".")[0];
  if (cleanTime.length === 5) {
    cleanTime = `${cleanTime}:00`;
  }
  return `${cleanDate}T${cleanTime}`;
}

export default function EditEntryModal({
  onClose,
  selectedEntry,
  onUpdateEntry,
}) {
  const entryContext = useEntryContext?.();
  const notifyEntryChange = entryContext?.notifyEntryChange;

  const [startDate, setStartDate] = useState(() =>
    formatDateForInput(selectedEntry?.activityDate)
  );
  const [startTime, setStartTime] = useState(() =>
    formatTimeForInput(selectedEntry?.startTime)
  );
  const [endDate, setEndDate] = useState(() =>
    formatDateForInput(
      selectedEntry?.activityEndDate ||
        (selectedEntry?.endTime ? selectedEntry?.activityDate : "")
    )
  );
  const [endTime, setEndTime] = useState(() =>
    formatTimeForInput(selectedEntry?.endTime)
  );
  const [remarks, setRemarks] = useState(
    () => selectedEntry?.remarks ?? ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedEntry) {
      setStartDate(formatDateForInput(selectedEntry.activityDate));
      setStartTime(formatTimeForInput(selectedEntry.startTime));
      setEndDate(
        formatDateForInput(
          selectedEntry.activityEndDate ||
            (selectedEntry.endTime ? selectedEntry.activityDate : "")
        )
      );
      setEndTime(formatTimeForInput(selectedEntry.endTime));
      setRemarks(selectedEntry.remarks ?? "");
      setError(null);
    }
  }, [selectedEntry]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedEntry?.id) {
      setError("Entry ID is missing.");
      return;
    }

    if (!startDate || !startTime) {
      setError("Start date and start time are required.");
      return;
    }

    if ((endDate && !endTime) || (!endDate && endTime)) {
      setError(
        "Both end date and end time must be provided, or leave both empty."
      );
      return;
    }

    const newStartDateTime = formatToLocalDateTime(startDate, startTime);
    const newEndDateTime =
      endDate && endTime ? formatToLocalDateTime(endDate, endTime) : null;

    if (newEndDateTime) {
      const startMs = new Date(newStartDateTime).getTime();
      const endMs = new Date(newEndDateTime).getTime();

      if (isNaN(startMs) || isNaN(endMs)) {
        setError("Please enter valid date and time values.");
        return;
      }

      if (endMs <= startMs) {
        setError("End date-time must be strictly after start date-time.");
        return;
      }
    }

    const request = {
      id: selectedEntry.id,
      remarks: remarks?.trim() ? remarks.trim() : null,
      newStartDateTime,
      newEndDateTime,
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await updateEntryPeriod(request);
      const responseData = response?.data || response;

      let updatedEntry;
      if (responseData && typeof responseData === "object" && responseData.id) {
        if (
          responseData.activityType ||
          responseData.category ||
          responseData.currentStatus
        ) {
          updatedEntry = flattenEntry(responseData);
        } else {
          const flattened = flattenEntry(responseData);
          updatedEntry = {
            ...selectedEntry,
            ...flattened,
            remarks:
              responseData.remarks !== undefined
                ? responseData.remarks
                : request.remarks,
            activityDate: responseData.activityDate || startDate,
            startTime:
              responseData.startTime ||
              (startTime.length === 5 ? `${startTime}:00` : startTime),
            activityEndDate:
              responseData.activityEndDate !== undefined
                ? responseData.activityEndDate
                : endDate || null,
            endTime:
              responseData.endTime !== undefined
                ? responseData.endTime
                : endTime
                  ? endTime.length === 5
                    ? `${endTime}:00`
                    : endTime
                  : null,
          };
        }
      } else {
        updatedEntry = {
          ...selectedEntry,
          remarks: request.remarks,
          activityDate: startDate,
          startTime:
            startTime.length === 5 ? `${startTime}:00` : startTime,
          activityEndDate: endDate || null,
          endTime: endTime
            ? endTime.length === 5
              ? `${endTime}:00`
              : endTime
            : null,
        };
      }

      if (onUpdateEntry) {
        onUpdateEntry(updatedEntry);
      }
      if (notifyEntryChange) {
        notifyEntryChange();
      }
      onClose();
    } catch (err) {
      console.error("API updateEntryPeriod failed:", err);
      setError(err?.message || "Failed to update entry period.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-dialog"
        style={{
          pointerEvents: "auto",
          position: "relative",
          zIndex: 1001,
          maxWidth: "520px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Entry Period</h2>
            {selectedEntry?.id && (
              <span className="text-muted small">
                Entry #{selectedEntry.id}
                {selectedEntry.name ? ` • ${selectedEntry.name}` : ""}
              </span>
            )}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {error && (
              <div className="modal-error-message modal-error-message--block mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2" />
                {error}
              </div>
            )}

            {/* Entry context preview */}
            {selectedEntry && (
              <div className="mb-3 p-2 rounded bg-light border small text-muted">
                <div className="row g-1">
                  <div className="col-6">
                    <span className="fw-medium text-dark">Entry ID:</span> #{selectedEntry.id}
                  </div>
                  {selectedEntry.user && (
                    <div className="col-6">
                      <span className="fw-medium text-dark">User:</span> {selectedEntry.user}
                    </div>
                  )}
                  {selectedEntry.projectName && (
                    <div className="col-6 text-truncate" title={selectedEntry.projectName}>
                      <span className="fw-medium text-dark">Project:</span> {selectedEntry.projectName}
                    </div>
                  )}
                  {selectedEntry.sprintName && (
                    <div className="col-6 text-truncate" title={selectedEntry.sprintName}>
                      <span className="fw-medium text-dark">Sprint:</span> {selectedEntry.sprintName}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Start Date & Time */}
            <div className="modal-form-group">
              <div className="row g-2">
                <div className="col-sm-6 col-12">
                  <label htmlFor="startDate" className="modal-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="modal-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="col-sm-6 col-12">
                  <label htmlFor="startTime" className="modal-label">
                    Start Time <span className="text-danger">*</span>
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    step="1"
                    className="modal-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* End Date & Time */}
            <div className="modal-form-group">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="modal-label mb-0">End Period</span>
                {(endDate || endTime) && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none p-0 text-muted"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => {
                      setEndDate("");
                      setEndTime("");
                    }}
                    disabled={isLoading}
                  >
                    <i className="bi bi-x-circle me-1" />
                    Clear End Period
                  </button>
                )}
              </div>
              <div className="row g-2">
                <div className="col-sm-6 col-12">
                  <label htmlFor="endDate" className="text-muted small mb-1 d-block">
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className="modal-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-sm-6 col-12">
                  <label htmlFor="endTime" className="text-muted small mb-1 d-block">
                    End Time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    step="1"
                    className="modal-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="modal-form-group">
              <label htmlFor="remarks" className="modal-label">
                Remarks <span className="text-muted fw-normal">(Optional)</span>
              </label>
              <textarea
                id="remarks"
                className="modal-input"
                rows={3}
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={isLoading}
                style={{ resize: "vertical" }}
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
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
