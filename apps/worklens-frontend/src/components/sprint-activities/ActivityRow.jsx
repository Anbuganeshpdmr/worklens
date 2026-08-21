import { useState } from "react";
import ActivityStatusBadge from "./ActivityStatusBadge";
import { getSprintActivityChildren } from "../../api/activities";
import "../../styles/sprint-activities/ActivityRow.css";

const DEFAULT_TYPE_COLORS = {
  parent: "#7c3aed",
  scenario: "#0284c7",
  task: "#10b981",
  bug: "#ef4444",
  feature: "#f59e0b",
  activity: "#6366f1",
};

function typeColorFor(activityType) {
  if (!activityType) return "#7c3aed";
  if (typeof activityType === "object") {
    if (activityType.colourCode) return activityType.colourCode;
    if (activityType.color) return activityType.color;
    if (activityType.colorCode) return activityType.colorCode;
    const name = String(activityType.name ?? "").toLowerCase();
    for (const [key, val] of Object.entries(DEFAULT_TYPE_COLORS)) {
      if (name.includes(key)) return val;
    }
    return "#7c3aed";
  }
  const name = String(activityType).toLowerCase();
  for (const [key, val] of Object.entries(DEFAULT_TYPE_COLORS)) {
    if (name.includes(key)) return val;
  }
  return "#7c3aed";
}

function extractActivityData(act) {
  if (!act) return {};
  const info = act.simpleActivityInfo ?? act.activityInfo ?? act.activity ?? {};
  const sprintActivityId =
    act.sprintActivityId ??
    act.id ??
    act._id ??
    act.sprint_activity_id ??
    info.sprintActivityId ??
    info.activityId;
  const actId = info.activityId ?? act.activityId ?? sprintActivityId;
  const title = info.title ?? act.title ?? "Untitled Activity";

  const activityTypeObj =
    info.activityType ?? act.activityType ?? info.type ?? act.type;
  const typeColor = typeColorFor(activityTypeObj);
  const typeName =
    typeof activityTypeObj === "object"
      ? String(activityTypeObj?.name ?? "Activity")
      : String(activityTypeObj ?? "Activity");

  const statusName = String(
    act.currentStatus?.statusName ??
      info.currentStatus?.statusName ??
      act.statusName ??
      act.status ??
      info.status ??
      ""
  );
  const colourCode =
    act.currentStatus?.colourCode ??
    info.currentStatus?.colourCode ??
    act.colourCode ??
    null;
  const parentActivityId =
    info.parentActivityId ??
    act.parentActivityId ??
    act.parentId ??
    info.parentId ??
    null;
  const createdBy = info.createdBy ?? act.createdBy ?? "—";
  const createdOn =
    info.createdOn ?? act.createdOn
      ? new Date(info.createdOn ?? act.createdOn).toLocaleString()
      : "—";
  const updatedBy = info.updatedBy ?? act.updatedBy ?? "—";
  const updatedOn =
    info.updatedOn ?? act.updatedOn
      ? new Date(info.updatedOn ?? act.updatedOn).toLocaleString()
      : "—";
  const description = info.description ?? act.description ?? "";

  return {
    rowId: sprintActivityId,
    actId,
    title,
    typeName,
    typeColor,
    statusName,
    colourCode,
    parentActivityId,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
    description,
    raw: act,
  };
}

/**
 * ActivityRow
 * Renders a sprint-activity row. Clicking on the row or chevron fetches and displays child activities.
 * The left vertical line is dynamically colored by 'activityType'.
 */
function ActivityRow({
  activity,
  isSelected,
  onSelect,
  editorOpen,
  onAddScenario,
  depth = 0,
}) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState(null); // null = not yet fetched
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);

  const data = extractActivityData(activity);
  const {
    rowId,
    actId,
    title,
    typeName,
    typeColor,
    statusName,
    colourCode,
    parentActivityId,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
    description,
  } = data;

  /* ── Expand & fetch child activities ─────────────────────── */
  async function fetchAndToggleChildren(forceExpand = null) {
    const nextExpanded = forceExpand !== null ? forceExpand : !expanded;

    if (!nextExpanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);

    if (children !== null && forceExpand !== true) {
      return;
    }

    if (!rowId) {
      setChildren([]);
      return;
    }

    setLoading(true);
    setLoadError("");
    try {
      const responseData = await getSprintActivityChildren(rowId);
      const list = Array.isArray(responseData)
        ? responseData
        : responseData?.content ??
          responseData?.data ??
          responseData?.children ??
          responseData?.scenarios ??
          [];
      setChildren(list);
    } catch (err) {
      setLoadError(err.message || "Failed to load child activities");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleClick = (e) => {
    e.stopPropagation();
    fetchAndToggleChildren();
  };

  /* ── Clicking row selects activity AND toggles children ──── */
  const handleRowClick = () => {
    onSelect?.({
      ...activity,
      _id: rowId,
      _title: title,
      _typeName: typeName,
      _actId: actId,
      _parentId: parentActivityId,
      _createdBy: createdBy,
      _createdOn: createdOn,
      _updatedBy: updatedBy,
      _updatedOn: updatedOn,
      _description: description,
    });

    fetchAndToggleChildren();
  };

  const handleInspectClick = (e) => {
    e.stopPropagation();
    onSelect?.({
      ...activity,
      _id: rowId,
      _title: title,
      _typeName: typeName,
      _actId: actId,
      _parentId: parentActivityId,
      _createdBy: createdBy,
      _createdOn: createdOn,
      _updatedBy: updatedBy,
      _updatedOn: updatedOn,
      _description: description,
    });
  };

  const handleAddScenarioClick = (e) => {
    e.stopPropagation();
    onAddScenario?.(rowId);
  };

  return (
    <>
      {/* ── Main Activity Row ───────────────────────────────── */}
      <tr
        className={[
          "sa-row",
          depth > 0 ? "sa-row--child" : "sa-row--parent-level",
          isSelected ? "sa-row--selected" : "",
          "sa-row--clickable",
        ]
          .join(" ")
          .trim()}
        style={{
          "--type-accent": typeColor,
          "--row-depth": depth,
        }}
        onClick={handleRowClick}
        title="Click to view details and display child activities"
      >
        {/* Expand toggle + left vertical line */}
        <td className="sa-row__td sa-row__td--toggle">
          <div className="sa-row__toggle-cell">
            {depth > 0 && (
              <span
                className="sa-row__branch-arrow"
                style={{ color: typeColor }}
                title="Child Activity"
              >
                ↳
              </span>
            )}
            <button
              type="button"
              className={`sa-row__toggle${expanded ? " sa-row__toggle--open" : ""}`}
              onClick={handleToggleClick}
              aria-label={expanded ? "Collapse child activities" : "Expand child activities"}
              title={expanded ? "Collapse child activities" : "Expand child activities"}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </td>

        {/* ID + Title */}
        <td className="sa-row__td sa-row__td--title">
          <div className="sa-row__title-wrap">
            <div className="sa-row__id-wrap">
              <span className="sa-row__id">{actId}</span>
              {children && children.length > 0 && (
                <span className="sa-row__scenarios-badge">
                  {children.length} {children.length === 1 ? "child" : "children"}
                </span>
              )}
            </div>
            <span className="sa-row__title">{title}</span>
          </div>
        </td>

        {/* Type chip */}
        <td className="sa-row__td">
          <span
            className="sa-row__chip sa-row__chip--type"
            style={{
              borderColor: `${typeColor}40`,
              color: typeColor,
              background: `${typeColor}10`,
            }}
          >
            <span
              className="sa-row__chip-dot"
              style={{ background: typeColor }}
            />
            {typeName || "Activity"}
          </span>
        </td>

        {/* Parent activity reference */}
        <td className="sa-row__td sa-row__td--parent">
          <span className="sa-row__meta-text">{parentActivityId ?? "—"}</span>
        </td>

        {/* Status */}
        <td className="sa-row__td">
          <ActivityStatusBadge status={statusName} colour={colourCode} />
        </td>

        {/* Last executed */}
        <td className="sa-row__td sa-row__td--date">
          <span className="sa-row__meta-text">{updatedOn}</span>
        </td>

        {/* Actions */}
        <td className="sa-row__td sa-row__td--actions">
          <div className="sa-row__actions-wrap">
            <button
              type="button"
              className="sa-row__action sa-row__action--inspect"
              title="Inspect Details"
              onClick={handleInspectClick}
            >
              <i className="bi bi-layout-sidebar-inset-reverse" />
            </button>
            <button
              type="button"
              className="sa-row__action sa-row__action--run"
              title="Run Activity"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <i className="bi bi-play-fill" />
            </button>
          </div>
        </td>
      </tr>

      {/* ── Child Rows Section (Rendered when expanded) ────────── */}
      {expanded && (
        <>
          {/* Loading state */}
          {loading && (
            <tr className="sa-row__child-state-row">
              <td colSpan={7} className="sa-row__child-state">
                <span className="sa-row__spinner" /> Loading child activities for{" "}
                <strong>{actId}</strong>…
              </td>
            </tr>
          )}

          {/* Error state with retry */}
          {!loading && loadError && (
            <tr className="sa-row__child-state-row">
              <td
                colSpan={7}
                className="sa-row__child-state sa-row__child-state--error"
              >
                <div className="sa-row__error-wrap">
                  <i className="bi bi-exclamation-triangle" />
                  <span>{loadError}</span>
                  <button
                    type="button"
                    className="sa-row__retry-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchAndToggleChildren(true);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise" /> Retry
                  </button>
                </div>
              </td>
            </tr>
          )}

          {/* Empty state */}
          {!loading && !loadError && children?.length === 0 && (
            <tr className="sa-row__child-state-row">
              <td colSpan={7} className="sa-row__child-state">
                <div className="sa-row__empty-children">
                  <i className="bi bi-info-circle" />
                  <span>No child activities found for {actId}.</span>
                  <button
                    type="button"
                    className="sa-row__add-child-inline-btn"
                    onClick={handleAddScenarioClick}
                  >
                    <i className="bi bi-plus-circle" /> Add Child Activity
                  </button>
                </div>
              </td>
            </tr>
          )}

          {/* Child activities list */}
          {!loading &&
            !loadError &&
            children &&
            children.length > 0 &&
            children.map((child, idx) => {
              const childKey =
                child.sprintActivityId ??
                child.id ??
                child._id ??
                child.simpleActivityInfo?.activityId ??
                `child-${rowId}-${idx}`;
              return (
                <ChildActivityRow
                  key={childKey}
                  child={child}
                  parentId={rowId}
                  editorOpen={editorOpen}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onAddScenario={onAddScenario}
                  depth={depth + 1}
                />
              );
            })}

          {/* Add Scenario Action Footer Row */}
          {!loading && !loadError && children && children.length > 0 && (
            <tr className="sa-row__add-row">
              <td colSpan={7} className="sa-row__add-cell">
                <button
                  type="button"
                  className="sa-row__add-btn"
                  onClick={handleAddScenarioClick}
                >
                  <i className="bi bi-plus-circle" /> Add Scenario to {actId}
                </button>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
}

/**
 * ChildActivityRow
 * Renders an individual child activity with clean (↳) arrow branching indicator,
 * matching columns, and vertical color line by activityType.
 */
function ChildActivityRow({
  child,
  parentId,
  onSelect,
  onAddScenario,
  depth = 1,
}) {
  const [expanded, setExpanded] = useState(false);
  const [subChildren, setSubChildren] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const data = extractActivityData(child);
  const {
    rowId,
    actId,
    title,
    typeName,
    typeColor,
    statusName,
    colourCode,
    parentActivityId,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
    description,
  } = data;

  const resolvedParentId = parentActivityId || parentId || "—";

  async function fetchSubChildren(forceExpand = null) {
    const nextExpanded = forceExpand !== null ? forceExpand : !expanded;

    if (!nextExpanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);
    if (subChildren !== null && forceExpand !== true) return;
    if (!rowId) {
      setSubChildren([]);
      return;
    }

    setLoading(true);
    setLoadError("");
    try {
      const responseData = await getSprintActivityChildren(rowId);
      const list = Array.isArray(responseData)
        ? responseData
        : responseData?.content ??
          responseData?.data ??
          responseData?.children ??
          responseData?.scenarios ??
          [];
      setSubChildren(list);
    } catch (err) {
      setLoadError(err.message || "Failed to load sub-activities");
    } finally {
      setLoading(false);
    }
  }

  const handleClick = () => {
    onSelect?.({
      ...child,
      _id: rowId,
      _title: title,
      _typeName: typeName,
      _actId: actId,
      _parentId: resolvedParentId,
      _createdBy: createdBy,
      _createdOn: createdOn,
      _updatedBy: updatedBy,
      _updatedOn: updatedOn,
      _description: description,
    });
    fetchSubChildren();
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    fetchSubChildren();
  };

  return (
    <>
      <tr
        className="sa-row sa-row--child sa-row--clickable"
        style={{
          "--type-accent": typeColor,
          "--row-depth": depth,
        }}
        onClick={handleClick}
        title="Click to view details and toggle sub-activities"
      >
        {/* Prominent (↳) Branch Arrow + Expand Toggle */}
        <td className="sa-row__td sa-row__td--toggle">
          <div className="sa-row__toggle-cell">
            <span
              className="sa-row__branch-arrow"
              style={{ color: typeColor }}
              title="Child Activity"
            >
              ↳
            </span>

            <button
              type="button"
              className={`sa-row__toggle${expanded ? " sa-row__toggle--open" : ""}`}
              onClick={handleToggleClick}
              aria-label="Toggle sub-activities"
              title="Toggle sub-activities"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </td>

        {/* Title + (↳) branch indication */}
        <td className="sa-row__td sa-row__td--title">
          <div
            className="sa-row__title-wrap sa-row__title-wrap--child"
            style={{ paddingLeft: `${(depth - 1) * 12}px` }}
          >
            <div className="sa-row__id-wrap">
              <span
                className="sa-row__id-branch"
                style={{ color: typeColor }}
                title="Child Activity"
              >
                ↳
              </span>
              <span className="sa-row__id">{actId}</span>
              {subChildren && subChildren.length > 0 && (
                <span className="sa-row__scenarios-badge">
                  {subChildren.length} children
                </span>
              )}
            </div>
            <span className="sa-row__title">{title}</span>
          </div>
        </td>

        {/* Type */}
        <td className="sa-row__td">
          <span
            className="sa-row__chip sa-row__chip--type"
            style={{
              borderColor: `${typeColor}40`,
              color: typeColor,
              background: `${typeColor}10`,
            }}
          >
            <span
              className="sa-row__chip-dot"
              style={{ background: typeColor }}
            />
            {typeName}
          </span>
        </td>

        {/* Parent Activity */}
        <td className="sa-row__td sa-row__td--parent">
          <span className="sa-row__meta-text">{resolvedParentId}</span>
        </td>

        {/* Status */}
        <td className="sa-row__td">
          <ActivityStatusBadge status={statusName} colour={colourCode} />
        </td>

        {/* Date */}
        <td className="sa-row__td sa-row__td--date">
          <span className="sa-row__meta-text">{updatedOn}</span>
        </td>

        {/* Actions */}
        <td className="sa-row__td sa-row__td--actions">
          <div className="sa-row__actions-wrap">
            <button
              type="button"
              className="sa-row__action sa-row__action--inspect"
              title="Inspect Details"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <i className="bi bi-layout-sidebar-inset-reverse" />
            </button>
            <button
              type="button"
              className="sa-row__action sa-row__action--run"
              title="Run Activity"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-play-fill" />
            </button>
          </div>
        </td>
      </tr>

      {/* Sub-children if expanded */}
      {expanded && (
        <>
          {loading && (
            <tr className="sa-row__child-state-row">
              <td colSpan={7} className="sa-row__child-state">
                <span className="sa-row__spinner" /> Loading sub-activities for {actId}…
              </td>
            </tr>
          )}
          {!loading && loadError && (
            <tr className="sa-row__child-state-row">
              <td colSpan={7} className="sa-row__child-state sa-row__child-state--error">
                <i className="bi bi-exclamation-triangle" /> {loadError}
              </td>
            </tr>
          )}
          {!loading && !loadError && subChildren?.length === 0 && (
            <tr className="sa-row__child-state-row">
              <td colSpan={7} className="sa-row__child-state">
                No further sub-activities found for {actId}.
              </td>
            </tr>
          )}
          {!loading &&
            !loadError &&
            subChildren?.map((subChild, sIdx) => (
              <ChildActivityRow
                key={subChild.sprintActivityId ?? subChild.id ?? `sub-${rowId}-${sIdx}`}
                child={subChild}
                parentId={rowId}
                onSelect={onSelect}
                onAddScenario={onAddScenario}
                depth={depth + 1}
              />
            ))}
        </>
      )}
    </>
  );
}

export default ActivityRow;
