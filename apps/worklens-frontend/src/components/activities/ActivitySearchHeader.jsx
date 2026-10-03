import { useState } from "react";

/**
 * ActivitySearchHeader
 *
 * Dedicated search/filter bar for the ActivityList table.
 * Fields: id, title, description, createdBy, createdBetween (from/to), updatedBetween (from/to).
 *
 * Props:
 *   filters        — current filter values object
 *   onFiltersChange — callback(updatedFilters) called on every field change
 *   onSearch       — callback() triggered when the user clicks "Search"
 *   onReset        — callback() to clear all filters
 *   totalCount     — total rows (unfiltered)
 *   filteredCount  — rows after applying active filters
 */
export default function ActivitySearchHeader({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  totalCount,
  filteredCount,
}) {
  const [expanded, setExpanded] = useState(true);

  const hasActiveFilters =
    filters.id?.trim() ||
    filters.title?.trim() ||
    filters.description?.trim() ||
    filters.createdBy?.trim() ||
    filters.createdFrom?.trim() ||
    filters.createdTo?.trim() ||
    filters.updatedFrom?.trim() ||
    filters.updatedTo?.trim();

  const handleFieldChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="act-search-header">
      {/* ── Top bar — entire row is clickable ── */}
      <button
        type="button"
        className="act-search-header__bar"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
        aria-controls="act-search-fields-panel"
      >
        <div className="act-search-header__bar-left">
          <i className="bi bi-funnel-fill act-search-header__icon" aria-hidden="true" />
          <span className="act-search-header__label">Search &amp; Filter</span>
          {hasActiveFilters && (
            <span className="act-search-header__active-dot" title="Filters active" />
          )}
        </div>

        <div className="act-search-header__bar-right">
          <span className="act-search-results-counter">
            {hasActiveFilters ? (
              <>
                Showing <strong>{filteredCount}</strong> of {totalCount}
              </>
            ) : (
              <>
                <strong>{totalCount}</strong>{" "}
                {totalCount === 1 ? "activity" : "activities"}
              </>
            )}
          </span>

          {/* Chevron indicates expand / collapse state */}
          <span className="act-search-header__toggle" aria-hidden="true">
            <i className={`bi ${expanded ? "bi-chevron-up" : "bi-chevron-down"}`} />
          </span>
        </div>
      </button>

      {/* ── Filter fields ── */}
      {expanded && (
        <div id="act-search-fields-panel" className="act-search-header__fields">
          {/* Row 1: ID · Title · Description · Created By */}
          <div className="act-search-fields-row">
            {/* ID */}
            <div className="act-search-field act-search-field--sm">
              <label className="act-search-field__label" htmlFor="asf-id">
                ID
              </label>
              <input
                id="asf-id"
                type="number"
                min="0"
                className="act-search-field__input"
                placeholder="e.g. 42"
                value={filters.id}
                onChange={(e) => handleFieldChange("id", e.target.value)}
                onKeyDown={handleKeyDown}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>

            {/* Title */}
            <div className="act-search-field act-search-field--md">
              <label className="act-search-field__label" htmlFor="asf-title">
                Title
              </label>
              <input
                id="asf-title"
                type="text"
                className="act-search-field__input"
                placeholder="Search by title…"
                value={filters.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Description */}
            <div className="act-search-field act-search-field--md">
              <label className="act-search-field__label" htmlFor="asf-desc">
                Description
              </label>
              <input
                id="asf-desc"
                type="text"
                className="act-search-field__input"
                placeholder="Search in description…"
                value={filters.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Created By */}
            <div className="act-search-field act-search-field--sm">
              <label className="act-search-field__label" htmlFor="asf-createdBy">
                Created By
              </label>
              <input
                id="asf-createdBy"
                type="text"
                className="act-search-field__input"
                placeholder="Username…"
                value={filters.createdBy}
                onChange={(e) =>
                  handleFieldChange("createdBy", e.target.value)
                }
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Row 2: Created Between · Updated Between */}
          <div className="act-search-fields-row">
            {/* Created Between */}
            <div className="act-search-field-group">
              <span className="act-search-field-group__title">
                <i className="bi bi-calendar3" aria-hidden="true" />
                Created Between
              </span>
              <div className="act-search-field-group__dates">
                <div className="act-search-field act-search-field--date">
                  <label
                    className="act-search-field__label"
                    htmlFor="asf-created-from"
                  >
                    From
                  </label>
                  <input
                    id="asf-created-from"
                    type="date"
                    className="act-search-field__input"
                    value={filters.createdFrom}
                    onChange={(e) =>
                      handleFieldChange("createdFrom", e.target.value)
                    }
                  />
                </div>
                <div className="act-search-field act-search-field--date">
                  <label
                    className="act-search-field__label"
                    htmlFor="asf-created-to"
                  >
                    To
                  </label>
                  <input
                    id="asf-created-to"
                    type="date"
                    className="act-search-field__input"
                    value={filters.createdTo}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleFieldChange("createdTo", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Updated Between */}
            <div className="act-search-field-group">
              <span className="act-search-field-group__title">
                <i className="bi bi-calendar3" aria-hidden="true" />
                Updated Between
              </span>
              <div className="act-search-field-group__dates">
                <div className="act-search-field act-search-field--date">
                  <label
                    className="act-search-field__label"
                    htmlFor="asf-updated-from"
                  >
                    From
                  </label>
                  <input
                    id="asf-updated-from"
                    type="date"
                    className="act-search-field__input"
                    value={filters.updatedFrom}
                    onChange={(e) =>
                      handleFieldChange("updatedFrom", e.target.value)
                    }
                  />
                </div>
                <div className="act-search-field act-search-field--date">
                  <label
                    className="act-search-field__label"
                    htmlFor="asf-updated-to"
                  >
                    To
                  </label>
                  <input
                    id="asf-updated-to"
                    type="date"
                    className="act-search-field__input"
                    value={filters.updatedTo}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleFieldChange("updatedTo", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="act-search-header__actions">
            <button
              type="button"
              className="act-search-btn act-search-btn--primary"
              onClick={onSearch}
            >
              <i className="bi bi-search" aria-hidden="true" />
              Search
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className="act-search-btn act-search-btn--ghost"
                onClick={onReset}
              >
                <i className="bi bi-x-circle" aria-hidden="true" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
