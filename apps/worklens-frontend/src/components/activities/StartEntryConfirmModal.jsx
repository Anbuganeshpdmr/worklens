import { useEffect } from "react";

export default function StartEntryConfirmModal({
  isOpen,
  activity,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !activity) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="gen-act-confirm-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="gen-act-confirm-dialog">
        {/* Modal Header */}
        <div className="gen-act-confirm-header">
          <div className="gen-act-confirm-header__title-group">
            <div className="gen-act-confirm-icon-badge" aria-hidden="true">
              <i className="bi bi-play-circle-fill"></i>
            </div>
            <h3 id="confirm-modal-title" className="gen-act-confirm-title">
              Start Activity Entry
            </h3>
          </div>
          <button
            type="button"
            className="gen-act-confirm-close"
            onClick={onCancel}
            aria-label="Close confirmation"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="gen-act-confirm-body">
          <p className="gen-act-confirm-message">
            Are you sure you want to start a new entry for this general activity?
          </p>

          <div className="gen-act-confirm-card">
            <div className="gen-act-confirm-card__row">
              <span className="gen-act-confirm-card__id">
                #{activity.activityId}
              </span>
              {activity.categoryName && (
                <span
                  className="gen-act-category-pill"
                  style={{
                    borderColor: activity.categoryColourCode || "#cbd5e1",
                    backgroundColor: activity.categoryColourCode
                      ? `${activity.categoryColourCode}14`
                      : "#f1f5f9",
                    color: activity.categoryColourCode || "#475569",
                  }}
                >
                  <span
                    className="gen-act-category-pill__dot"
                    style={{
                      backgroundColor:
                        activity.categoryColourCode || "#94a3b8",
                    }}
                  />
                  {activity.categoryName}
                </span>
              )}
            </div>

            <div className="gen-act-confirm-card__title">
              {activity.title}
            </div>

            {activity.description && activity.description !== "--" && (
              <p className="gen-act-confirm-card__desc">
                {activity.description}
              </p>
            )}
          </div>

          <div className="gen-act-confirm-note">
            <i className="bi bi-info-circle-fill"></i>
            <span>
              Starting an entry will begin tracking your work against this activity.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="gen-act-confirm-footer">
          <button
            type="button"
            className="gen-act-confirm-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="gen-act-confirm-btn-confirm"
            onClick={() => onConfirm(activity)}
          >
            <i className="bi bi-play-fill"></i>
            Start Entry
          </button>
        </div>
      </div>
    </div>
  );
}
