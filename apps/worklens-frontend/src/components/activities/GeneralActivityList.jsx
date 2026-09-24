import { useState } from "react";
import StartEntryConfirmModal from "./StartEntryConfirmModal";

export default function GeneralActivityList({
  activities,
  onEditActivity,
  onStartEntry,
  onResetFilters,
  onNewActivity,
  isFiltered = false,
}) {
  const [confirmingActivity, setConfirmingActivity] = useState(null);

  const handleStartClick = (activity) => {
    setConfirmingActivity(activity);
  };

  const handleConfirmStart = (activity) => {
    setConfirmingActivity(null);
    onStartEntry(activity);
  };

  const handleCancelConfirm = () => {
    setConfirmingActivity(null);
  };

  return (
    <>
      <div className="gen-act-table-card">
        {activities.length === 0 ? (
          <div className="gen-act-empty-state">
            <div className="gen-act-empty-state__icon" aria-hidden="true">
              <i className={isFiltered ? "bi bi-funnel" : "bi bi-journal-x"} />
            </div>
            <h3 className="gen-act-empty-state__title">
              {isFiltered ? "No matching activities found" : "No general activities yet"}
            </h3>
            <p className="gen-act-empty-state__desc">
              {isFiltered
                ? "Try adjusting your title search or clearing category filters to see more results."
                : "Get started by creating your first general activity to track routine work."}
            </p>
            {isFiltered && onResetFilters && (
              <button
                type="button"
                className="gen-act-empty-state__btn"
                onClick={onResetFilters}
              >
                <i className="bi bi-arrow-counterclockwise" />
                Clear Filters
              </button>
            )}
            {!isFiltered && onNewActivity && (
              <button
                type="button"
                className="gen-act-empty-state__btn"
                onClick={onNewActivity}
              >
                <i className="bi bi-plus-lg" />
                Create Activity
              </button>
            )}
          </div>
        ) : (
          <div className="gen-act-table-responsive">
            <table className="gen-act-table">
              <thead>
                <tr>
                  <th style={{ width: "90px" }}>Id</th>
                  <th style={{ width: "180px" }}>Category</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th className="th-actions" style={{ width: "170px" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity) => {
                  const hasColor = Boolean(activity.categoryColourCode);
                  const color = activity.categoryColourCode || "#64748b";

                  return (
                    <tr key={activity.activityId}>
                      <td className="td-id">#{activity.activityId}</td>

                      <td>
                        <span
                          className="gen-act-category-pill"
                          style={{
                            borderColor: hasColor ? color : "#cbd5e1",
                            backgroundColor: hasColor ? `${color}14` : "#f1f5f9",
                            color: hasColor ? color : "#475569",
                          }}
                        >
                          <span
                            className="gen-act-category-pill__dot"
                            style={{ backgroundColor: color }}
                          />
                          {activity.categoryName || "Uncategorized"}
                        </span>
                      </td>

                      <td className="td-title">{activity.title}</td>

                      <td className="td-desc" title={activity.description || ""}>
                        {activity.description && activity.description.trim()
                          ? activity.description
                          : "--"}
                      </td>

                      <td className="td-actions">
                        <div className="gen-act-actions-group">
                          <button
                            type="button"
                            className="gen-act-btn-start"
                            title="Start Entry (E+)"
                            onClick={() => handleStartClick(activity)}
                          >
                            <i className="bi bi-play-fill" />
                            <span>E+</span>
                          </button>

                          <button
                            type="button"
                            className="gen-act-btn-edit"
                            title="Edit Activity"
                            onClick={() => onEditActivity(activity)}
                          >
                            <i className="bi bi-pencil" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal before starting Entry API call */}
      <StartEntryConfirmModal
        isOpen={Boolean(confirmingActivity)}
        activity={confirmingActivity}
        onConfirm={handleConfirmStart}
        onCancel={handleCancelConfirm}
      />
    </>
  );
}
