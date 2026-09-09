import { useState, useEffect } from "react";
import { startTestActivity } from "../api/entry";

export default function SprintActivityExecuteList({ sprintActivities }) {
  const [expandedRows, setExpandedRows] = useState([]);
  const [error, setError] = useState(null);

  const rootActivities = sprintActivities.filter(
    (sprintActivity) =>
      !sprintActivity.parentActivityId ||
      !sprintActivities.some(
        (item) => item.activityId === sprintActivity.parentActivityId,
      ),
  );

  const startEntry = async (sprintActivity) => {
    console.log("Clicked Sprint Activity");
    console.log(sprintActivity);
    console.log("Activity: ", sprintActivity.activityId);
    console.log("SA: ", sprintActivity.sprintActivityId);
    try {
      await startTestActivity(sprintActivity.sprintActivityId);
    } catch (error) {
      setError(error.message);
    }
  };

  const viewSprintActivity = (sprintActivity) => {
    console.log("Viewing Sprint Activity");
    console.log(sprintActivity.activityId);
  };

  return (
    <table className="table table-bordered">
      {error && window.alert(error.message)}
      <thead>
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Status</th>
          <th>External Ticket</th>
          <th>Parent Id</th>
          <th>Created By</th>
          <th>Created On</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {rootActivities.map((sprintActivity) => (
          <ActivityRow
            key={sprintActivity.activityId}
            sprintActivity={sprintActivity}
            sprintActivities={sprintActivities}
            level={0}
            handleStartEntry={startEntry}
            viewSprintActivity={viewSprintActivity}
          />
        ))}
      </tbody>
    </table>
  );
}

function ActivityRow({
  sprintActivity,
  sprintActivities,
  level,
  handleStartEntry,
  viewSprintActivity,
}) {
  const [expanded, setExpanded] = useState(false);

  // Find only immediate children
  const children = sprintActivities.filter(
    (item) => item.parentActivityId === sprintActivity.activityId,
  );

  const hasChildren = children.length > 0;

  return (
    <>
      <tr>
        <td>
          {hasChildren && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "-" : "+"}
            </button>
          )}

          {sprintActivity.activityId}
        </td>

        <td>
          <span style={{ paddingLeft: `${level * 20}px` }}>
            {sprintActivity.title}
          </span>
        </td>

        <td>{sprintActivity.currentStatus_displayName}</td>

        <td>{sprintActivity.externalTicketId || "-"}</td>

        <td>{sprintActivity.parentActivityId || "-"}</td>

        <td>{sprintActivity.createdBy}</td>

        <td>{sprintActivity.createdOn}</td>

        <td>
          <button onClick={() => handleStartEntry(sprintActivity)}>
            Start
          </button>
          <button onClick={() => viewSprintActivity(sprintActivity)}>
            View
          </button>
        </td>
      </tr>

      {expanded &&
        children.map((child) => (
          <ActivityRow
            key={child.activityId}
            sprintActivity={child}
            sprintActivities={sprintActivities}
            level={level + 1}
            handleStartEntry={handleStartEntry}
            viewSprintActivity={viewSprintActivity}
          />
        ))}
    </>
  );
}
