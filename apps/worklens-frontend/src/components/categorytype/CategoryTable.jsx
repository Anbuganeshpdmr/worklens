import { useState } from "react";
import { updateWorkCategory } from "../../api/category";
import CategoryTypeConfirmModal from "./CategoryTypeConfirmModal";

const CategoryTable = ({ categories = [], onEdit, setCategories }) => {
  const [confirmingCategory, setConfirmingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggleClick = (category) => {
    // If already enabled, do nothing as clicking on an enabled one is a no-op
    if (category.work) return;
    setError("");
    setConfirmingCategory(category);
  };

  const handleConfirmToggle = async () => {
    if (!confirmingCategory) return;
    try {
      setIsLoading(true);
      const data = await updateWorkCategory(confirmingCategory.id);
      setCategories(data);
      setConfirmingCategory(null);
    } catch (err) {
      console.error("Error updating work category:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update work category status.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    if (!isLoading) {
      setConfirmingCategory(null);
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
        {categories.length === 0 ? (
          <div className="gen-act-empty-state">
            <div className="gen-act-empty-state__icon" aria-hidden="true">
              <i className="bi bi-folder-x" />
            </div>
            <h3 className="gen-act-empty-state__title">No categories available</h3>
            <p className="gen-act-empty-state__desc">
              Create your first category to start organizing your activities and project tasks.
            </p>
          </div>
        ) : (
          <div className="gen-act-table-responsive cat-type-table-responsive">
            <table className="gen-act-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ width: "120px" }}>Colour</th>
                  <th style={{ width: "130px" }}>Work</th>
                  <th className="th-actions" style={{ width: "90px" }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => {
                  const isWork = Boolean(category.work);

                  return (
                    <tr key={category.id}>
                      <td className="td-title">
                        <span className="cat-type-name-cell">
                          {category.name}
                        </span>
                      </td>

                      <td>
                        <div className="cat-type-colour-cell">
                          <span
                            className="category-colour"
                            style={{
                              backgroundColor: category.colourCode || "#cccccc",
                            }}
                            title={category.colourCode || ""}
                          />
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`cat-type-flag-btn ${
                            isWork
                              ? "cat-type-flag-btn--active"
                              : "cat-type-flag-btn--inactive"
                          }`}
                          onClick={() => handleToggleClick(category)}
                          disabled={isWork}
                          title={
                            isWork
                              ? "Currently active Work Category"
                              : `Click to set "${category.name}" as Work Category`
                          }
                        >
                          <i
                            className={
                              isWork
                                ? "bi bi-check-circle-fill"
                                : "bi bi-dash-circle"
                            }
                          />
                          <span>{isWork ? "Yes" : "No"}</span>
                        </button>
                      </td>

                      <td className="td-actions">
                        <div className="gen-act-actions-group">
                          <button
                            type="button"
                            className="gen-act-btn-edit"
                            onClick={() => onEdit(category)}
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
        isOpen={Boolean(confirmingCategory)}
        item={confirmingCategory}
        entityType="category"
        onConfirm={handleConfirmToggle}
        onCancel={handleCancelConfirm}
        isLoading={isLoading}
      />
    </>
  );
};

export default CategoryTable;
