import { useState } from "react";
import { closeTestActivity } from "../../api/entry";

export default function CloseTestEntryModal({
  onClose,
  entry,
  sprintActivity,
  statuses,
}) {
  const [sprintActivityStatus, setSprintActivityStatus] = useState(
    sprintActivity?.currentStatus_statusId ?? null,
  );
  const [remarks, setRemarks] = useState("");

  console.log("Sprint Activity", sprintActivity);
  console.log("Statuses", statuses);
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = {
        entryId: entry.id,
        remarks,
        sprintActivityStatusId: sprintActivityStatus,
      };
      console.log("close entry: ", response);
      await closeTestActivity(response);

      // API succeeded
      onClose();
    } catch (error) {
      // Don't close this modal
      // Global error handling will show the error
      console.log("API failed", error);
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
                <p>Hello from the modal -- {entry.id}.</p>
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
                    {statuses.map((status) => (
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
