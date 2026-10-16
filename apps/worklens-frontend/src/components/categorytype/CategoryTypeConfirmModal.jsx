import { useEffect } from "react";

export default function CategoryTypeConfirmModal({
  isOpen,
  item,
  entityType = "type", // "type" | "category"
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, isLoading]);

  if (!isOpen || !item) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  const isCategory = entityType === "category";
  const flagName = isCategory ? "Work" : "General";

  // Header Title
  const modalTitle = isCategory
    ? "Set Active Work Category"
    : "Set Active General Type";

  // Modal Message
  const confirmMessage = isCategory
    ? `Are you sure you want to set "${item.name}" as the active Work Category? This will automatically deactivate the previous work category.`
    : `Are you sure you want to set "${item.name}" as the active General Type? This will automatically deactivate the previous general type.`;

  // Explanatory Note
  const noteMessage = isCategory
    ? "Only one category can be active as the Work Category at a time. Activating this will switch the system designation to this category."
    : "Only one type can be active as the General Type at a time. Activating this will switch general activity tracking to this type.";

  const badgeIcon = isCategory ? "bi bi-briefcase-fill" : "bi bi-tags-fill";

  return (
    <div
      className="gen-act-confirm-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-type-modal-title"
    >
      <div className="gen-act-confirm-dialog">
        {/* Modal Header */}
        <div className="gen-act-confirm-header">
          <div className="gen-act-confirm-header__title-group">
            <div className="gen-act-confirm-icon-badge" aria-hidden="true">
              <i className={badgeIcon} />
            </div>
            <h3 id="cat-type-modal-title" className="gen-act-confirm-title">
              {modalTitle}
            </h3>
          </div>
          <button
            type="button"
            className="gen-act-confirm-close"
            onClick={onCancel}
            aria-label="Close confirmation"
            disabled={isLoading}
          >
            <i className="bi bi-x" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="gen-act-confirm-body">
          <p className="gen-act-confirm-message">{confirmMessage}</p>

          <div className="gen-act-confirm-card">
            <div className="cat-type-confirm-card__row">
              <span className="cat-type-confirm-id">
                {isCategory ? "Category" : "Type"} #{item.id}
              </span>
              <span className="cat-type-confirm-title">{item.name}</span>
            </div>

            <div className="cat-type-confirm-card__detail-row">
              <span className="cat-type-confirm-detail-label">Colour:</span>
              <span
                className="category-colour cat-type-colour-swatch-sm"
                style={{ backgroundColor: item.colourCode || "#cccccc" }}
                title={item.colourCode || ""}
              />
            </div>

            <div className="cat-type-confirm-card__transition-row">
              <span className="cat-type-confirm-detail-label">
                {flagName} Status:
              </span>
              <div className="cat-type-transition-group">
                <span className="cat-type-status-tag cat-type-status-tag--inactive">
                  <i className="bi bi-dash-circle" />
                  No
                </span>

                <i className="bi bi-arrow-right cat-type-transition-arrow" />

                <span className="cat-type-status-tag cat-type-status-tag--active">
                  <i className="bi bi-check-circle-fill" />
                  Yes (Active)
                </span>
              </div>
            </div>
          </div>

          <div className="gen-act-confirm-note">
            <i className="bi bi-info-circle-fill" />
            <span>{noteMessage}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="gen-act-confirm-footer">
          <button
            type="button"
            className="gen-act-confirm-btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="gen-act-confirm-btn-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                />
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check2" />
                {isCategory ? "Set as Work Category" : "Set as General Type"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
