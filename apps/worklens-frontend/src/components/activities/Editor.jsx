import { useState, useEffect } from "react";
import { getStatusByRecord } from "../../api/status";
import { getTestCategoryTypes } from "../../api/types";
import { createTestActivity, updateTestActivity } from "../../api/activities";

export default function Editor({
  activity,
  existingParentActivityId,
  onClose,
  projectId,
  onDirtyChange,
  onSaveSuccess,
}) {
  const isEditMode = activity !== null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentActivityId, setParentActivityId] = useState(null);
  const [externalTicketId, setExternalTicketId] = useState(null);
  //const [currentStatus, setCurrentStatus] = useState(null);
  const [type, setType] = useState(null);
  const [error, setError] = useState(null);
  //const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (activity) {
      // EDIT
      setTitle(activity.title ?? "");
      setDescription(activity.description ?? "");
      setParentActivityId(activity.parentActivityId ?? null);
      setExternalTicketId(activity.externalTicketId ?? null);
      //setCurrentStatus(activity.currentStatus?.statusId ?? null);
      setType(activity.activityType?.id ?? null);
    } else {
      // NEW or ADD CHILD
      setTitle("");
      setDescription("");
      setParentActivityId(existingParentActivityId ?? null);
      setExternalTicketId(null);
      //setCurrentStatus(null);
      setType(null);
    }

    // Newly loaded form has no unsaved changes
    onDirtyChange?.(false);
  }, [activity, existingParentActivityId, onDirtyChange]);

  const markDirty = () => {
    onDirtyChange?.(true);
  };

  /* Resets the fields to their initial values */
  const resetForm = () => {
    if (activity) {
      // EDIT - restore original activity values
      setTitle(activity.title ?? "");
      setDescription(activity.description ?? "");
      setParentActivityId(activity.parentActivityId ?? null);
      setExternalTicketId(activity.externalTicketId ?? null);
      //setCurrentStatus(activity.currentStatus?.statusId ?? null);
      setType(activity.activityType?.id ?? null);
    } else {
      // NEW / ADD CHILD
      setTitle("");
      setDescription("");
      setParentActivityId(existingParentActivityId ?? null);
      setExternalTicketId(null);
      //setCurrentStatus(null);
      setType(null);
    }

    onDirtyChange?.(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Edit
      const editedActivity = {
        activityId: activity.activityId,
        version: activity.version,

        title,
        description,
        parentActivityId,
        externalTicketId,
        //currentStatus,
        typeId: type,
      };
      console.log("Editing activity:", editedActivity);
      try {
        await updateTestActivity(editedActivity);
        console.log("Updated activity for:", activity.activityId);
        await onSaveSuccess();
      } catch (error) {
        setError(error.message);
      }
    } else {
      // New
      const newActivityData = {
        projectId,
        title,
        description,
        parentActivityId,
        externalTicketId,
        //currentStatus,
        typeId: type,
      };
      console.log("Creating activity:", newActivityData);
      try {
        await createTestActivity(newActivityData);
        console.log("Saved new activity");
        await onSaveSuccess();
      } catch (error) {
        setError(error.message);
      }
    }
    onDirtyChange?.(false);
  };

  const getActivityStatuses = async () => {
    try {
      const response = await getStatusByRecord("activity");
      console.log("Fetched activity statuses:", response);
      return response;
    } catch (error) {
      console.error("Failed to fetch activity statuses", error);
      return { data: [] };
    }
  };

  const getActivityTypes = async () => {
    try {
      const response = await getTestCategoryTypes();
      console.log("Fetched activity types:", response);
      return response;
    } catch (error) {
      console.error("Failed to fetch activity types", error);
      return { data: [] };
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusResponse, typeResponse] = await Promise.all([
          getActivityStatuses(),
          getActivityTypes(),
        ]);

        //setStatuses(statusResponse);
        setTypes(typeResponse);
      } catch (error) {
        setError(error.message);
        console.error("Failed to load editor options", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div>
      {error && window.alert(error.message)}
      <div className="editor-header">
        <h3>{isEditMode ? "Edit Activity" : "New Activity"}</h3>
      </div>
      <div className="editor-body">
        <form onSubmit={handleSave}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                markDirty();
              }}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              rows="4"
              className="form-control"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                markDirty();
              }}
            />
          </div>

          {/* Parent Activity ID */}
          <div className="mb-3">
            <label className="form-label">Parent Activity ID</label>

            <input
              type="number"
              min="0"
              className="form-control"
              value={parentActivityId ?? ""}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => {
                setParentActivityId(
                  e.target.value === "" ? null : Number(e.target.value),
                );
                markDirty();
              }}
            />
          </div>

          {/* External Ticket ID */}
          <div className="mb-3">
            <label className="form-label">External Ticket ID</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={externalTicketId ?? ""}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => {
                setExternalTicketId(
                  e.target.value === "" ? null : Number(e.target.value),
                );
                markDirty();
              }}
            />
          </div>

          {/* Current Status */}
          {/* <div className="mb-3">
            <label className="form-label">Current Status</label>
            <select
              className="form-control"
              value={currentStatus ?? ""}
              onChange={(e) => {
                setCurrentStatus(
                  e.target.value === "" ? null : Number(e.target.value),
                );
                markDirty();
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
          </div> */}

          {/* Type */}
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              className="form-control"
              value={type ?? ""}
              onChange={(e) => {
                setType(e.target.value === "" ? null : Number(e.target.value));
                markDirty();
              }}
              required
            >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="editor-footer">
            <button
              type="submit"
              className="btn btn-primary"
              //onClick={() => handleSave()}
            >
              Save
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => resetForm()}
            >
              Reset
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
