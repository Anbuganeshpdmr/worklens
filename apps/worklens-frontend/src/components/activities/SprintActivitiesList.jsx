import { useState, useEffect } from "react";
import { getAllProjectActivities } from "../../api/activities";
import {
  getSelectedSprintActivityIds,
  getSelectedSprintActivities,
} from "../../api/sprintActivities";
import { updateSprintActivitiesList } from "../../api/sprintActivities";

export default function SprintActivityList({ sprint }) {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedActivityIds, setSelectedActivityIds] = useState(new Set());

  // Fetch All activities based on projectId
  useEffect(() => {
    if (!sprint?.projectId) return;
    const fetchActivities = async () => {
      try {
        const response = await getAllProjectActivities(sprint.projectId);
        setActivities(response);
      } catch (error) {
        console.error("Error fetching sprint activities:", error);
      }
    };
    fetchActivities();
  }, [sprint?.projectId]);

  // Fetch selected activities for the sprint
  useEffect(() => {
    if (sprint?.sprintId) {
      const fetchSelectedActivities = async () => {
        try {
          const filteredActivityIds = await getSelectedSprintActivityIds(
            sprint.sprintId,
          );
          console.log("Filtered Activity IDs:", filteredActivityIds);
          setSelectedActivityIds(new Set(filteredActivityIds));
        } catch (error) {
          console.error("Error fetching filtered sprint activities:", error);
        }
      };
      fetchSelectedActivities();
    }
  }, [sprint?.sprintId]);

  //  Handle checkbox change
  const handleCheckboxChange = (activityId) => {
    setSelectedActivityIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(activityId)) {
        newSelected.delete(activityId);
      } else {
        newSelected.add(activityId);
      }
      return newSelected;
    });
  };

  //  Handle Save button click
  const handleSave = async () => {
    try {
      setError("");
      const activityIds = Array.from(selectedActivityIds);

      //  API call to save the selected activities for the sprint
      await updateSprintActivitiesList(sprint.sprintId, activityIds);

      //Refetch the selected activities to ensure the UI reflects the latest state
      const updatedSelectedIds = await getSelectedSprintActivityIds(
        sprint.sprintId,
      );

      setSelectedActivityIds(new Set(updatedSelectedIds));
    } catch (error) {
      console.error("Error saving sprint activities:", error);
      setError("Failed to save sprint activities.");
    }
  };

  const rootActivities = activities.filter(
    (activity) => !activity.parentActivityId,
  );

  return (
    <>
      {error && <div className="alert alert-danger">{error} </div>}
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={handleSave}
      >
        Save
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Select</th> <th>Id</th> <th>Title</th> <th>Status</th>
            <th>External Ticket</th> <th>Parent Id</th> <th>Created By</th>
            <th>Created On</th>
          </tr>
        </thead>
        <tbody>
          {rootActivities.map((activity) => (
            <ActivityRow
              key={activity.activityId}
              activity={activity}
              activities={activities}
              level={0}
              selectedActivityIds={selectedActivityIds}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}

function ActivityRow({
  activity,
  activities,
  level,
  selectedActivityIds,
  onCheckboxChange,
}) {
  const [expanded, setExpanded] = useState(false);

  // Find immediate children
  const children = activities.filter(
    (item) => item.parentActivityId === activity.activityId,
  );

  const hasChildren = children.length > 0;
  // This is now a BOOLEAN.
  const isChecked = selectedActivityIds.has(activity.activityId);
  return (
    <>
      <tr>
        <td>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => onCheckboxChange(activity.activityId)}
          />
        </td>
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
          {activity.activityId}
        </td>
        <td>
          <span style={{ paddingLeft: `${level * 20}px` }}>
            {activity.title}
          </span>
        </td>
        <td> {activity.currentStatus?.displayName} </td>
        <td> {activity.externalTicketId || "-"} </td>
        <td> {activity.parentActivityId || "-"} </td>
        <td> {activity.createdBy} </td>
        <td> {activity.createdOn} </td>
      </tr>
      {expanded &&
        children.map((child) => (
          <ActivityRow
            key={child.activityId}
            activity={child}
            activities={activities}
            level={level + 1}
            selectedActivityIds={selectedActivityIds}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
    </>
  );
}
