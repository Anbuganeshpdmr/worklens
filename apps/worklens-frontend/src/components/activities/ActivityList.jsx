import { useState, useEffect } from "react";
import { getAllProjectActivities } from "../../api/activities";
import { convertTimeToClientReadable } from "../../utils/utility";
import Editor from "./Editor";
import ActivitySearchHeader from "./ActivitySearchHeader";
import "../../styles/activities/ActivityList.css";

/* ── Default / empty filter state ─────────────────────────────────────────── */
const EMPTY_FILTERS = {
  id: "",
  title: "",
  description: "",
  createdBy: "",
  createdFrom: "",
  createdTo: "",
  updatedFrom: "",
  updatedTo: "",
};

/* ── Filter helper ─────────────────────────────────────────────────────────── */
function applyFilters(activities, filters) {
  const {
    id,
    title,
    description,
    createdBy,
    createdFrom,
    createdTo,
    updatedFrom,
    updatedTo,
  } = filters;

  return activities.filter((a) => {    // ID — exact numeric match
    if (id.trim()) {
      if (String(a.activityId) !== id.trim()) return false;
    }

    // Title — case-insensitive substring
    if (title.trim()) {
      if (!a.title?.toLowerCase().includes(title.trim().toLowerCase()))
        return false;
    }

    // Description — case-insensitive substring
    if (description.trim()) {
      if (
        !a.description?.toLowerCase().includes(description.trim().toLowerCase())
      )
        return false;
    }

    // Created By — case-insensitive substring
    if (createdBy.trim()) {
      if (!a.createdBy?.toLowerCase().includes(createdBy.trim().toLowerCase()))
        return false;
    }

    // Created Between
    if (createdFrom) {
      if (!a.createdOn || new Date(a.createdOn) < new Date(createdFrom))
        return false;
    }
    if (createdTo) {
      // Include the full "to" day
      const toEnd = new Date(createdTo);
      toEnd.setHours(23, 59, 59, 999);
      if (!a.createdOn || new Date(a.createdOn) > toEnd) return false;
    }

    // Updated Between
    if (updatedFrom) {
      if (!a.updatedOn || new Date(a.updatedOn) < new Date(updatedFrom))
        return false;
    }
    if (updatedTo) {
      const toEnd = new Date(updatedTo);
      toEnd.setHours(23, 59, 59, 999);
      if (!a.updatedOn || new Date(a.updatedOn) > toEnd) return false;
    }
    return true;
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   ActivityList
   ══════════════════════════════════════════════════════════════════════════ */
export default function ActivityList({ projectId }) {
  /* ── Data ── */
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Search / filter ── */
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  // "applied" snapshot — filtering only runs when Search is clicked
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  /* ── Editor panel ── */
  const [editingActivity, setEditingActivity] = useState(null); // null = new
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [parentActivityId, setParentActivityId] = useState(null);
  const [editorDirty, setEditorDirty] = useState(false);
  // track which row triggered the editor open (for row highlight)
  const [activeRowId, setActiveRowId] = useState(null);

  /* ── Fetch ── */
  const fetchActivities = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllProjectActivities(projectId);
      setActivities(response);
    } catch (err) {
      setError(err?.message || "Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [projectId]);

  // Re-apply filters whenever the base list or appliedFilters change
  useEffect(() => {
    setFilteredActivities(applyFilters(activities, appliedFilters));
  }, [activities, appliedFilters]);

  /* ── Search actions ── */
  const handleSearch = () => {
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  /* ── Dirty-check guard shared by all open actions ── */
  const guardDirty = () => {
    if (isEditorOpen && editorDirty) {
      return window.confirm("You have unsaved changes. Discard them?");
    }
    return true;
  };

  /* ── Editor open handlers ── */
  const handleNewRoot = () => {
    if (!guardDirty()) return;
    setEditingActivity(null);
    setParentActivityId(null);
    setActiveRowId(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (activity) => {
    if (!guardDirty()) return;
    setEditingActivity(activity);
    setParentActivityId(null);
    setActiveRowId(activity.activityId);
    setIsEditorOpen(true);
  };

  const handleAddChild = (activity) => {
    if (!guardDirty()) return;
    setEditingActivity(null);
    setParentActivityId(activity.activityId);
    setActiveRowId(activity.activityId);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    if (editorDirty) {
      if (!window.confirm("You have unsaved changes. Discard them?")) return;
    }
    setIsEditorOpen(false);
    setEditingActivity(null);
    setParentActivityId(null);
    setActiveRowId(null);
    setEditorDirty(false);
  };

  const handleSaveSuccess = async () => {
    await fetchActivities();
    setIsEditorOpen(false);
    setEditingActivity(null);
    setParentActivityId(null);
    setActiveRowId(null);
    setEditorDirty(false);
  };

  /* ── Derived counts ── */
  //const rootActivities = filteredActivities.filter((a) => !a.parentActivityId);
  const rootActivities = filteredActivities.filter(
    (activity) =>
      !activity.parentActivityId ||
      !filteredActivities.some(
        (item) => item.activityId === activity.parentActivityId,
      ),
  );

  /* ── Render ── */
  return (
    <div className="act-list-root">
      {/* Error banner */}
      {error && (
        <div className="gen-act-alert" role="alert">
          <span className="gen-act-alert__content">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            {error}
          </span>
          <button
            type="button"
            className="gen-act-alert__close"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <i className="bi bi-x" />
          </button>
        </div>
      )}

      {/* Search Header */}
      <ActivitySearchHeader
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        totalCount={activities.length}
        filteredCount={filteredActivities.length}
      />

      {/* Table + Editor side-by-side workspace */}
      <div className="act-list-workspace">
        {/* ── Table pane ── */}
        <div className="act-list-table-pane">
          <div className="act-list-header">
            <span className="act-list-header-title">
              Activities
              {loading && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: 400,
                    color: "#9e8d7f",
                  }}
                >
                  Loading…
                </span>
              )}
            </span>
            <button
              type="button"
              className="act-list-btn-new"
              onClick={handleNewRoot}
            >
              <i className="bi bi-plus-lg" aria-hidden="true" />
              New Activity
            </button>
          </div>

          <div className="act-list-table-card">
            {rootActivities.length === 0 && !loading ? (
              <div className="act-list-empty">
                <i
                  className="bi bi-inbox act-list-empty__icon"
                  aria-hidden="true"
                />
                <p className="act-list-empty__title">No activities found</p>
                <p className="act-list-empty__desc">
                  Try adjusting your filters, or create the first activity for
                  this project.
                </p>
                <button
                  type="button"
                  className="act-list-btn-new"
                  onClick={handleNewRoot}
                >
                  <i className="bi bi-plus-lg" aria-hidden="true" />
                  New Activity
                </button>
              </div>
            ) : (
              <div className="act-list-table-scroll">
                <table className="act-list-table" aria-label="Activities">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Ext. Ticket</th>
                      <th>Parent ID</th>
                      <th>Created By</th>
                      <th>Created On</th>
                      <th>Updated On</th>
                      <th className="th-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rootActivities.map((activity) => (
                      <ActivityRow
                        key={activity.activityId}
                        activity={activity}
                        allActivities={filteredActivities}
                        level={0}
                        activeRowId={activeRowId}
                        onEdit={handleEdit}
                        onAddChild={handleAddChild}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Editor pane ── */}
        {isEditorOpen && (
          <div
            className="act-list-editor-pane"
            role="complementary"
            aria-label="Activity editor"
          >
            <div className="act-editor-pane-header">
              <h3 className="act-editor-pane-title">
                {editingActivity
                  ? "Edit Activity"
                  : parentActivityId
                    ? "Add Child Activity"
                    : "New Activity"}
              </h3>
              <button
                type="button"
                className="act-editor-pane-close"
                onClick={handleCloseEditor}
                aria-label="Close editor"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="act-editor-pane-body">
              <Editor
                activity={editingActivity}
                existingParentActivityId={parentActivityId}
                onClose={handleCloseEditor}
                projectId={projectId}
                onDirtyChange={setEditorDirty}
                onSaveSuccess={handleSaveSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ActivityRow  — recursive tree row
   ══════════════════════════════════════════════════════════════════════════ */
function ActivityRow({
  activity,
  allActivities,
  level,
  activeRowId,
  onEdit,
  onAddChild,
}) {
  const [expanded, setExpanded] = useState(false);

  const children = allActivities.filter(
    (a) => a.parentActivityId === activity.activityId,
  );
  const hasChildren = children.length > 0;
  const isActive = activeRowId === activity.activityId;

  return (
    <>
      <tr className={isActive ? "row--active" : ""}>
        {/* ID — expand toggle lives here, prefixed to the ID number */}
        <td className="td-id">
          <div className="act-list-id-cell">
            {hasChildren ? (
              <button
                type="button"
                className="act-list-expand-btn"
                onClick={() => setExpanded((p) => !p)}
                aria-label={expanded ? "Collapse children" : "Expand children"}
                aria-expanded={expanded}
              >
                <i
                  className={`bi ${expanded ? "bi-chevron-down" : "bi-chevron-right"}`}
                  aria-hidden="true"
                />
              </button>
            ) : (
              /* fixed-width spacer keeps ID text aligned across all rows */
              <span className="act-list-expand-spacer" aria-hidden="true" />
            )}
            <span>{activity.activityId}</span>
          </div>
        </td>

        {/* Title — indented by tree level, no toggle here */}
        <td className="td-title">
          <div
            className="act-list-title-cell"
            style={{ paddingLeft: `${level * 18}px` }}
          >
            <span className="act-list-title-text" title={activity.title}>
              {activity.title}
            </span>
          </div>
        </td>

        {/* Description */}
        <td className="td-desc" title={activity.description || ""}>
          {activity.description || <span style={{ color: "#b4a090" }}>—</span>}
        </td>

        {/* Status */}
        <td className="td-status">
          {activity.currentStatus?.displayName ? (
            <span className="act-list-status-badge">
              {activity.currentStatus.displayName}
            </span>
          ) : (
            <span style={{ color: "#b4a090" }}>—</span>
          )}
        </td>

        {/* External Ticket */}
        <td className="td-meta">
          {activity.externalTicketId ?? (
            <span style={{ color: "#b4a090" }}>—</span>
          )}
        </td>

        {/* Parent ID */}
        <td className="td-meta">
          {activity.parentActivityId ?? (
            <span style={{ color: "#b4a090" }}>—</span>
          )}
        </td>

        {/* Created By */}
        <td className="td-meta">{activity.createdBy}</td>

        {/* Created On */}
        <td className="td-meta" >
          {convertTimeToClientReadable(activity.createdOn) || "—"}
        </td>

        {/* Updated On */}
        <td className="td-meta">
          {convertTimeToClientReadable(activity.updatedOn) || "—"}
        </td>

        {/* Actions */}
        <td className="td-actions">
          <div className="act-list-actions">
            <button
              type="button"
              className={`act-list-btn act-list-btn--edit${isActive && !activity.parentActivityId ? " btn--active" : ""}`}
              onClick={() => onEdit(activity)}
              title="Edit activity"
            >
              <i className="bi bi-pencil" aria-hidden="true" />
              {/* Edit */}
            </button>
            <button
              type="button"
              className={`act-list-btn act-list-btn--edit${isActive && activity.activityId === activeRowId ? " btn--active" : ""}`}
              onClick={() => onAddChild(activity)}
              title="Add child activity"
            >
              <i className="bi bi-diagram-3" aria-hidden="true" />
              {/* Add Child */}
            </button>
          </div>
        </td>
      </tr>

      {/* Recursive children */}
      {expanded &&
        children.map((child) => (
          <ActivityRow
            key={child.activityId}
            activity={child}
            allActivities={allActivities}
            level={level + 1}
            activeRowId={activeRowId}
            onEdit={onEdit}
            onAddChild={onAddChild}
          />
        ))}
    </>
  );
}
