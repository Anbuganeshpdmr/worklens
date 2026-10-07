import { useState } from "react";
import "../styles/SprintList.css";
import { lightenHexColor } from "../utils/colorUtils";
import SegmentedRowChart from "./../components/reports/SegmentedRowChart";

function SprintList({
  sprints,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [activeTabs, setActiveTabs] = useState({});

  if (isLoading) {
    return <div className="sprint-list__loader">Loading sprints...</div>;
  }

  if (!sprints || sprints.length === 0) {
    return (
      <div className="sprint-list__empty">
        <p>No sprints found. Click "Add Sprint" to create one.</p>
      </div>
    );
  }

  return (
    <div className="sprint-list">
      {sprints.map((sprint, index) => {
        const sprintId = sprint.id || sprint.sprintId;
        const statusColor = sprint.currentStatus?.colourCode || "#EAEAEA";
        const statusName = sprint.currentStatus?.displayName || "";

        const activeTab = activeTabs[sprintId] || "status";

        const countItems =
          activeTab === "status"
            ? sprint.statusCounts || []
            : sprint.typeCounts || [];

        return (
          <div
            key={sprintId}
            className="sprint-card"
            style={{
              "--sprint-status-color": statusColor,
            }}
          >
            <div
              className="sprint-card__status-indicator"
              style={{
                backgroundColor: statusColor,
              }}
            />

            <div className="sprint-card__header">
              <div className="sprint-card__title-section">
                {sprint.projectName && (
                  <div className="sprint-card__project-name">
                    {sprint.projectName}
                  </div>
                )}

                <h3 className="sprint-card__title">
                  {sprint.sprintName || sprint.name}
                </h3>
              </div>

              <div className="sprint-card__header-actions">
                {sprint.createdOn && (
                  <span className="sprint-card__created-date">
                    Created on:{" "}
                    {new Date(sprint.createdOn).toLocaleDateString("en-GB")}
                  </span>
                )}

                {statusName && (
                  <span
                    className="sprint-card__status"
                    style={{
                      backgroundColor: lightenHexColor(statusColor, 80),
                      color: statusColor,
                      borderColor: statusColor,
                    }}
                  >
                    {statusName}
                  </span>
                )}

                <div className="sprint-card__menu-wrapper">
                  <button
                    type="button"
                    className="sprint-card__menu-btn"
                    aria-label="Sprint actions"
                    onClick={() => {
                      setOpenMenuId(openMenuId === sprintId ? null : sprintId);
                    }}
                  >
                    ⋮
                  </button>

                  {openMenuId === sprintId && (
                    <div
                      className={`sprint-card__menu ${
                        index === sprints.length - 1
                          ? "sprint-card__menu--top"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="sprint-card__menu-item"
                        onClick={() => {
                          console.log("Requirements clicked", sprint);
                          setOpenMenuId(null);
                        }}
                      >
                        📄 Requirements
                      </button>

                      <button
                        type="button"
                        className="sprint-card__menu-item"
                        onClick={() => {
                          onEdit(sprint);
                          setOpenMenuId(null);
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sprint-card__counts-row">
              <div className="sprint-card__counts">
                {countItems.length > 0 ? (
                  <SegmentedRowChart data={countItems} />
                ) : (
                  // countItems.map((item) => (
                  //   <span key={item.name} className="sprint-card__count-item">
                  //     <span className="sprint-card__count-name">
                  //       {item.name}
                  //     </span>

                  //     <span className="sprint-card__count-value">
                  //       : {item.count}
                  //     </span>
                  //   </span>
                  // ))
                  <span className="sprint-card__no-counts">
                    No {activeTab} data available
                  </span>
                )}
              </div>

              <div className="sprint-card__count-tabs">
                <button
                  type="button"
                  className={`sprint-card__count-tab ${
                    activeTab === "status" ? "active" : ""
                  }`}
                  onClick={() =>
                    setActiveTabs((prev) => ({
                      ...prev,
                      [sprintId]: "status",
                    }))
                  }
                >
                  Status
                </button>

                <button
                  type="button"
                  className={`sprint-card__count-tab ${
                    activeTab === "type" ? "active" : ""
                  }`}
                  onClick={() =>
                    setActiveTabs((prev) => ({
                      ...prev,
                      [sprintId]: "type",
                    }))
                  }
                >
                  Type
                </button>
              </div>
            </div>
            <div className="sprint-card__body">
              {sprint.startDate && (
                <div className="sprint-card__field">
                  <span className="sprint-card__label">Start Date:</span>

                  <span className="sprint-card__value">
                    {new Date(sprint.startDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              )}

              {sprint.endDate && (
                <div className="sprint-card__field">
                  <span className="sprint-card__label">End Date:</span>

                  <span className="sprint-card__value">
                    {new Date(sprint.endDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              )}

              {sprint.description && (
                <div className="sprint-card__field sprint-card__field--full-width">
                  <span className="sprint-card__label">Description:</span>

                  <p className="sprint-card__description">
                    {sprint.description}
                  </p>
                </div>
              )}
            </div>

            {sprint.actions && (
              <div className="sprint-card__actions">
                {sprint.actions.map((action, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`sprint-card__action-btn sprint-card__action-btn--${
                      action.type || "default"
                    }`}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="sprint-list__pagination">
          <button
            className="sprint-list__pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="sprint-list__pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="sprint-list__pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default SprintList;
