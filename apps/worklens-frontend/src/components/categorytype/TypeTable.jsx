import { useState } from "react";
import { updateGeneralType } from "../../api/type";
import CategoryTypeConfirmModal from "./CategoryTypeConfirmModal";

const TypeTable = ({ types = [], onEdit, setTypes }) => {
  const [confirmingType, setConfirmingType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggleClick = (type) => {
    // If already enabled, do nothing as clicking on an enabled one is a no-op
    if (type.general) return;
    setError("");
    setConfirmingType(type);
  };

  const handleConfirmToggle = async () => {
    if (!confirmingType) return;
    try {
      setIsLoading(true);
      const data = await updateGeneralType(confirmingType.id);
      setTypes(data);
      setConfirmingType(null);
    } catch (err) {
      console.error("Error updating general type:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update general type status.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    if (!isLoading) {
      setConfirmingType(null);
    }
  };

  return (
    <>
      {/* Error Alert */}
      {error && (
        <div className="gen-act-alert" role="alert">
          <div className="gen-act-alert__content">
            <i className="bi bi-exclamation-circle-fill" />
            <span>
              <strong>Error:</strong> {error}
            </span>
          </div>
          <button
            type="button"
            className="gen-act-alert__close"
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}

      <div className="gen-act-table-card cat-type-table-card">
        {types.length === 0 ? (
          <div className="gen-act-empty-state">
            <div className="gen-act-empty-state__icon" aria-hidden="true">
              <i className="bi bi-tags" />
            </div>
            <h3 className="gen-act-empty-state__title">No types available</h3>
            <p className="gen-act-empty-state__desc">
              Create your first activity type to categorize your tasks and entries.
            </p>
          </div>
        ) : (
          <div className="gen-act-table-responsive cat-type-table-responsive">
            <table className="gen-act-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ width: "120px" }}>Colour</th>
                  <th style={{ width: "130px" }}>General</th>
                  <th className="th-actions" style={{ width: "90px" }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {types.map((type) => {
                  const isGeneral = Boolean(type.general);

                  return (
                    <tr key={type.id}>
                      <td className="td-title">
                        <span className="cat-type-name-cell">{type.name}</span>
                      </td>

                      <td>
                        <div className="cat-type-colour-cell">
                          <span
                            className="category-colour"
                            style={{
                              backgroundColor: type.colourCode || "#cccccc",
                            }}
                            title={type.colourCode || ""}
                          />
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`cat-type-flag-btn ${
                            isGeneral
                              ? "cat-type-flag-btn--active"
                              : "cat-type-flag-btn--inactive"
                          }`}
                          onClick={() => handleToggleClick(type)}
                          disabled={isGeneral}
                          title={
                            isGeneral
                              ? "Currently active General Type"
                              : `Click to set "${type.name}" as General Type`
                          }
                        >
                          <i
                            className={
                              isGeneral
                                ? "bi bi-check-circle-fill"
                                : "bi bi-dash-circle"
                            }
                          />
                          <span>{isGeneral ? "Yes" : "No"}</span>
                        </button>
                      </td>

                      <td className="td-actions">
                        <div className="gen-act-actions-group">
                          <button
                            type="button"
                            className="gen-act-btn-edit"
                            onClick={() => onEdit(type)}
                            title="Edit"
                            aria-label="Edit"
                          >
                            <i className="bi bi-pencil" />
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

      {/* Confirmation Modal before API call */}
      <CategoryTypeConfirmModal
        isOpen={Boolean(confirmingType)}
        item={confirmingType}
        entityType="type"
        onConfirm={handleConfirmToggle}
        onCancel={handleCancelConfirm}
        isLoading={isLoading}
      />
    </>
  );
};

export default TypeTable;
