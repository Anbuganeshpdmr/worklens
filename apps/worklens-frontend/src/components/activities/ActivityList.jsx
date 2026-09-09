import { useState, useEffect } from "react";
import { getAllProjectActivities } from "../../api/activities";
import Editor from "./Editor";

function ActivitiesList({ projectId }) {
  // Root activities = activities without a parent

  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [parentActivityId, setParentActivityId] = useState(null);

  const [editorDirty, setEditorDirty] = useState(false);

  const fetchActivities = async () => {
    try {
      const response = await getAllProjectActivities(projectId);
      setActivities(response);
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [projectId]);

  const rootActivities = activities.filter(
    (activity) => !activity.parentActivityId,
  );

  const handleNewRoot = () => {
    console.log("Creating new root activity");
    if (isEditorOpen && editorDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Do you want to discard them?",
      );

      if (!confirmed) {
        return;
      }
    }

    setEditingActivity(null);
    setIsEditorOpen(true);
    setParentActivityId(null);
  };

  const handleEdit = (activity) => {
    console.log("Editing activity:", activity.title);
    if (isEditorOpen && editorDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Do you want to discard them?",
      );

      if (!confirmed) {
        return;
      }
    }
    setEditingActivity(activity);
    setIsEditorOpen(true);
    setParentActivityId(null);
  };

  const handleAddChild = (activity) => {
    console.log("Adding child activity to:", activity.title);
    if (isEditorOpen && editorDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Do you want to discard them?",
      );

      if (!confirmed) {
        return;
      }
    }
    setEditingActivity(null);
    setParentActivityId(activity.activityId);
    setIsEditorOpen(true);
  };

  const handleSaveSuccess = async () => {
    try {
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      await fetchActivities();
      setIsEditorOpen(false);
      setEditingActivity(null);
      setParentActivityId(null);
    } catch (error) {
      console.error("Failed to refresh activities:", error);
    }
  };

  return (
    <>
      <button onClick={() => handleNewRoot()}>+ New</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Status</th>
            <th>External Ticket</th>
            <th>Parent Id</th>
            <th>Created By</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rootActivities.map((activity) => (
            <ActivityRow
              key={activity.activityId}
              activity={activity}
              activities={activities}
              level={0}
              handleEdit={handleEdit}
              handleAddChild={handleAddChild}
            />
          ))}
        </tbody>
      </table>
      {isEditorOpen && (
        <div className="activity-editor-section">
          <Editor
            activity={editingActivity}
            existingParentActivityId={parentActivityId}
            onClose={() => setIsEditorOpen(false)}
            projectId={projectId}
            onDirtyChange={setEditorDirty}
            onSaveSuccess={handleSaveSuccess}
          />
        </div>
      )}
    </>
  );
}

function ActivityRow({
  activity,
  activities,
  level,
  handleEdit,
  handleAddChild,
}) {
  const [expanded, setExpanded] = useState(false);

  // Find only immediate children
  const children = activities.filter(
    (item) => item.parentActivityId === activity.activityId,
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

          {activity.activityId}
        </td>

        <td>
          <span style={{ paddingLeft: `${level * 20}px` }}>
            {activity.title}
          </span>
        </td>

        <td>{activity.currentStatus?.displayName}</td>

        <td>{activity.externalTicketId || "-"}</td>

        <td>{activity.parentActivityId || "-"}</td>

        <td>{activity.createdBy}</td>

        <td>{activity.createdOn}</td>

        <td>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleEdit(activity)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => handleAddChild(activity)}
          >
            Add
          </button>
        </td>
      </tr>

      {expanded &&
        children.map((child) => (
          <ActivityRow
            key={child.activityId}
            activity={child}
            activities={activities}
            level={level + 1}
            handleEdit={handleEdit}
            handleAddChild={handleAddChild}
          />
        ))}
    </>
  );
}

export default ActivitiesList;
