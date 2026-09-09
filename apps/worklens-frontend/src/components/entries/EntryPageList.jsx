import CloseTestEntryModal from "./CloseTestEntryModal";
import { useState, useEffect } from "react";
import { getSprintActivity } from "../../api/sprintActivities";
import { getStatusByRecord } from "../../api/status";
import { flattenSprintActivity } from "../../components/sprint-activities/sprintActivityMapper";

export default function EntryPageList({ entries }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [sprintActivity, setSprintActivity] = useState(null);

  const handleEntryClose = (entry) => {
    setShowModal(true);
  };

  const getSprintActivityStatuses = async () => {
    try {
      const response = await getStatusByRecord("sprint_activity");
      console.log("Fetched sprint-activity statuses:", response);
      return response;
    } catch (error) {
      console.error("Failed to fetch statuses", error);
      return { data: [] };
    }
  };

  const fetchSprintActivity = async (entry) => {
    try {
      //entry.sprintActivityId
      const response = await getSprintActivity(entry.sprintActivityId);
      console.log("Fetched sprint-activity:", response);
      return flattenSprintActivity(response);
    } catch (error) {
      console.error("Failed to fetch statuses", error);
    }
  };

  useEffect(() => {
    console.log("In combined call method...", selectedEntry);
    if (!selectedEntry) {
      console.log("No selected entry. Returning.");
      return;
    }
    const fetchOptions = async () => {
      try {
        const [statusResponse, SA_Response] = await Promise.all([
          getSprintActivityStatuses(),
          fetchSprintActivity(selectedEntry),
        ]);

        setStatuses(statusResponse);
        setSprintActivity(SA_Response);
      } catch (error) {
        setError(error.message);
        console.error("Failed to load editor options", error);
      }
    };

    fetchOptions();
  }, [selectedEntry]);

  return (
    <>
      {showModal && selectedEntry && (
        <CloseTestEntryModal
          onClose={() => setShowModal(false)}
          entry={selectedEntry}
          sprintActivity={sprintActivity}
          statuses={statuses}
        />
      )}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Status</th>
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
              <td>{entry.user}</td>
              <td>{entry.activityDate}</td>
              <td>
                {entry.statusDisplayName.includes("in-process") && (
                  <button
                    onClick={() => {
                      setSelectedEntry(entry);
                      handleEntryClose(entry);
                    }}
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
