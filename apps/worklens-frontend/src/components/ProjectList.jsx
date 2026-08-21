import { useState } from "react";
import "../styles/ProjectList.css";
import { lightenHexColor } from "../utils/colorUtils";

function ProjectList({
  projects,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (isLoading) {
    return <div className="project-list__loader">Loading projects...</div>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="project-list__empty">
        <p>No projects found. Click "Add Project" to create one.</p>
      </div>
    );
  }

  return (
    <div className="project-list">
      {projects.map((project, index) => {
        const statusName = project.currentStatus?.statusName || "";
        const statusColor = project.currentStatus?.colourCode || "#EAEAEA";

        const statusIndicatorColor = project.currentStatus?.colourCode || "#E2E3E5";

        return (
          <div
            key={project.id || index}
            className="project-card"
            style={{
              "--project-status-color": statusIndicatorColor,
            }}
          >
            {/* Right status indicator */}
            <div
              className="project-card__status-indicator"
              style={{
                backgroundColor: statusIndicatorColor,
              }}
            />

            {/* Header */}
            <div className="project-card__header">
              <div className="project-card__title-section">
                <h3 className="project-card__title">
                  {project.projectName || project.name}
                </h3>
              </div>

              <div className="project-card__header-actions">
                {/* Created Date */}
                {project.createdOn && (
                  <span className="project-card__created-date">
                    Created on:{" "}
                    {new Date(project.createdOn).toLocaleDateString("en-GB")}
                  </span>
                )}

                {/* Status */}
                {statusName && (
                  <span
                    className="project-card__status"
                    style={{
                      backgroundColor: lightenHexColor(statusColor, 80),
                      color: statusColor,
                      borderColor: statusColor,
                    }}
                  >
                    {statusName}
                  </span>
                )}

                {/* Menu */}
                <div className="project-card__menu">
                  <button
                    type="button"
                    className="project-card__menu-btn"
                    aria-label="Project actions"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === index ? null : index
                      )
                    }
                  >
                    ⋮
                  </button>

                  {openMenuId === index && (
  <div
    className={`project-card__dropdown ${
      index === projects.length - 1
        ? "project-card__dropdown--top"
        : ""
    }`}
  >
    <button
      type="button"
      onClick={() => {
        console.log("Requirements clicked", project);
        setOpenMenuId(null);
      }}
    >
      📄 Requirements
    </button>

    <button
      type="button"
      onClick={() => {
        onEdit(project);
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

            {/* Body */}
            <div className="project-card__body">
              {project.projectType && (
                <div className="project-card__field">
                  <span className="project-card__label">
                    Type:
                  </span>

                  <span className="project-card__value">
                    {project.projectType}
                  </span>
                </div>
              )}

              {/* Created By removed */}

              {project.description && (
                <div className="project-card__field project-card__field--full-width">
                  <span className="project-card__label">
                    Description:
                  </span>

                  <p className="project-card__description">
                    {project.description}
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="project-card__stats">
              {project.requirementsCount !== undefined && (
                <div className="project-card__stat">
                  <span className="project-card__stat-value">
                    {project.requirementsCount}
                  </span>

                  <span className="project-card__stat-label">
                    Requirements
                  </span>
                </div>
              )}

              {project.activitiesCount !== undefined && (
                <div className="project-card__stat">
                  <span className="project-card__stat-value">
                    {project.activitiesCount}
                  </span>

                  <span className="project-card__stat-label">
                    Activities
                  </span>
                </div>
              )}

              {project.testRunsCount !== undefined && (
                <div className="project-card__stat">
                  <span className="project-card__stat-value">
                    {project.testRunsCount}
                  </span>

                  <span className="project-card__stat-label">
                    Test Runs
                  </span>
                </div>
              )}

              {project.openDefectsCount !== undefined && (
                <div className="project-card__stat">
                  <span className="project-card__stat-value">
                    {project.openDefectsCount}
                  </span>

                  <span className="project-card__stat-label">
                    Open Defects
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            {project.actions && (
              <div className="project-card__actions">
                {project.actions.map((action, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`project-card__action-btn project-card__action-btn--${
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="project-list__pagination">
          <button
            className="project-list__pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="project-list__pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="project-list__pagination-btn"
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

export default ProjectList;
