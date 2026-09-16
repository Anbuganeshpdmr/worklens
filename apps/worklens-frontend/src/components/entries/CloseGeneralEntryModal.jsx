import { useState } from "react";
import { closeGeneralActivity } from "../../api/entry";

export default function CloseGeneralEntryModal({ onClose, entry }) {
  const [remarks, setRemarks] = useState("");
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = {
        entryId: entry.id,
        remarks,
      };
      console.log("close entry: ", response);
      await closeGeneralActivity(response);

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
                <h5 className="modal-title">Close General Entry</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>

              <div className="modal-body">
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
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
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
