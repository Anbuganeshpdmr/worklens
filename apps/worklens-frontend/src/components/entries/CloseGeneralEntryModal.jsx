import { useState } from "react";
import { closeGeneralActivity } from "../../api/entry";
import { useEntryContext } from "../../context/EntryContext";
import { flattenEntry } from "../entries/entryMapper";

export default function CloseGeneralEntryModal({
  onClose,
  entry,
  onUpdateEntry,
}) {
  const [remarks, setRemarks] = useState("");
  const { notifyEntryChange } = useEntryContext();

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const request = {
        entryId: entry.id,
        remarks,
      };
      console.log("close entry: ", request);
      const entryResponse = await closeGeneralActivity(request);
      const updatedEntry = flattenEntry(entryResponse.data || entryResponse);
      onUpdateEntry(updatedEntry);
      console.log("updated Entry: ", updatedEntry);

      // API succeeded
      notifyEntryChange(); // Notify that an entry has changed
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
