import { useState, useEffect } from "react";
import {
  startSprintActivity,
  getSelectedSprintActivities,
} from "../../api/sprintActivities";
import { flattenSprintActivity } from "./SprintActivityMapper";
import ExecuteListHeader from "./ExecuteListHeader";
import CloseTestEntryModal from "../entries/CloseTestEntryModal";
import "../../styles/sprint-activities/SprintActivityExecuteList.css";
import { useEntryContext } from "../../context/EntryContext";

/* ── Default / empty filter state ──────────────────────────────────────── */
const EMPTY_FILTERS = {
  id: "",
  saId: "",
  title: "",
  parentId: "",
  externalTicket: "",
  currentEntry: "",
  /* multi-select arrays */
  types: [],
  statuses: [],
  currentUsers: [],
};

/* ── Filter helper ──────────────────────────────────────────────────────── */
function applyFilters(activities, filters) {
  return activities.filter((a) => {
    if (filters.id.trim() && String(a.activityId) !== filters.id.trim())
      return false;
    if (
      filters.saId.trim() &&
      String(a.sprintActivityId) !== filters.saId.trim()
    )
      return false;
    if (
      filters.title.trim() &&
      !a.title?.toLowerCase().includes(filters.title.trim().toLowerCase())
    )
      return false;
    if (
      filters.parentId.trim() &&
      String(a.parentActivityId ?? "") !== filters.parentId.trim()
    )
      return false;
    if (
      filters.externalTicket.trim() &&
      String(a.externalTicketId ?? "") !== filters.externalTicket.trim()
    )
      return false;
    if (
      filters.currentEntry.trim() &&
      String(a.currentEntry ?? "") !== filters.currentEntry.trim()
    )
      return false;
    /* Multi-select: include row if its value is in the selected set (OR logic) */
    if (
      filters.types.length > 0 &&
      !filters.types.includes(a.activityType_name)
    )
      return false;
    if (
      filters.statuses.length > 0 &&
      !filters.statuses.includes(a.currentStatus_displayName)
    )
      return false;
    if (
      filters.currentUsers.length > 0 &&
      !filters.currentUsers.includes(a.currentUser)
    )
      return false;
    return true;
  });
}

/* ── Hex color → readable foreground (white or dark) ───────────────────── */
function hexToForeground(hex) {
  if (!hex) return "#2c201a";
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  /* WCAG relative luminance */
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1a1209" : "#ffffff";
}

/* ── Pill badge component ───────────────────────────────────────────────── */
function ColorPill({ label, hex }) {
  if (!label) return <span style={{ color: "#b4a090" }}>—</span>;
  const bg = hex || "#e5ddd5";
  const fg = hexToForeground(hex);
  return (
    <span
      className="sa-exec-color-pill"
      style={{ backgroundColor: bg, color: fg, borderColor: bg }}
      title={label}
    >
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SprintActivityExecuteList
   ══════════════════════════════════════════════════════════════════════════ */
export default function SprintActivityExecuteList({ sprint }) {
  const [sprintActivities, setSprintActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const [selectedSprintActivity, setSelectedSprintActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { notifyEntryChange } = useEntryContext();

  /* ── Fetch ── */
  const fetchSprintActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSelectedSprintActivities(sprint.sprintId);
      const flat = response.map((a) => flattenSprintActivity(a));
      setSprintActivities(flat);
    } catch (err) {
      setError(err?.message || "Failed to load sprint activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprintActivities();
  }, []);

  useEffect(() => {
    setFilteredActivities(applyFilters(sprintActivities, appliedFilters));
  }, [sprintActivities, appliedFilters]);

  /* ── Actions ── */
  const handleSearch = () => setAppliedFilters({ ...filters });

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  const startEntry = async (sa) => {
    try {
      const response = await startSprintActivity(sa.sprintActivityId);
      const updated = flattenSprintActivity(response.data || response);
      setSprintActivities((prev) =>
        prev.map((a) =>
          a.sprintActivityId === updated.sprintActivityId ? updated : a,
        ),
      );
      notifyEntryChange();
    } catch (err) {
      setError(err?.message || "Failed to start entry.");
    }
  };

  const handleSA_Stop = (sa) => {
    setSelectedSprintActivity(sa);
    setShowModal(true);
  };

  const handleUpdateSprintActivity = (updated) => {
    setSprintActivities((prev) =>
      prev.map((a) =>
        a.sprintActivityId === updated.sprintActivityId ? updated : a,
      ),
    );
  };

  /* ── Root rows for tree rendering ── */
  const rootActivities = filteredActivities.filter(
    (sa) =>
      !sa.parentActivityId ||
      !filteredActivities.some(
        (item) => item.activityId === sa.parentActivityId,
      ),
  );

  return (
    <div className="sa-exec-root">
      {/* Error banner */}
      {error && (
        <div className="sa-exec-alert" role="alert">
          <span className="sa-exec-alert__content">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            {error}
          </span>
          <button
            type="button"
            className="sa-exec-alert__close"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            <i className="bi bi-x" />
          </button>
        </div>
      )}

      {/* Close-entry modal */}
      {showModal && selectedSprintActivity && (
        <CloseTestEntryModal
          onClose={() => {
            setShowModal(false);
          }}
          sprintActivityId={selectedSprintActivity.sprintActivityId}
          sprintActivity={selectedSprintActivity}
          onUpdateSprintActivity={handleUpdateSprintActivity}
        />
      )}

      {/* Header — chart receives filtered list so it reflects what the table shows */}
      <ExecuteListHeader
        sprintActivities={filteredActivities}
        allSprintActivities={sprintActivities}
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        totalCount={sprintActivities.length}
        filteredCount={filteredActivities.length}
        onDownload={() => {}}
      />

      {/* Table pane */}
      <div className="sa-exec-table-pane">
        <div className="sa-exec-table-header">
          <span className="sa-exec-table-header__title">
            Sprint Activities
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
        </div>

        <div className="sa-exec-table-card">
          {rootActivities.length === 0 && !loading ? (
            <div className="sa-exec-empty">
              <i
                className="bi bi-inbox sa-exec-empty__icon"
                aria-hidden="true"
              />
              <p className="sa-exec-empty__title">No activities found</p>
              <p className="sa-exec-empty__desc">
                Try adjusting your filters, or check back when activities have
                been added to this sprint.
              </p>
            </div>
          ) : (
            <div className="sa-exec-table-scroll">
              <table className="sa-exec-table" aria-label="Sprint Activities">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>SA-ID</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Parent ID</th>
                    <th>Ext. Ticket</th>
                    <th>Current User</th>
                    <th>C-Entry</th>
                    <th>Status</th>
                    <th className="th-actions">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rootActivities.map((sa) => (
                    <ActivityRow
                      key={sa.sprintActivityId}
                      sprintActivity={sa}
                      allActivities={filteredActivities}
                      level={0}
                      selectedId={selectedSprintActivity?.sprintActivityId}
                      onStartEntry={startEntry}
                      onStopEntry={handleSA_Stop}
                      onRowClick={setSelectedSprintActivity}
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
   ActivityRow — recursive tree row
   ══════════════════════════════════════════════════════════════════════════ */
function ActivityRow({
  sprintActivity,
  allActivities,
  level,
  selectedId,
  onStartEntry,
  onStopEntry,
  onRowClick,
}) {
  const [expanded, setExpanded] = useState(false);
  const sa = sprintActivity;

  const children = allActivities.filter(
    (item) => item.parentActivityId === sa.activityId,
  );
  const hasChildren = children.length > 0;
  const isSelected = selectedId === sa.sprintActivityId;
  const hasOpenEntry =
    sa.currentEntry !== null && sa.currentEntry !== undefined;

  return (
    <>
      <tr
        className={isSelected ? "row--selected" : ""}
        onClick={() => onRowClick(sa)}
      >
        {/* ID */}
        <td className="td-id">
          <div className="sa-exec-id-cell">
            {hasChildren ? (
              <button
                type="button"
                className="sa-exec-expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((p) => !p);
                }}
                aria-label={expanded ? "Collapse" : "Expand"}
                aria-expanded={expanded}
              >
                <i
                  className={`bi ${expanded ? "bi-chevron-down" : "bi-chevron-right"}`}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <span className="sa-exec-expand-spacer" aria-hidden="true" />
            )}
            {sa.activityId}
          </div>
        </td>

        {/* SA-ID */}
        <td className="td-said">{sa.sprintActivityId}</td>

        {/* Type — color pill from activityType_colourCode */}
        <td className="td-type">
          <ColorPill
            label={sa.activityType_name}
            hex={sa.activityType_colourCode}
          />
        </td>

        {/* Title */}
        <td className="td-title">
          <div
            className="sa-exec-title-cell"
            style={{ paddingLeft: `${level * 18}px` }}
          >
            <span className="sa-exec-title-text" title={sa.title}>
              {sa.title}
            </span>
          </div>
        </td>

        {/* Parent ID */}
        <td className="td-meta">
          {sa.parentActivityId ?? <span style={{ color: "#b4a090" }}>—</span>}
        </td>

        {/* Ext. Ticket */}
        <td className="td-meta">
          {sa.externalTicketId ?? <span style={{ color: "#b4a090" }}>—</span>}
        </td>

        {/* Current User */}
        <td className="td-meta">
          {sa.currentUser ?? <span style={{ color: "#b4a090" }}>—</span>}
        </td>

        {/* C-Entry */}
        <td className="td-meta">
          {sa.currentEntry ?? <span style={{ color: "#b4a090" }}>—</span>}
        </td>

        {/* Status — color pill from currentStatus_colourCode */}
        <td className="td-status">
          <ColorPill
            label={sa.currentStatus_displayName}
            hex={sa.currentStatus_colourCode}
          />
        </td>

        {/* Action */}
        <td className="td-actions">
          {!hasOpenEntry ? (
            <button
              type="button"
              className="sa-exec-action-btn sa-exec-action-btn--start"
              onClick={(e) => {
                e.stopPropagation();
                onStartEntry(sa);
              }}
              title="Start entry"
            >
              <i className="bi bi-play-fill" aria-hidden="true" />
              Start
            </button>
          ) : (
            <button
              type="button"
              className="sa-exec-action-btn sa-exec-action-btn--stop"
              onClick={(e) => {
                e.stopPropagation();
                onStopEntry(sa);
              }}
              title="Stop entry"
            >
              <i className="bi bi-stop-fill" aria-hidden="true" />
              Stop
            </button>
          )}
        </td>
      </tr>

      {expanded &&
        children.map((child) => (
          <ActivityRow
            key={child.sprintActivityId}
            sprintActivity={child}
            allActivities={allActivities}
            level={level + 1}
            selectedId={selectedId}
            onStartEntry={onStartEntry}
            onStopEntry={onStopEntry}
            onRowClick={onRowClick}
          />
        ))}
    </>
  );
}
