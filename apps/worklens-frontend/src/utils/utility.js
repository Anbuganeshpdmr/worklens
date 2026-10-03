export function convertTimeToClientReadable(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Format the date part (e.g., "15 September 2026")
  const dateStr = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the time part (e.g., "4:23 pm")
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Combine them with a comma instead of 'at'
  return `${dateStr}, ${timeStr}`;
}
