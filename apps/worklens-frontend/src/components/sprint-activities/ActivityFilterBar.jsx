import "../../styles/sprint-activities/ActivityFilterBar.css";

const TABS = [
  { key: "all", label: "All Activities" },
  { key: "not-once", label: "Not Executed" },
  { key: "atleast-once", label: "Executed Atleast Once" },
  { key: "need-again", label: "Need to Execute Again" },
];

/**
 * ActivityFilterBar
 * Consolidated filter bar with status tabs, dynamic counts, search input,
 * and type/status dropdowns.
 */
function ActivityFilterBar({
  activeTab,
  onTabChange,
  searchText,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  onClearFilters,
  total,
  totalFiltered,
  tabCounts = {},
}) {
  const hasActiveFilters =
    Boolean(searchText) ||
    Boolean(typeFilter) ||
    Boolean(statusFilter) ||
    activeTab !== "all";

  return (
    <div className="sa-filter">
      {/* Tabs Row */}
      <div className="sa-filter__tabs" role="tablist">
        {TABS.map((tab) => {
          const count = tabCounts[tab.key] ?? null;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              className={`sa-filter__tab${isActive ? " sa-filter__tab--active" : ""}`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.key !== "all" && (
                <span
                  className={`sa-filter__tab-dot sa-filter__tab-dot--${tab.key}`}
                />
              )}
              <span>{tab.label}</span>
              {count !== null && (
                <span className="sa-filter__tab-badge">{count}</span>
              )}
            </button>
          );
        })}

        <div className="sa-filter__stats">
          <span className="sa-filter__total">
            Showing <strong>{totalFiltered}</strong> of {total}
          </span>
        </div>
      </div>

      {/* Filter inputs row */}
      <div className="sa-filter__row">
        {/* Search */}
        <div className="sa-filter__field sa-filter__field--search">
          <div className="sa-filter__search-box">
            <i className="bi bi-search sa-filter__search-icon" />
            <input
              className="sa-filter__input sa-filter__input--search"
              type="text"
              placeholder="Search by title, activity ID, or keywords..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchText && (
              <button
                type="button"
                className="sa-filter__search-clear"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <i className="bi bi-x" />
              </button>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="sa-filter__field sa-filter__field--select">
          <label className="sa-filter__label">Type</label>
          <select
            className="sa-filter__select"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Parent">Parent Activity</option>
            <option value="Scenario">Child Scenario</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sa-filter__field sa-filter__field--select">
          <label className="sa-filter__label">Status</label>
          <select
            className="sa-filter__select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Executed (Passed)">Executed (Passed)</option>
            <option value="Executed (Failed)">Executed (Failed)</option>
            <option value="Not Executed">Not Executed</option>
            <option value="Executed Atleast Once">Executed Atleast Once</option>
            <option value="Need to Execute Again">Need to Execute Again</option>
          </select>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="sa-filter__clear"
            onClick={onClearFilters}
            title="Reset all active filters"
          >
            <i className="bi bi-arrow-counterclockwise" /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default ActivityFilterBar;
