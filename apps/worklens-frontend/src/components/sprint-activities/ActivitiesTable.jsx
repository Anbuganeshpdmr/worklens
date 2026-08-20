import ActivityRow from "./ActivityRow";
import "../../styles/sprint-activities/ActivitiesTable.css";

/**
 * ActivitiesTable
 * Renders the table of sprint activities with sortable headers, skeleton loader,
 * and empty/error states.
 */
function ActivitiesTable({
  activities,
  loading,
  error,
  selectedId,
  onSelectActivity,
  editorOpen,
  sortField,
  sortDirection,
  onSort,
  onAddScenario,
  onClearFilters,
  onAddActivity,
  onRetry,
}) {
  function renderSortIcon(field) {
    if (sortField !== field) {
      return <i className="bi bi-arrow-down-up sa-table__sort-icon sa-table__sort-icon--idle" />;
    }
    return sortDirection === "asc" ? (
      <i className="bi bi-sort-alpha-down sa-table__sort-icon sa-table__sort-icon--active" />
    ) : (
      <i className="bi bi-sort-alpha-down-alt sa-table__sort-icon sa-table__sort-icon--active" />
    );
  }

  return (
    <div className="sa-table-wrap">
      <table className="sa-table">
        <thead className="sa-table__head">
          <tr>
            <th className="sa-table__th sa-table__th--toggle" />
            <th
              className="sa-table__th sa-table__th--title sa-table__th--sortable"
              onClick={() => onSort?.("title")}
            >
              <span>Activity / Scenario</span>
              {renderSortIcon("title")}
            </th>
            <th
              className="sa-table__th sa-table__th--sortable"
              onClick={() => onSort?.("type")}
            >
              <span>Type</span>
              {renderSortIcon("type")}
            </th>
            <th className="sa-table__th">Parent Activity</th>
            <th
              className="sa-table__th sa-table__th--sortable"
              onClick={() => onSort?.("status")}
            >
              <span>Status</span>
              {renderSortIcon("status")}
            </th>
            <th
              className="sa-table__th sa-table__th--sortable"
              onClick={() => onSort?.("date")}
            >
              <span>Last Executed</span>
              {renderSortIcon("date")}
            </th>
            <th className="sa-table__th sa-table__th--actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* Skeleton Loading State */}
          {loading &&
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="sa-table__skeleton-row">
                <td className="sa-table__td"><div className="sa-skeleton sa-skeleton--icon" /></td>
                <td className="sa-table__td">
                  <div className="sa-skeleton sa-skeleton--text" style={{ width: "30%", marginBottom: "4px" }} />
                  <div className="sa-skeleton sa-skeleton--text" style={{ width: "80%" }} />
                </td>
                <td className="sa-table__td"><div className="sa-skeleton sa-skeleton--badge" /></td>
                <td className="sa-table__td"><div className="sa-skeleton sa-skeleton--text" style={{ width: "60%" }} /></td>
                <td className="sa-table__td"><div className="sa-skeleton sa-skeleton--badge" /></td>
                <td className="sa-table__td"><div className="sa-skeleton sa-skeleton--text" style={{ width: "70%" }} /></td>
                <td className="sa-table__td"><div className="sa-skeleton sa-skeleton--actions" /></td>
              </tr>
            ))}

          {/* Error State */}
          {!loading && error && (
            <tr>
              <td colSpan={7} className="sa-table__state sa-table__state--error">
                <div className="sa-table__empty-box">
                  <div className="sa-table__empty-icon sa-table__empty-icon--error">
                    <i className="bi bi-exclamation-circle" />
                  </div>
                  <h4 className="sa-table__empty-title">Failed to load activities</h4>
                  <p className="sa-table__empty-text">{error}</p>
                  {onRetry && (
                    <button
                      type="button"
                      className="sa-table__empty-btn"
                      onClick={onRetry}
                    >
                      <i className="bi bi-arrow-clockwise" /> Try Again
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )}

          {/* Empty State */}
          {!loading && !error && activities.length === 0 && (
            <tr>
              <td colSpan={7} className="sa-table__state">
                <div className="sa-table__empty-box">
                  <div className="sa-table__empty-icon">
                    <i className="bi bi-search" />
                  </div>
                  <h4 className="sa-table__empty-title">No activities found</h4>
                  <p className="sa-table__empty-text">
                    No activities match your current filter or search criteria.
                  </p>
                  <div className="sa-table__empty-actions">
                    {onClearFilters && (
                      <button
                        type="button"
                        className="sa-table__empty-btn sa-table__empty-btn--secondary"
                        onClick={onClearFilters}
                      >
                        Clear Filters
                      </button>
                    )}
                    {onAddActivity && (
                      <button
                        type="button"
                        className="sa-table__empty-btn sa-table__empty-btn--primary"
                        onClick={onAddActivity}
                      >
                        <i className="bi bi-plus" /> Add Activity
                      </button>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          )}

          {/* Activity Rows */}
          {!loading &&
            !error &&
            activities.map((act) => {
              const id = act.sprintActivityId;
              return (
                <ActivityRow
                  key={id}
                  activity={act}
                  isSelected={selectedId != null && selectedId === id}
                  onSelect={onSelectActivity}
                  editorOpen={editorOpen}
                  onAddScenario={onAddScenario}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ActivitiesTable;
