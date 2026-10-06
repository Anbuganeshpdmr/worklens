import { useEffect, useState } from "react";
import {
  stopSprintActivity,
  getSprintActivity,
} from "../../api/sprintActivities";
import { getStatusByRecord } from "../../api/status";
import { flattenSprintActivity } from "../sprint-activities/SprintActivityMapper";
import { flattenEntry } from "../entries/entryMapper";
import { getEntry } from "../../api/entry";
import { useEntryContext } from "../../context/EntryContext";

export default function CloseTestEntryModal({
  onClose,
  sprintActivityId,
  sprintActivity: sprintActivityProp,
  onUpdateSprintActivity,
  onUpdateEntry,
  caller = "SA_PAGE",
  selectedEntry,
}) {
  const [sprintActivity, setSprintActivity] = useState(
    sprintActivityProp ?? null,
  );
  const [sprintActivityStatus, setSprintActivityStatus] = useState(
    sprintActivityProp?.currentStatus_statusId ?? null,
  );
  const [remarks, setRemarks] = useState("");
  const [statuses, setStatuses] = useState(null);
  const [error, setError] = useState(null);

  const { notifyEntryChange } = useEntryContext();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await getStatusByRecord("sprint_activity");
        console.log("Fetched sprint-activity statuses:", response);
        setStatuses(response);
      } catch (error) {
        console.error("Failed to fetch statuses", error);
      }
    };
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (sprintActivityProp !== null && sprintActivityProp !== undefined) return;
    const fetchSprintActivity = async () => {
      try {
        const response = await getSprintActivity(sprintActivityId);
        const flattened = flattenSprintActivity(response.data || response);
        setSprintActivity(flattened);
        setSprintActivityStatus(flattened?.currentStatus_statusId ?? null);
      } catch (error) {
        console.error("Failed to fetch sprint activity", error);
      }
    };
    fetchSprintActivity();
  }, []);

  console.log("Sprint Activity", sprintActivity);
  console.log("Statuses", statuses);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const request = {
        sprintActivityId,
        remarks,
        sprintActivityStatusId: sprintActivityStatus,
      };
      console.log("close Record: ", request);
      const response = await stopSprintActivity(request);

      if (caller === "ENTRY_PAGE") {
        // API succeeded
        // Get Entry details and update the entry in the list
        const entryResponse = await getEntry(selectedEntry.id);
        const updatedEntry = flattenEntry(entryResponse.data || entryResponse);
        onUpdateEntry(updatedEntry);
        console.log("updated Entry: ", updatedEntry);
      } else {
        // API succeeded
        console.log("updated SA: ", response);
        const updated_SA = flattenSprintActivity(response.data || response);
        onUpdateSprintActivity(updated_SA);
      }
      // API succeeded
      notifyEntryChange(); // Notify that an entry has changed
      setError(null);
      onClose();
    } catch (error) {
      // Don't close this modal
      // Global error handling will show the error
      console.error("API failed", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSave}>
              <div className="modal-header">
                <h5 className="modal-title">Close Test Entry</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>

              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <p>Hello from the modal</p>
                {/* Remarks */}
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    value={remarks}
                    placeholder="Remarks..."
                    onChange={(e) => {
                      setRemarks(e.target.value);
                    }}
                  />
                </div>

                {/* Status select */}
                <div className="mb-3">
                  <label className="form-label">Parent Status</label>
                  <select
                    className="form-control"
                    value={sprintActivityStatus ?? ""}
                    onChange={(e) => {
                      setSprintActivityStatus(
                        e.target.value === "" ? null : Number(e.target.value),
                      );
                    }}
                    required
                  >
                    <option value="">Select Status</option>
                    {(statuses ?? []).map((status) => (
                      <option key={status.statusId} value={status.statusId}>
                        {status.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  // onClick={() => {
                  //   console.log("Entry Save - clicked", entry.id);
                  // }}
                >
                  Save
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
