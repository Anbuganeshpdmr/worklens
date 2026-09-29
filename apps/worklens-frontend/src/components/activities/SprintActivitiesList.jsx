import { useState, useEffect } from "react";
import { getAllProjectActivities } from "../../api/activities";
import {
  getSelectedSprintActivityIds,
  updateSprintActivitiesList,
} from "../../api/sprintActivities";
import { convertTimeToClientReadable } from "../../utils/utility";
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

  return activities.filter((a) => {
    // ID — exact numeric match
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
   SprintActivitiesList
   ══════════════════════════════════════════════════════════════════════════ */
export default function SprintActivitiesList({ sprint }) {
  /* ── Data ── */
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ── Selection ── */
  const [selectedActivityIds, setSelectedActivityIds] = useState(new Set());
  const [originalSelectedIds, setOriginalSelectedIds] = useState(new Set());

  /* ── Search / filter ── */
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  /* ── Fetch all activities for the project ── */
  const fetchActivities = async () => {
    if (!sprint?.projectId) return;
    setLoading(true);
    setError("");
    try {
      const response = await getAllProjectActivities(sprint.projectId);
      setActivities(response);
    } catch (err) {
      setError(err?.message || "Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch already-selected activity IDs for this sprint ── */
  const fetchSelectedIds = async () => {
    if (!sprint?.sprintId) return;
    try {
      const ids = await getSelectedSprintActivityIds(sprint.sprintId);
      setSelectedActivityIds(new Set(ids));
      setOriginalSelectedIds(new Set(ids));
    } catch (err) {
      console.error("Error fetching selected sprint activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [sprint?.projectId]);

  useEffect(() => {
    fetchSelectedIds();
  }, [sprint?.sprintId]);

  // Re-apply filters whenever base list or applied filters change
  useEffect(() => {
    setFilteredActivities(applyFilters(activities, appliedFilters));
  }, [activities, appliedFilters]);

  /* ── Search actions ── */
  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  /* ── Checkbox toggle ── */
  const handleCheckboxChange = (activityId) => {
    setSaveSuccess(false);
    setSelectedActivityIds((prev) => {
      const next = new Set(prev);
      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
  };

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      const activityIds = Array.from(selectedActivityIds);
      await updateSprintActivitiesList(sprint.sprintId, activityIds);
      // Re-fetch to confirm persisted state
      const updatedIds = await getSelectedSprintActivityIds(sprint.sprintId);
      const confirmed = new Set(updatedIds);
      setSelectedActivityIds(confirmed);
      setOriginalSelectedIds(confirmed);
      setSaveSuccess(true);
    } catch (err) {
      console.error("Error saving sprint activities:", err);
      setError("Failed to save sprint activities. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Discard changes ── */
  const handleDiscard = () => {
    setSelectedActivityIds(new Set(originalSelectedIds));
    setSaveSuccess(false);
  };

  /* ── Derived counts ── */
  const rootActivities = filteredActivities.filter(
    (activity) =>
      !activity.parentActivityId ||
      !filteredActivities.some(
        (item) => item.activityId === activity.parentActivityId,
      ),
  );

  const isDirty =
    selectedActivityIds.size !== originalSelectedIds.size ||
    [...selectedActivityIds].some((id) => !originalSelectedIds.has(id));

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

      {/* Search Header — reused exactly from ActivityList */}
      <ActivitySearchHeader
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        totalCount={activities.length}
        filteredCount={filteredActivities.length}
      />

      {/* Table pane */}
      <div className="act-list-table-pane">
        {/* ── Header row: title + save bar ── */}
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

          {/* Save bar */}
          <div className="sa-save-bar">
            {saveSuccess && (
              <span className="sa-save-success">
                <i className="bi bi-check-circle-fill" aria-hidden="true" />
                Saved
              </span>
            )}
            {isDirty && !saving && (
              <button
                type="button"
                className="act-list-btn-new sa-btn-discard"
                onClick={handleDiscard}
              >
                <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                Discard
              </button>
            )}
            <button
              type="button"
              className="act-list-btn-new"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="bi bi-hourglass-split" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  <i className="bi bi-floppy" aria-hidden="true" />
                  Save Selection
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="act-list-table-card">
          {rootActivities.length === 0 && !loading ? (
            <div className="act-list-empty">
              <i
                className="bi bi-inbox act-list-empty__icon"
                aria-hidden="true"
              />
              <p className="act-list-empty__title">No activities found</p>
              <p className="act-list-empty__desc">
                Try adjusting your filters, or add activities to this project
                first.
              </p>
            </div>
          ) : (
            <div className="act-list-table-scroll">
              <table className="act-list-table sa-table" aria-label="Sprint activities">
                <thead>
                  <tr>
                    <th className="th-select">Select</th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Ext. Ticket</th>
                    <th>Parent ID</th>
                    <th>Created By</th>
                    <th>Created On</th>
                    <th>Updated On</th>
                  </tr>
                </thead>
                <tbody>
                  {rootActivities.map((activity) => (
                    <SprintActivityRow
                      key={activity.activityId}
                      activity={activity}
                      allActivities={filteredActivities}
                      level={0}
                      selectedActivityIds={selectedActivityIds}
                      onCheckboxChange={handleCheckboxChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SprintActivityRow  — recursive tree row with checkbox
   ══════════════════════════════════════════════════════════════════════════ */
function SprintActivityRow({
  activity,
  allActivities,
  level,
  selectedActivityIds,
  onCheckboxChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const children = allActivities.filter(
    (a) => a.parentActivityId === activity.activityId,
  );
  const hasChildren = children.length > 0;
  const isChecked = selectedActivityIds.has(activity.activityId);

  return (
    <>
      <tr className={isChecked ? "row--selected" : ""}>
        {/* Select */}
        <td className="td-select">
          <input
            type="checkbox"
            className="sa-checkbox"
            checked={isChecked}
            onChange={() => onCheckboxChange(activity.activityId)}
            aria-label={`Select activity ${activity.activityId}`}
          />
        </td>

        {/* ID — expand toggle lives here */}
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
              <span className="act-list-expand-spacer" aria-hidden="true" />
            )}
            <span>{activity.activityId}</span>
          </div>
        </td>

        {/* Title */}
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
        <td className="td-meta">
          {convertTimeToClientReadable(activity.createdOn) || "—"}
        </td>

        {/* Updated On */}
        <td className="td-meta">
          {convertTimeToClientReadable(activity.updatedOn) || "—"}
        </td>
      </tr>

      {/* Recursive children */}
      {expanded &&
        children.map((child) => (
          <SprintActivityRow
            key={child.activityId}
            activity={child}
            allActivities={allActivities}
            level={level + 1}
            selectedActivityIds={selectedActivityIds}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
    </>
  );
}
