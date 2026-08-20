import { useState } from "react";
import "../../styles/sprint-activities/AddActivityModal.css";

const INITIAL_FORM = {
  title: "",
  type: "Parent",
  parentId: "",
  description: "",
  status: "Not Executed",
};

/**
 * AddActivityModal
 * Dialog to add a new parent activity or child scenario to the sprint.
 */
function AddActivityModal({
  isOpen,
  onClose,
  onAdd,
  parentActivities = [],
  initialParentId = null,
}) {
  if (!isOpen) return null;

  return (
    <AddActivityModalContent
      key={initialParentId ? `scenario-${initialParentId}` : "new-activity"}
      onClose={onClose}
      onAdd={onAdd}
      parentActivities={parentActivities}
      initialParentId={initialParentId}
    />
  );
}

function AddActivityModalContent({
  onClose,
  onAdd,
  parentActivities = [],
  initialParentId = null,
}) {
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    type: initialParentId ? "Scenario" : "Parent",
    parentId: initialParentId ? String(initialParentId) : "",
  }));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (form.type === "Scenario" && !form.parentId) {
      setError("Please select a parent activity for this scenario.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const newActivity = {
        sprintActivityId: `temp_${Date.now()}`,
        simpleActivityInfo: {
          activityId: `ACT-${Math.floor(1000 + Math.random() * 9000)}`,
          title: form.title.trim(),
          description: form.description.trim(),
          activityType: { name: form.type },
          parentActivityId: form.type === "Scenario" ? form.parentId : null,
          createdBy: "Current User",
          createdOn: new Date().toISOString(),
          updatedBy: "Current User",
          updatedOn: new Date().toISOString(),
        },
        currentStatus: {
          statusName: form.status,
        },
      };

      onAdd?.(newActivity);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create activity.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sa-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sa-modal__header">
          <div className="sa-modal__header-info">
            <h3 className="sa-modal__title">
              {initialParentId || form.type === "Scenario"
                ? "Add Scenario"
                : "Add New Activity"}
            </h3>
            <p className="sa-modal__subtitle">
              Configure activity details for this sprint.
            </p>
          </div>
          <button
            className="sa-modal__close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Form Body */}
        <form className="sa-modal__form" onSubmit={handleSubmit}>
          {error && <div className="sa-modal__error">{error}</div>}

          {/* Activity Type */}
          <div className="sa-modal__field">
            <label className="sa-modal__label">
              Activity Type <span className="sa-modal__req">*</span>
            </label>
            <div className="sa-modal__type-toggle">
              <button
                type="button"
                className={`sa-modal__type-btn${form.type === "Parent" ? " sa-modal__type-btn--active" : ""}`}
                onClick={() => handleChange("type", "Parent")}
              >
                <i className="bi bi-layout-text-sidebar-reverse" />
                <span>Parent Activity</span>
              </button>
              <button
                type="button"
                className={`sa-modal__type-btn${form.type === "Scenario" ? " sa-modal__type-btn--active" : ""}`}
                onClick={() => handleChange("type", "Scenario")}
              >
                <i className="bi bi-file-earmark-text" />
                <span>Child Scenario</span>
              </button>
            </div>
          </div>

          {/* Parent Selection if Scenario */}
          {form.type === "Scenario" && (
            <div className="sa-modal__field">
              <label className="sa-modal__label">
                Parent Activity <span className="sa-modal__req">*</span>
              </label>
              <select
                className="sa-modal__select"
                value={form.parentId}
                onChange={(e) => handleChange("parentId", e.target.value)}
                required
              >
                <option value="">Select Parent Activity...</option>
                {parentActivities.map((parent) => {
                  const pId = parent.sprintActivityId || parent.activityId;
                  const pTitle =
                    parent.simpleActivityInfo?.title || parent.title || pId;
                  return (
                    <option key={pId} value={pId}>
                      {pTitle} ({pId})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="sa-modal__field">
            <label className="sa-modal__label">
              Title <span className="sa-modal__req">*</span>
            </label>
            <input
              type="text"
              className="sa-modal__input"
              placeholder="e.g. Verify user authentication flow"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Initial Status */}
          <div className="sa-modal__field">
            <label className="sa-modal__label">Initial Status</label>
            <select
              className="sa-modal__select"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Not Executed">Not Executed</option>
              <option value="Executed (Passed)">Executed (Passed)</option>
              <option value="Executed (Failed)">Executed (Failed)</option>
              <option value="Executed Atleast Once">Executed Atleast Once</option>
              <option value="Need to Execute Again">Need to Execute Again</option>
            </select>
          </div>

          {/* Description */}
          <div className="sa-modal__field">
            <label className="sa-modal__label">Description</label>
            <textarea
              className="sa-modal__textarea"
              rows={4}
              placeholder="Provide context, acceptance criteria, or test prerequisites..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="sa-modal__footer">
            <button
              type="button"
              className="sa-modal__btn sa-modal__btn--cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sa-modal__btn sa-modal__btn--submit"
              disabled={submitting}
            >
              {submitting ? "Adding…" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddActivityModal;
