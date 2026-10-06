import { useState, useMemo, useRef, useEffect } from "react";
import ReportChart from "../reports/ReportChart";
import {
  CriteriaOptions_SprintActivityExecuteList,
  AggregatorOptions_SprintActivityExecuteList,
} from "../reports/CritreriaOptions";
import { exportToExcel } from "../../utils/excelUtils";
import { sprintActivityExcelColumns } from "../../components/reports/ExcelHeaders";

/* ══════════════════════════════════════════════════════════════════════════
   MultiSelect — custom pill-tag dropdown for type / status / currentUser
   ══════════════════════════════════════════════════════════════════════════ */
function MultiSelect({ id, label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeTag = (e, value) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div className="sa-ms" ref={ref}>
      <label className="sa-exec-field__label" htmlFor={id}>
        {label}
      </label>
      {/* Trigger box */}
      <div
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`sa-ms__box${open ? " sa-ms__box--open" : ""}`}
        onClick={() => setOpen((p) => !p)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((p) => !p);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {selected.length === 0 ? (
          <span className="sa-ms__placeholder">All</span>
        ) : (
          <div className="sa-ms__tags">
            {selected.map((v) => (
              <span key={v} className="sa-ms__tag">
                {v}
                <button
                  type="button"
                  className="sa-ms__tag-remove"
                  onClick={(e) => removeTag(e, v)}
                  aria-label={`Remove ${v}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <span className="sa-ms__chevron" aria-hidden="true">
          <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`} />
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <ul className="sa-ms__list" role="listbox" aria-multiselectable="true">
          {options.length === 0 && (
            <li className="sa-ms__list-empty">No options</li>
          )}
          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSelected}
                className={`sa-ms__option${isSelected ? " sa-ms__option--selected" : ""}`}
                onClick={() => toggle(opt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(opt);
                  }
                }}
                tabIndex={0}
              >
                <span className="sa-ms__option-check" aria-hidden="true">
                  {isSelected ? <i className="bi bi-check2" /> : null}
                </span>
                {opt}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ExecuteListHeader
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * Props:
 *   sprintActivities  — full (unfiltered) list; drives chart + dropdown options
 *   filters           — { id, saId, title, parentId, externalTicket, currentEntry,
 *                         types[], statuses[], currentUsers[] }
 *   onFiltersChange   — callback(updatedFilters)
 *   onSearch          — callback()
 *   onReset           — callback()
 *   totalCount          — total rows
 *   filteredCount       — rows after filters
 *   onDownload          — callback() (placeholder, wired up later)
 *   criteriaOptions     — optional override for ReportChart criteria (defaults to CriteriaOptions_SprintActivityExecuteList)
 *   aggregatorOptions   — optional override for ReportChart aggregator (defaults to AggregatorOptions_SprintActivityExecuteList)
 *   defaultCriteria     — optional default criteria key (defaults to "status")
 *   defaultAggregator   — optional default aggregator key (defaults to "count")
 */
export default function ExecuteListHeader({
  sprintActivities, // filtered list  → drives the chart
  allSprintActivities, // full list       → drives dropdown option lists
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  totalCount,
  filteredCount,
  onDownload,
  criteriaOptions = CriteriaOptions_SprintActivityExecuteList,
  aggregatorOptions = AggregatorOptions_SprintActivityExecuteList,
  defaultCriteria = "status",
  defaultAggregator = "count",
}) {
  const [expanded, setExpanded] = useState(true);

  /* ── Derive unique option lists from the FULL list so options never shrink ── */
  const optionSource = allSprintActivities ?? sprintActivities;

  const typeOptions = useMemo(
    () =>
      [
        ...new Set(
          optionSource.map((a) => a.activityType_name).filter(Boolean),
        ),
      ].sort(),
    [optionSource],
  );
  const statusOptions = useMemo(
    () =>
      [
        ...new Set(
          optionSource.map((a) => a.currentStatus_displayName).filter(Boolean),
        ),
      ].sort(),
    [optionSource],
  );
  const userOptions = useMemo(
    () =>
      [
        ...new Set(optionSource.map((a) => a.currentUser).filter(Boolean)),
      ].sort(),
    [optionSource],
  );

  /* ── Active-filter check (arrays count if non-empty) ── */
  const hasActiveFilters =
    filters.id?.trim() ||
    filters.saId?.trim() ||
    filters.title?.trim() ||
    filters.parentId?.trim() ||
    filters.externalTicket?.trim() ||
    filters.currentEntry?.trim() ||
    filters.types?.length > 0 ||
    filters.statuses?.length > 0 ||
    filters.currentUsers?.length > 0;

  const set = (field, value) => onFiltersChange({ ...filters, [field]: value });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const handleExcelDownload = () => {
    exportToExcel(
      sprintActivities,
      sprintActivityExcelColumns,
      "Sprint-Activities",
    );
  };

  return (
    <div className="sa-exec-accordion">
      {/* ── Single toggle bar ── */}
      <button
        type="button"
        className="sa-exec-accordion__bar"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
        aria-controls="sa-exec-accordion-body"
      >
        <div className="sa-exec-accordion__bar-left">
          <i
            className="bi bi-layout-text-sidebar-reverse sa-exec-accordion__bar-icon"
            aria-hidden="true"
          />
          <span className="sa-exec-accordion__bar-label">
            Overview &amp; Filters
          </span>
          {hasActiveFilters && (
            <span
              className="sa-exec-search__active-dot"
              title="Filters active"
            />
          )}
        </div>

        <div className="sa-exec-accordion__bar-right">
          <span className="sa-exec-results-counter">
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
          <span className="sa-exec-search__toggle" aria-hidden="true">
            <i
              className={`bi ${expanded ? "bi-chevron-up" : "bi-chevron-down"}`}
            />
          </span>
        </div>
      </button>

      {/* ── Accordion body ── */}
      {expanded && (
        <div id="sa-exec-accordion-body" className="sa-exec-accordion__body">
          {/* LEFT 60% — Chart */}
          <div className="sa-exec-accordion__chart">
            <div className="sa-exec-accordion__panel-title">
              <i className="bi bi-bar-chart-fill" aria-hidden="true" />
              Activity Overview
            </div>
            <div className="sa-exec-accordion__chart-body">
              <ReportChart
                records={sprintActivities}
                criteriaOptions={criteriaOptions}
                defaultCriteria={defaultCriteria}
                aggregatorOptions={aggregatorOptions}
                defaultAggregator={defaultAggregator}
              />
            </div>
          </div>

          {/* RIGHT 40% — Search */}
          <div className="sa-exec-accordion__search">
            <div className="sa-exec-accordion__panel-title">
              <i className="bi bi-funnel-fill" aria-hidden="true" />
              Search &amp; Filter
            </div>

            <div className="sa-exec-search__fields">
              {/* ── Row 1: Title (full width) ── */}
              <div className="sa-exec-fields-row">
                <div className="sa-exec-field sa-exec-field--full">
                  <label className="sa-exec-field__label" htmlFor="saef-title">
                    Title
                  </label>
                  <input
                    id="saef-title"
                    type="text"
                    className="sa-exec-field__input"
                    placeholder="Search by title…"
                    value={filters.title}
                    onChange={(e) => set("title", e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* ── Row 2: numeric fields (max 6 chars each) ── */}
              <div className="sa-exec-fields-row">
                <div className="sa-exec-field sa-exec-field--num">
                  <label className="sa-exec-field__label" htmlFor="saef-id">
                    ID
                  </label>
                  <input
                    id="saef-id"
                    type="number"
                    min="0"
                    maxLength={6}
                    className="sa-exec-field__input sa-exec-field__input--num"
                    placeholder="—"
                    value={filters.id}
                    onChange={(e) => set("id", e.target.value.slice(0, 6))}
                    onKeyDown={handleKeyDown}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>

                <div className="sa-exec-field sa-exec-field--num">
                  <label className="sa-exec-field__label" htmlFor="saef-said">
                    SA-ID
                  </label>
                  <input
                    id="saef-said"
                    type="number"
                    min="0"
                    className="sa-exec-field__input sa-exec-field__input--num"
                    placeholder="—"
                    value={filters.saId}
                    onChange={(e) => set("saId", e.target.value.slice(0, 6))}
                    onKeyDown={handleKeyDown}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>

                <div className="sa-exec-field sa-exec-field--num">
                  <label
                    className="sa-exec-field__label"
                    htmlFor="saef-parentId"
                  >
                    Parent ID
                  </label>
                  <input
                    id="saef-parentId"
                    type="number"
                    min="0"
                    className="sa-exec-field__input sa-exec-field__input--num"
                    placeholder="—"
                    value={filters.parentId}
                    onChange={(e) =>
                      set("parentId", e.target.value.slice(0, 6))
                    }
                    onKeyDown={handleKeyDown}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>

                <div className="sa-exec-field sa-exec-field--num">
                  <label
                    className="sa-exec-field__label"
                    htmlFor="saef-extTicket"
                  >
                    Ext. ID
                  </label>
                  <input
                    id="saef-extTicket"
                    type="number"
                    min="0"
                    className="sa-exec-field__input sa-exec-field__input--num"
                    placeholder="—"
                    value={filters.externalTicket}
                    onChange={(e) =>
                      set("externalTicket", e.target.value.slice(0, 6))
                    }
                    onKeyDown={handleKeyDown}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>

                <div className="sa-exec-field sa-exec-field--num">
                  <label className="sa-exec-field__label" htmlFor="saef-cEntry">
                    C-Entry
                  </label>
                  <input
                    id="saef-cEntry"
                    type="number"
                    min="0"
                    className="sa-exec-field__input sa-exec-field__input--num"
                    placeholder="—"
                    value={filters.currentEntry}
                    onChange={(e) =>
                      set("currentEntry", e.target.value.slice(0, 6))
                    }
                    onKeyDown={handleKeyDown}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>
              </div>

              {/* ── Row 3: multi-select dropdowns ── */}
              <div className="sa-exec-fields-row">
                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="saef-type"
                    label="Type"
                    options={typeOptions}
                    selected={filters.types}
                    onChange={(v) => set("types", v)}
                  />
                </div>

                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="saef-status"
                    label="Status"
                    options={statusOptions}
                    selected={filters.statuses}
                    onChange={(v) => set("statuses", v)}
                  />
                </div>

                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="saef-currentUser"
                    label="Current User"
                    options={userOptions}
                    selected={filters.currentUsers}
                    onChange={(v) => set("currentUsers", v)}
                  />
                </div>
              </div>

              {/* ── Row 4: Search / Download buttons ── */}
              <div className="sa-exec-search__actions sa-exec-search__actions--spaced">
                <div className="sa-exec-search__actions-left">
                  <button
                    type="button"
                    className="sa-exec-search-btn sa-exec-search-btn--primary"
                    onClick={onSearch}
                  >
                    <i className="bi bi-search" aria-hidden="true" />
                    Search
                  </button>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="sa-exec-search-btn sa-exec-search-btn--ghost"
                      onClick={onReset}
                    >
                      <i className="bi bi-x-circle" aria-hidden="true" />
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="sa-exec-search-btn sa-exec-search-btn--download"
                  onClick={handleExcelDownload}
                  title="Download as Excel"
                >
                  <i className="bi bi-download" aria-hidden="true" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
