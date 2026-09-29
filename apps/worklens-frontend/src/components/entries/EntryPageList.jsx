import CloseTestEntryModal from "./CloseTestEntryModal";
import CloseGeneralEntryModal from "./CloseGeneralEntryModal";
import { useState } from "react";

export default function EntryPageList({ entries }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  console.log("Entries:",entries);

  const handleEntryClose = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  return (
    <>
      {showModal &&
        selectedEntry &&
        (selectedEntry.sprintActivityId !== null ? (
          <CloseTestEntryModal
            onClose={() => setShowModal(false)}
            sprintActivityId={selectedEntry.sprintActivityId}
            sprintActivity={null}
          />
        ) : (
          <CloseGeneralEntryModal
            onClose={() => setShowModal(false)}
            entry={selectedEntry}
          />
        ))}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Status</th>
            <th>Category</th>
            <th>Created By</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.name}</td>
              <td>{entry.statusDisplayName}</td>
              <td>{entry.categoryName}</td>
              <td>{entry.user}</td>
              <td>{entry.activityDate}</td>
              <td>
                {entry.statusDisplayName.includes("in-process") && (
                  <button
                    onClick={() => handleEntryClose(entry)}
                  >
                    Close
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
