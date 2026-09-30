import "../../styles/entries/EntryDashboardList.css";
import CloseTestEntryModal from "./CloseTestEntryModal";
import CloseGeneralEntryModal from "./CloseGeneralEntryModal";
import { useState } from "react";

/* ── Hex color → readable foreground (white or dark) ───────────────────── */
function hexToForeground(hex) {
  if (!hex) return "#2c201a";
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? "#1a1209" : "#ffffff";
}

/* ── Pill badge ─────────────────────────────────────────────────────────── */
function ColorPill({ label, hex }) {
  if (!label) return <span className="edl-null">—</span>;
  const bg = hex || "#e5ddd5";
  const fg = hexToForeground(hex);
  return (
    <span
      className="edl-color-pill"
      style={{ backgroundColor: bg, color: fg, borderColor: bg }}
      title={label}
    >
      {label}
    </span>
  );
}

/* ── Null-safe plain cell value ─────────────────────────────────────────── */
function Val({ v }) {
  if (v === null || v === undefined || v === "") return <span className="edl-null">—</span>;
  return v;
}

/**
 * TruncVal — renders a value trimmed to `limit` characters.
 * The full value is placed in the native `title` on the <td> (passed via
 * the `titleProp` callback), so this component just returns the display text.
 * For null/empty it returns the dash placeholder.
 */
function truncate(value, limit) {
  if (value === null || value === undefined || value === "") return null;
  const str = String(value);
  return str.length > limit ? str.slice(0, limit) + "…" : str;
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE CONSTANTS
   ══════════════════════════════════════════════════════════════════════════ */
export const PAGE = {
  ENTRY_DASHBOARD: "entry-dashboard",
  MY_ENTRIES:      "my-entries",
};

/* ══════════════════════════════════════════════════════════════════════════
   EntryDashboardList

   Column layout — base (14 cols):
     Frozen-left  : 1-Id  2-User  3-Category  4-Date
     Scrollable   : 5-Start Time  6-End Time  7-Status  8-Project
                    9-Sprint  10-Title  11-Remarks  12-Act-Id  13-SA-Id
     Frozen-right : 14-Type

   Column layout — my-entries (15 cols):
     Same as above, PLUS:
     14-Type  (scrollable, no longer frozen-right)
     Frozen-right : 15-Action

   Sticky left offsets (sum of preceding widths):
     col-1:  0px   (w  80)
     col-2:  80px  (w 200)
     col-3: 280px  (w 200)
     col-4: 480px  (w 116)  ← frozen edge at 596px

   min-width:
     base       : 2288px  (sum of 14 col widths)
     my-entries : 2288 + 120 = 2408px  (Type becomes scrollable + Action 120px)
   ══════════════════════════════════════════════════════════════════════════ */
export default function EntryDashboardList({ entries = [], page = PAGE.ENTRY_DASHBOARD }) {
  const hasEntries   = entries.length > 0;
  const isMyEntries  = page === PAGE.MY_ENTRIES;
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const stored = localStorage.getItem("userInfo");
  const userInfo = stored ? JSON.parse(stored) : null;
  const isMember = userInfo?.role?.toLowerCase() === "member";

  console.log("Role is member:", isMember);

  const handleEntryClose = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  return (
    <div className="edl-root">
      {showModal &&
        selectedEntry &&
        (selectedEntry.sprintActivityId !== null ? (
          <CloseTestEntryModal
            onClose={() => setShowModal(false)}
            sprintActivityId={selectedEntry.sprintActivityId}
            sprintActivity={null}
          />
        ) : (
          <CloseGeneralEntryModal
            onClose={() => setShowModal(false)}
            entry={selectedEntry}
          />
        ))}
      <div className="edl-table-pane">
        <div className="edl-table-card">
          {!hasEntries ? (
            /* ── Empty state ── */
            <div className="edl-empty">
              <i className="bi bi-journal-x edl-empty__icon" aria-hidden="true" />
              <p className="edl-empty__title">No entries found</p>
              <p className="edl-empty__desc">
                There are no entries matching your current filters.
                Try adjusting the search criteria or check back once entries have been logged.
              </p>
            </div>
          ) : (
            /* ── Scrollable table ── */
            <div className="edl-table-scroll">
              <table
                className={`edl-table${isMyEntries ? " edl-table--with-action" : ""}`}
                aria-label="Entry Dashboard"
              >
                <thead>
                  <tr>
                    {/* ── Frozen left ── */}
                    <th className="edl-col-frozen edl-col-1">Id</th>
                    <th className="edl-col-frozen edl-col-2">User</th>
                    <th className="edl-col-frozen edl-col-3">Category</th>
                    <th className="edl-col-frozen edl-col-4 edl-col-frozen--last">Date</th>

                    {/* ── Scrollable ── */}
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Type</th>
                    <th>Project</th>
                    <th>Sprint</th>
                    <th>Title</th>
                    <th>Remarks</th>
                    <th>Act-Id</th>
                    <th>SA-Id</th>

                    {/* Type — frozen-right on base, scrollable on my-entries */}
                    <th className={isMyEntries ? "" : "edl-col-frozen-right"}>Status</th>

                    {/* Action — only on my-entries, frozen-right */}
                    {isMyEntries && (
                      <th className="edl-col-frozen-right edl-th-actions">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const titleDisplay  = truncate(entry.name,         60);
                    const remarkDisplay = truncate(entry.remarks,      60);
                    const userDisplay   = truncate(entry.user,         30);
                    const projDisplay   = truncate(entry.projectName,  30);
                    const sprintDisplay = truncate(entry.sprintName,   30);

                    return (
                      <tr key={entry.id}>
                        {/* ── Frozen left ── */}
                        <td className="edl-col-frozen edl-col-1 edl-td-id">
                          {entry.id}
                        </td>
                        <td
                          className="edl-col-frozen edl-col-2 edl-td-user"
                          title={entry.user ?? undefined}
                        >
                          {userDisplay ? userDisplay : <span className="edl-null">—</span>}
                        </td>
                        <td
                          className="edl-col-frozen edl-col-3 edl-td-category"
                          title={entry.categoryName ?? undefined}
                        >
                          <ColorPill label={entry.categoryName} hex={entry.categoryColour} />
                        </td>
                        <td className="edl-col-frozen edl-col-4 edl-col-frozen--last edl-td-date">
                          <Val v={entry.activityDate} />
                        </td>

                        {/* ── Scrollable ── */}
                        <td className="edl-td-time"><Val v={entry.startTime} /></td>
                        <td className="edl-td-time"><Val v={entry.endTime} /></td>
                        <td className="edl-td-meta">
                          <ColorPill label={entry.activityTypeName} hex={entry.activityTypeColour} />
                        </td>
                        <td className="edl-td-meta" title={entry.projectName ?? undefined}>
                          {projDisplay ? projDisplay : <span className="edl-null">—</span>}
                        </td>
                        <td className="edl-td-meta" title={entry.sprintName ?? undefined}>
                          {sprintDisplay ? sprintDisplay : <span className="edl-null">—</span>}
                        </td>
                        <td
                          className="edl-td-title"
                          title={entry.name != null && entry.name !== "" ? entry.name : undefined}
                        >
                          {titleDisplay ? titleDisplay : <span className="edl-null">—</span>}
                        </td>
                        <td
                          className="edl-td-remarks"
                          title={entry.remarks != null && entry.remarks !== "" ? entry.remarks : undefined}
                        >
                          {remarkDisplay ? remarkDisplay : <span className="edl-null">—</span>}
                        </td>
                        <td className="edl-td-num"><Val v={entry.activityId} /></td>
                        <td className="edl-td-num"><Val v={entry.sprintActivityId} /></td>

                        {/* Type — frozen-right on base, scrollable on my-entries */}
                        <td className={isMyEntries ? "" : "edl-col-frozen-right"}>
                          <ColorPill label={entry.statusDisplayName} hex={entry.statusColour} />
                        </td>

                        {/* Action — only on my-entries */}
                        {isMyEntries && (
                          <td className="edl-col-frozen-right edl-td-actions">
                            {/* Placeholder buttons — wire up handlers as needed */}
                            {!isMember && 
                            <button
                              type="button"
                              className="edl-action-btn edl-action-btn--edit"
                              title="Edit entry"
                              onClick={() => {}}
                            >
                              <i className="bi bi-pencil" aria-hidden="true" />
                            </button>}
                            {entry.statusDisplayName.includes("in-process") && (
                            <button
                              type="button"
                              className="edl-action-btn edl-action-btn--delete"
                              title="Close entry"
                              onClick={() => handleEntryClose(entry)}
                            >
                              <i className="bi-rocket-takeoff" aria-hidden="true" />
                            </button>)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
