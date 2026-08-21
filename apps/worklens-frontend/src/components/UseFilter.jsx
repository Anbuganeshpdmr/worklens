import React, { useState } from "react";

function UserFilter({
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleClear = () => {
    setRoleFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="um-filter-wrapper">

      <button
        type="button"
        className="um-filter-btn"
        onClick={() => setFilterOpen((prev) => !prev)}
      >
        ▼ Filter
      </button>

      {filterOpen && (
        <div className="um-filter-dropdown">

          {/* ROLE */}
          <div className="filter-group">
            <label>Role</label>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Member">Member</option>
              <option value="TL">TL</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="filter-group">
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* CLEAR */}
          <button
            type="button"
            className="clear-filter-btn"
            onClick={handleClear}
          >
            Clear Filter
          </button>

        </div>
      )}
    </div>
  );
}

export default UserFilter;