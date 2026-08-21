import { useState, useEffect } from "react";
import ActivityStatusBadge from "./ActivityStatusBadge";
import { updateSprintActivity } from "../../api/activities";
import "../../styles/sprint-activities/EditorPanel.css";

const EMPTY_FORM = { title: "", description: "" };

/**
 * EditorPanel
 * Side-drawer inspector and editor for the selected sprint activity.
 */
function EditorPanel({ activity, onClose, onUpdated }) {
  const [activeTab, setActiveTab] = useState("edit"); // "details" | "edit"
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const actId = activity?._actId ?? activity?.sprintActivityId;

  function handleCopyId() {
    if (!actId) return;
    navigator.clipboard?.writeText(actId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <aside className="sa-editor" aria-label="Sprint Activity Inspector">
      {/* Header */}
      <div className="sa-editor__header">
        <div className="sa-editor__header-title-wrap">
          <span className="sa-editor__title">
            {activity ? "Activity Inspector" : "Inspector"}
          </span>
          {actId && (
            <span
              className="sa-editor__id-tag"
              onClick={handleCopyId}
              title="Click to copy ID"
            >
              {actId} <i className={copied ? "bi bi-check" : "bi bi-copy"} />
            </span>
          )}
        </div>
        <button
          className="sa-editor__close"
          onClick={onClose}
          aria-label="Close inspector"
          title="Close (Esc)"
        >
          <i className="bi bi-x-lg" />
        </button>
      </div>

      {activity ? (
        <>
          {/* Subheader / Tabs */}
          <div className="sa-editor__tabs">
            <button
              type="button"
              className={`sa-editor__tab${activeTab === "edit" ? " sa-editor__tab--active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              <i className="bi bi-pencil-square" /> Edit
            </button>
            <button
              type="button"
              className={`sa-editor__tab${activeTab === "details" ? " sa-editor__tab--active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              <i className="bi bi-info-circle" /> Details
            </button>
          </div>

          {/* Body Content */}
          <div className="sa-editor__scroll-body">
            {activeTab === "details" ? (
              <DetailsView activity={activity} />
            ) : (
              <EditForm
                key={activity._id ?? activity.sprintActivityId}
                activity={activity}
                onClose={onClose}
                onUpdated={onUpdated}
              />
            )}
          </div>
        </>
      ) : (
        <div className="sa-editor__empty">
          <div className="sa-editor__empty-icon">
            <i className="bi bi-layout-sidebar-inset-reverse" />
          </div>
          <h4 className="sa-editor__empty-title">No Activity Selected</h4>
          <p className="sa-editor__empty-text">
            Select any activity row in the table to view its complete properties and edit its details.
          </p>
        </div>
      )}
    </aside>
  );
}

/**
 * DetailsView
 * Read-only inspector view with metadata grid and rich details.
 */
function DetailsView({ activity }) {
  const statusName =
    activity.currentStatus?.statusName ??
    activity.simpleActivityInfo?.currentStatus?.statusName ??
    "";

  return (
    <div className="sa-editor__details">
      <div className="sa-editor__status-box">
        <span className="sa-editor__status-label">Current Status</span>
        <ActivityStatusBadge
          status={statusName}
          colour={
            activity.currentStatus?.colourCode ??
            activity.simpleActivityInfo?.currentStatus?.colourCode
          }
        />
      </div>

      <div className="sa-editor__section">
        <h5 className="sa-editor__section-title">Overview</h5>
        <div className="sa-editor__meta-grid">
          <MetaRow label="Title" value={activity._title ?? activity.title} />
          <MetaRow label="Type" value={activity._typeName} />
          <MetaRow
            label="Parent Activity"
            value={activity._parentId || "None (Root)"}
          />
        </div>
      </div>

      <div className="sa-editor__section">
        <h5 className="sa-editor__section-title">Description</h5>
        <p className="sa-editor__desc-text">
          {activity._description || activity.description || "No description provided."}
        </p>
      </div>

      <div className="sa-editor__section">
        <h5 className="sa-editor__section-title">Audit Trail</h5>
        <div className="sa-editor__meta-grid">
          <MetaRow label="Created By" value={activity._createdBy} />
          <MetaRow label="Created On" value={activity._createdOn} />
          <MetaRow label="Last Updated By" value={activity._updatedBy} />
          <MetaRow label="Last Updated On" value={activity._updatedOn} />
        </div>
      </div>
    </div>
  );
}

/**
 * EditForm
 * Form controls isolated in subcomponent to ensure clean state initialization.
 */
function EditForm({ activity, onClose, onUpdated }) {
  const [form, setForm] = useState(() => ({
    title: activity._title ?? activity.title ?? EMPTY_FORM.title,
    description:
      activity._description ?? activity.description ?? EMPTY_FORM.description,
  }));
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [dirty, setDirty] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  function handleReset() {
    setForm({
      title: activity._title ?? activity.title ?? "",
      description: activity._description ?? activity.description ?? "",
    });
    setDirty(false);
    setSaveErr("");
  }

  async function handleUpdate() {
    if (!dirty) return;
    const id = activity._id ?? activity.sprintActivityId;
    setSaving(true);
    setSaveErr("");
    try {
      const updated = await updateSprintActivity(id, form);
      onUpdated?.(updated ?? { ...activity, ...form });
      setDirty(false);
    } catch (err) {
      setSaveErr(err.message || "Failed to update activity.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="sa-editor__form-wrap">
      {/* Read-only brief meta */}
      <div className="sa-editor__meta-brief">
        <div className="sa-editor__meta-item">
          <span className="sa-editor__meta-label">Type</span>
          <span className="sa-editor__meta-val">{activity._typeName || "—"}</span>
        </div>
        <div className="sa-editor__meta-item">
          <span className="sa-editor__meta-label">Parent</span>
          <span className="sa-editor__meta-val">{activity._parentId || "None"}</span>
        </div>
      </div>

      {/* Editable fields */}
      <div className="sa-editor__fields">
        <div className="sa-editor__field">
          <label className="sa-editor__label">
            Title <span className="sa-editor__req">*</span>
          </label>
          <input
            className="sa-editor__input"
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Activity title"
          />
        </div>

        <div className="sa-editor__field">
          <label className="sa-editor__label">Description</label>
          <textarea
            className="sa-editor__textarea"
            rows={7}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe this activity, steps, or acceptance criteria…"
          />
        </div>

        {saveErr && <div className="sa-editor__error">{saveErr}</div>}
      </div>

      {/* Footer */}
      <div className="sa-editor__footer">
        <button
          type="button"
          className="sa-editor__btn sa-editor__btn--reset"
          onClick={handleReset}
          disabled={!dirty || saving}
        >
          Reset
        </button>
        <button
          type="button"
          className="sa-editor__btn sa-editor__btn--close"
          onClick={onClose}
          disabled={saving}
        >
          Close
        </button>
        <button
          type="button"
          className="sa-editor__btn sa-editor__btn--update"
          onClick={handleUpdate}
          disabled={!dirty || saving || !form.title.trim()}
        >
          {saving ? (
            <>
              <span className="sa-editor__spin" /> Saving…
            </>
          ) : (
            <>
              <i className="bi bi-check2" /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="sa-editor__meta-row">
      <span className="sa-editor__meta-label">{label}</span>
      <span className="sa-editor__meta-value">{value ?? "—"}</span>
    </div>
  );
}

export default EditorPanel;
