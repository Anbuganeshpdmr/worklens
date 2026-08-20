import "../../styles/sprint-activities/ActivityStatusBadge.css";

/**
 * Coloured pill badge for a sprint-activity status.
 *
 * Accepts either:
 *   status   string  — the statusName from the API (e.g. "Enabled1", "Active")
 *   colour   string  — the colourCode from the API (e.g. "rgb(0, 84, 51)")
 *
 * When colourCode is provided it is used directly for the dot and border.
 * Falls back to the slug-based CSS class when no colour is given.
 */
function ActivityStatusBadge({ status, colour }) {
  if (!status && !colour) return <span className="sa-badge sa-badge--unknown">—</span>;

  if (colour) {
    return (
      <span
        className="sa-badge sa-badge--custom"
        style={{
          borderColor: colour,
          color: colour,
          background: `${colour}18`, // 18 = ~10% opacity hex
        }}
      >
        <span className="sa-badge__dot" style={{ background: colour }} aria-hidden="true" />
        {status ?? "—"}
      </span>
    );
  }

  // Fallback slug matching for well-known values
  const slug = toSlug(status);
  return (
    <span className={`sa-badge sa-badge--${slug}`}>
      <span className="sa-badge__dot" aria-hidden="true" />
      {status}
    </span>
  );
}

function toSlug(status) {
  const s = String(status ?? "").toLowerCase();
  if (s.includes("passed"))       return "passed";
  if (s.includes("failed"))       return "failed";
  if (s.includes("atleast"))      return "atleast-once";
  if (s.includes("need to"))      return "need-again";
  if (s.includes("not executed")) return "not-executed";
  return "unknown";
}

export default ActivityStatusBadge;
