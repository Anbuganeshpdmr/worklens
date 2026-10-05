import { useState, useEffect, useRef } from "react";
import ReportChart from "../reports/ReportChart";
import {
  CriteriaOptions_EntryList,
  AggregatorOptions_EntryList,
} from "../reports/CritreriaOptions";
import { getActiveProjects } from "../../api/projects";
import { getSprints } from "../../api/sprints";
import { getTypes } from "../../api/types";
import { getCategories } from "../../api/category";
import { getStatusByRecord } from "../../api/status";
import { getUsers } from "../../api/user";
import { getAllEntries, fetchAllEntries } from "../../api/entry";
import { flattenEntry } from "./entryMapper";

/* ══════════════════════════════════════════════════════════════════════════
   MultiSelect — pill-tag dropdown (id-based, label shown)
   options: [{ id, name }]
   selected: [id, ...]
   ══════════════════════════════════════════════════════════════════════════ */
function MultiSelect({ id, label, options, selected, onChange, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const toggle = (optId) => {
    if (selected.includes(optId)) {
      onChange(selected.filter((v) => v !== optId));
    } else {
      onChange([...selected, optId]);
    }
  };

  const removeTag = (e, optId) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== optId));
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o.id))
    .map((o) => ({ id: o.id, name: o.name }));

  return (
    <div className="sa-ms" ref={ref}>
      <label className="sa-exec-field__label" htmlFor={id}>
        {label}
      </label>
      <div
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`sa-ms__box${open ? " sa-ms__box--open" : ""}`}
        onClick={() => !loading && setOpen((p) => !p)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!loading) setOpen((p) => !p);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {loading ? (
          <span className="sa-ms__placeholder">Loading…</span>
        ) : selected.length === 0 ? (
          <span className="sa-ms__placeholder">All</span>
        ) : (
          <div className="sa-ms__tags">
            {selectedLabels.map((item) => (
              <span key={item.id} className="sa-ms__tag">
                {item.name}
                <button
                  type="button"
                  className="sa-ms__tag-remove"
                  onClick={(e) => removeTag(e, item.id)}
                  aria-label={`Remove ${item.name}`}
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

      {open && (
        <ul className="sa-ms__list" role="listbox" aria-multiselectable="true">
          {options.length === 0 ? (
            <li className="sa-ms__list-empty">No options</li>
          ) : (
            options.map((opt) => {
              const isSelected = selected.includes(opt.id);
              return (
                <li
                  key={opt.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`sa-ms__option${isSelected ? " sa-ms__option--selected" : ""}`}
                  onClick={() => toggle(opt.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(opt.id);
                    }
                  }}
                  tabIndex={0}
                >
                  <span className="sa-ms__option-check" aria-hidden="true">
                    {isSelected ? <i className="bi bi-check2" /> : null}
                  </span>
                  {opt.name}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   buildFilterRequest — maps component state → EntryFilterRequest DTO
   ══════════════════════════════════════════════════════════════════════════ */
function buildFilterRequest(fields) {
  const parseIds = (raw) =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);

  return {
    fromDate: fields.fromDate || null,
    toDate: fields.toDate || null,
    userIds: fields.userIds.length ? fields.userIds : null,
    activityIds: fields.activityIds.trim()
      ? parseIds(fields.activityIds)
      : null,
    projectIds: fields.projectIds.length ? fields.projectIds : null,
    sprintIds: fields.sprintIds.length ? fields.sprintIds : null,
    activityTypeIds: fields.activityTypeIds.length
      ? fields.activityTypeIds
      : null,
    categoryIds: fields.categoryIds.length ? fields.categoryIds : null,
    statusIds: fields.statusIds.length ? fields.statusIds : null,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   DEFAULT_FIELDS — empty state shape; pages can override via `defaultFields`
   ══════════════════════════════════════════════════════════════════════════ */
const DEFAULT_FIELDS = {
  fromDate: "",
  toDate: "",
  projectIds: [],
  sprintIds: [],
  activityTypeIds: [],
  categoryIds: [],
  statusIds: [],
  userIds: [],
  activityIds: "", // comma-separated numbers
};

/* ══════════════════════════════════════════════════════════════════════════
   EntryHeaderComponent
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * Self-contained: owns the entry fetch, maintains chart records internally.
 *
 * Props:
 *   onResults       — callback(flattenedRecords[]) — parent uses this to populate its list table
 *   onDownload      — callback(filterRequest) — placeholder
 *   defaultFields   — partial field overrides applied at mount (e.g. { fromDate, toDate })
 *   page            — page index passed to getAllEntries (default 0)
 *   size            — page size passed to getAllEntries (default 100)
 *   criteriaOptions   — optional override for ReportChart criteria (defaults to CriteriaOptions_EntryList)
 *   aggregatorOptions — optional override for ReportChart aggregator (defaults to AggregatorOptions_EntryList)
 *   defaultAggregator — optional default aggregator key (defaults to "duration")
 */
export default function EntryHeaderComponent({
  onResults,
  onDownload,
  defaultFields = {},
  page = 0,
  size = 100,
  criteriaOptions = CriteriaOptions_EntryList,
  aggregatorOptions = AggregatorOptions_EntryList,
  defaultAggregator = "duration",
}) {
  const [expanded, setExpanded] = useState(true);

  /* ── Filter fields state ── */
  const [fields, setFields] = useState({ ...DEFAULT_FIELDS, ...defaultFields });

  /* ── Internal records — drive ReportChart ── */
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  /* ── Dropdown option lists (fetched once on mount) ── */
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const stored = localStorage.getItem("userInfo");
  const userInfo = stored ? JSON.parse(stored) : null;
  const isMember = userInfo?.role?.toLowerCase() === "member";

  useEffect(() => {
    let cancelled = false;

    async function fetchDropdownOptions() {
      try {
        const [
          projectsData,
          sprintsData,
          typesData,
          categoriesData,
          statusesData,
          usersData,
        ] = await Promise.allSettled([
          getActiveProjects(), // returns array of { projectId, projectName, ... }
          getSprints(), // returns { sprints: [{ sprintId, sprintName, ... }] }
          getTypes(), // returns array of { id, name, ... }
          getCategories(), // returns array of { id, name, ... }
          getStatusByRecord("ENTRY"), // returns array of { statusId, displayName, ... }
          getUsers(), // returns array of { id, name, ... }
        ]);

        if (cancelled) return;

        // Normalise every response to { id, name } so MultiSelect works uniformly
        setProjects(
          projectsData.status === "fulfilled" &&
            Array.isArray(projectsData.value)
            ? projectsData.value.map((p) => ({
                id: p.projectId,
                name: p.projectName,
              }))
            : [],
        );
        setSprints(
          sprintsData.status === "fulfilled"
            ? (sprintsData.value?.sprints ?? []).map((s) => ({
                id: s.sprintId,
                name: s.sprintName,
              }))
            : [],
        );
        setTypes(
          typesData.status === "fulfilled" && Array.isArray(typesData.value)
            ? typesData.value.map((t) => ({ id: t.id, name: t.name }))
            : [],
        );
        setCategories(
          categoriesData.status === "fulfilled" &&
            Array.isArray(categoriesData.value)
            ? categoriesData.value.map((c) => ({ id: c.id, name: c.name }))
            : [],
        );
        setStatuses(
          statusesData.status === "fulfilled" &&
            Array.isArray(statusesData.value)
            ? statusesData.value.map((s) => ({
                id: s.statusId,
                name: s.displayName,
              }))
            : [],
        );
        setUsers(
          usersData.status === "fulfilled" && Array.isArray(usersData.value)
            ? usersData.value.map((u) => ({ id: u.id, name: u.name }))
            : [],
        );
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    }

    fetchDropdownOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Helpers ── */
  const set = (field, value) =>
    setFields((prev) => ({ ...prev, [field]: value }));

  const runFetch = async (filterRequest) => {
    setFetchLoading(true);
    setFetchError("");
    try {
      console.log("Before sending Request:", filterRequest);
      const response = await fetchAllEntries(filterRequest);
      console.log("API response:", response);
      console.log("API content:", response?.data?.content);
      console.log("API content count:", response?.data?.content?.length);
      const flat = response?.data?.map(flattenEntry) ?? [];
      // const flat = response?.data?.content?.map(flattenEntry) ?? [];
      console.log("Response Flat:", flat);
      setRecords(flat); // → ReportChart re-renders
      onResults?.(flat); // → parent list table re-renders
    } catch (e) {
      setFetchError(e?.message || "Failed to load entries.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSearch = () => {
    const requestBody = buildFilterRequest(fields);
    console.log("[EntryHeaderComponent] Search Request Body:", requestBody);
    runFetch(requestBody);
  };

  const handleClear = () => {
    const reset = { ...DEFAULT_FIELDS, ...defaultFields };
    setFields(reset);
    const requestBody = buildFilterRequest(reset);
    console.log("[EntryHeaderComponent] Clear → Request Body:", requestBody);
    runFetch(requestBody);
  };

  const handleDownload = () => {
    const requestBody = buildFilterRequest(fields);
    console.log("[EntryHeaderComponent] Download Request Body:", requestBody);
    onDownload?.(requestBody);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const hasActiveFilters =
    fields.fromDate ||
    fields.toDate ||
    fields.projectIds.length > 0 ||
    fields.sprintIds.length > 0 ||
    fields.activityTypeIds.length > 0 ||
    fields.categoryIds.length > 0 ||
    fields.statusIds.length > 0 ||
    fields.userIds.length > 0 ||
    fields.activityIds.trim();

  return (
    <div className="sa-exec-accordion">
      {/* ── Toggle bar ── */}
      <button
        type="button"
        className="sa-exec-accordion__bar"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
        aria-controls="entry-header-body"
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
          {fetchLoading && (
            <span className="sa-exec-results-counter" style={{ opacity: 0.6 }}>
              Loading…
            </span>
          )}
          {!fetchLoading && (
            <span className="sa-exec-results-counter">
              <strong>{records.length}</strong>{" "}
              {records.length === 1 ? "entry" : "entries"}
            </span>
          )}
          <span className="sa-exec-search__toggle" aria-hidden="true">
            <i
              className={`bi ${expanded ? "bi-chevron-up" : "bi-chevron-down"}`}
            />
          </span>
        </div>
      </button>

      {/* ── Accordion body ── */}
      {expanded && (
        <div id="entry-header-body" className="sa-exec-accordion__body">
          {/* LEFT — Chart */}
          <div className="sa-exec-accordion__chart">
            <div className="sa-exec-accordion__panel-title">
              <i className="bi bi-bar-chart-fill" aria-hidden="true" />
              Entry Overview
            </div>
            <div className="sa-exec-accordion__chart-body">
              <ReportChart
                records={records}
                criteriaOptions={criteriaOptions}
                defaultCriteria="status"
                aggregatorOptions={aggregatorOptions}
                defaultAggregator={defaultAggregator}
              />
            </div>
          </div>

          {/* RIGHT — Search */}
          <div className="sa-exec-accordion__search">
            <div className="sa-exec-accordion__panel-title">
              <i className="bi bi-funnel-fill" aria-hidden="true" />
              Search &amp; Filter
            </div>

            <div className="sa-exec-search__fields">
              {/* Row 1: Date range */}
              <div className="sa-exec-fields-row">
                <div className="sa-exec-field sa-exec-field--date">
                  <label className="sa-exec-field__label" htmlFor="ehf-from">
                    From
                  </label>
                  <input
                    id="ehf-from"
                    type="date"
                    className="sa-exec-field__input"
                    value={fields.fromDate}
                    onChange={(e) => set("fromDate", e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="sa-exec-field sa-exec-field--date">
                  <label className="sa-exec-field__label" htmlFor="ehf-to">
                    To
                  </label>
                  <input
                    id="ehf-to"
                    type="date"
                    className="sa-exec-field__input"
                    value={fields.toDate}
                    onChange={(e) => set("toDate", e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Row 2: Project, Sprint */}
              <div className="sa-exec-fields-row">
                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="ehf-project"
                    label="Project"
                    options={projects}
                    selected={fields.projectIds}
                    onChange={(v) => set("projectIds", v)}
                    loading={optionsLoading}
                  />
                </div>
                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="ehf-sprint"
                    label="Sprint"
                    options={sprints}
                    selected={fields.sprintIds}
                    onChange={(v) => set("sprintIds", v)}
                    loading={optionsLoading}
                  />
                </div>
              </div>

              {/* Row 3: Type, Category, Status */}
              <div className="sa-exec-fields-row">
                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="ehf-type"
                    label="Type"
                    options={types}
                    selected={fields.activityTypeIds}
                    onChange={(v) => set("activityTypeIds", v)}
                    loading={optionsLoading}
                  />
                </div>
                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="ehf-category"
                    label="Category"
                    options={categories}
                    selected={fields.categoryIds}
                    onChange={(v) => set("categoryIds", v)}
                    loading={optionsLoading}
                  />
                </div>
                <div className="sa-exec-field sa-exec-field--ms">
                  <MultiSelect
                    id="ehf-status"
                    label="Status"
                    options={statuses}
                    selected={fields.statusIds}
                    onChange={(v) => set("statusIds", v)}
                    loading={optionsLoading}
                  />
                </div>
              </div>

              {/* Row 4: User */}
              {!isMember && (
                <div className="sa-exec-fields-row">
                  <div className="sa-exec-field sa-exec-field--ms">
                    <MultiSelect
                      id="ehf-user"
                      label="User"
                      options={users}
                      selected={fields.userIds}
                      onChange={(v) => set("userIds", v)}
                      loading={optionsLoading}
                    />
                  </div>
                </div>
              )}

              {/* Row 5: Activity IDs */}
              <div className="sa-exec-fields-row">
                <div className="sa-exec-field sa-exec-field--full">
                  <label
                    className="sa-exec-field__label"
                    htmlFor="ehf-activityIds"
                  >
                    Activity IDs
                    <span
                      className="sa-exec-field__hint"
                      title="Enter comma-separated numeric IDs, e.g. 1, 42, 100"
                    >
                      &nbsp;(comma-separated)
                    </span>
                  </label>
                  <input
                    id="ehf-activityIds"
                    type="text"
                    className="sa-exec-field__input"
                    placeholder="e.g. 1, 42, 100"
                    value={fields.activityIds}
                    onChange={(e) => set("activityIds", e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Row 6: Action buttons */}
              <div className="sa-exec-search__actions sa-exec-search__actions--spaced">
                <div className="sa-exec-search__actions-left">
                  <button
                    type="button"
                    className="sa-exec-search-btn sa-exec-search-btn--primary"
                    onClick={handleSearch}
                  >
                    <i className="bi bi-search" aria-hidden="true" />
                    Search
                  </button>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="sa-exec-search-btn sa-exec-search-btn--ghost"
                      onClick={handleClear}
                    >
                      <i className="bi bi-x-circle" aria-hidden="true" />
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="sa-exec-search-btn sa-exec-search-btn--download"
                  onClick={handleDownload}
                  title="Download (coming soon)"
                  disabled
                >
                  <i className="bi bi-download" aria-hidden="true" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Fetch error ── */}
      {fetchError && (
        <div className="sa-exec-accordion__error" role="alert">
          <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
          {fetchError}
        </div>
      )}
    </div>
  );
}
