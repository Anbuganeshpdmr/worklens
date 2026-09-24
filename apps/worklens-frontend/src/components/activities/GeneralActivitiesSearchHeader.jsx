import { useState, useRef, useEffect } from "react";

export default function GeneralActivitiesSearchHeader({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategoryIds,
  onCategoryToggle,
  onSelectAllCategories,
  onClearCategoryFilter,
  onResetAllFilters,
  totalCount,
  filteredCount,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close category dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const hasActiveFilters =
    Boolean(searchTerm?.trim()) || (selectedCategoryIds && selectedCategoryIds.length > 0);

  // Map selected category objects for active chips
  const selectedCategoriesList = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.id),
  );

  return (
    <div className="gen-act-search-header">
      <div className="gen-act-search-header__main">
        <div className="gen-act-search-header__controls">
          {/* Title Search Input */}
          <div className="gen-act-search-box">
            <i className="bi bi-search gen-act-search-box__icon" aria-hidden="true" />
            <input
              type="text"
              className="gen-act-search-box__input"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search activities by title"
            />
            {searchTerm && (
              <button
                type="button"
                className="gen-act-search-box__clear"
                onClick={() => onSearchChange("")}
                title="Clear search"
                aria-label="Clear search"
              >
                <i className="bi bi-x-circle-fill" />
              </button>
            )}
          </div>

          {/* Category Multiselect Filter */}
          <div className="gen-act-filter-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={`gen-act-filter-trigger ${
                selectedCategoryIds.length > 0 ? "active" : ""
              }`}
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <i className="bi bi-funnel" aria-hidden="true" />
              <span>Category</span>
              {selectedCategoryIds.length > 0 && (
                <span className="gen-act-filter-badge">
                  {selectedCategoryIds.length}
                </span>
              )}
              <i
                className={`bi ${dropdownOpen ? "bi-chevron-up" : "bi-chevron-down"}`}
                style={{ fontSize: "11px", marginLeft: "2px" }}
                aria-hidden="true"
              />
            </button>

            {dropdownOpen && (
              <div className="gen-act-filter-menu" role="menu">
                <div className="gen-act-filter-menu__header">
                  <span>Filter by Category</span>
                  <div className="gen-act-filter-menu__actions">
                    <button
                      type="button"
                      className="gen-act-filter-text-btn"
                      onClick={onSelectAllCategories}
                    >
                      Select all
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      className="gen-act-filter-text-btn"
                      onClick={onClearCategoryFilter}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <ul className="gen-act-filter-menu__list">
                  {categories.length === 0 ? (
                    <li
                      style={{
                        padding: "12px 14px",
                        fontSize: "12.5px",
                        color: "#94a3b8",
                      }}
                    >
                      No categories available
                    </li>
                  ) : (
                    categories.map((cat) => {
                      const isChecked = selectedCategoryIds.includes(cat.id);
                      return (
                        <li
                          key={cat.id}
                          className="gen-act-filter-menu__item"
                          onClick={() => onCategoryToggle(cat.id)}
                        >
                          <input
                            type="checkbox"
                            className="gen-act-filter-checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent onClick
                            aria-label={cat.name}
                          />
                          <span
                            className="gen-act-cat-dot"
                            style={{
                              backgroundColor: cat.colourCode || "#94a3b8",
                            }}
                          />
                          <span className="gen-act-filter-cat-name" title={cat.name}>
                            {cat.name}
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="gen-act-search-header__meta">
          <span className="gen-act-results-counter">
            {hasActiveFilters ? (
              <>
                Showing <strong>{filteredCount}</strong> of {totalCount} activities
              </>
            ) : (
              <>
                Total <strong>{totalCount}</strong> {totalCount === 1 ? "activity" : "activities"}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="gen-act-active-chips">
          <span className="gen-act-active-chips__label">Active filters:</span>

          {searchTerm.trim() && (
            <span className="gen-act-chip">
              <i className="bi bi-search" style={{ fontSize: "11px" }} />
              <span>Title: "{searchTerm.trim()}"</span>
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Remove title filter"
              >
                <i className="bi bi-x" />
              </button>
            </span>
          )}

          {selectedCategoriesList.map((cat) => (
            <span key={cat.id} className="gen-act-chip">
              <span
                className="gen-act-cat-dot"
                style={{
                  backgroundColor: cat.colourCode || "#94a3b8",
                  width: "8px",
                  height: "8px",
                }}
              />
              <span>{cat.name}</span>
              <button
                type="button"
                onClick={() => onCategoryToggle(cat.id)}
                aria-label={`Remove ${cat.name} filter`}
              >
                <i className="bi bi-x" />
              </button>
            </span>
          ))}

          <button
            type="button"
            className="gen-act-chip--reset"
            onClick={onResetAllFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
