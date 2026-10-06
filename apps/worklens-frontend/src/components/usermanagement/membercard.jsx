import React, { useEffect, useState } from "react";
import { getMyDp } from "../../api/user";

// ==========================================
// AVATAR COLOR — derived from name hash
// ==========================================
const AVATAR_COLORS = [
  "#4f91ff",
  "#f97066",
  "#f79009",
  "#12b76a",
  "#7a5af8",
  "#0ba5ec",
  "#ee46bc",
  "#16b364",
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ==========================================
// MEMBER CARD
// ==========================================
const MemberCard = ({ user, onEdit }) => {
  const name        = user?.name        || "-";
  const email       = user?.emailId     || user?.email || "-";
  const empId       = user?.empId       || "-";
  const designation = user?.designation || "-";
  const status      = user?.currentStatus?.displayName || user?.status || "-";
  const statusColour = user?.currentStatus?.colourCode || "#98a2b3";

  // Initials from backend (2 chars like "AB"), fallback to first char of name
  const initials = user?.initials
    ? user.initials.toUpperCase()
    : name !== "-"
      ? name.slice(0, 2).toUpperCase()
      : "?";

  let role = "-";
  if (typeof user?.role === "string" && user.role) {
    role = user.role;
  } else if (user?.role?.name) {
    role = user.role.name;
  }

  const statusName = (
    user?.currentStatus?.displayName ||
    user?.currentStatus?.uniqueName  ||
    user?.currentStatus?.statusName  || ""
  ).toLowerCase();
  const isActive = statusName.includes("active") && !statusName.includes("inactive");

  const avatarColor = getAvatarColor(name);

  // ── Profile photo state ──────────────────────────
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadPhoto = async () => {
      // Revoke previous blob URL before loading a new one
      setPhotoUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });

      // Fetch only when the backend says a DP exists.
      // Guard on dpAvailable OR dpPath so either field being set is enough.
      const hasDp = user?.dpAvailable || !!user?.dpPath;
      if (!hasDp || !user?.id) return;

      try {
        const blob = await getMyDp(user.dpPath);
        if (cancelled) return;
        setPhotoUrl(URL.createObjectURL(blob));
      } catch (err) {
        // 404 / 405 just means no photo — fall back to initials silently
        if (err?.response?.status !== 404 && err?.response?.status !== 405) {
          console.error("Profile photo fetch failed:", err);
        }
      }
    };

    loadPhoto();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.dpAvailable, user?.dpPath]);

  // Cleanup blob URL when card unmounts
  useEffect(() => {
    return () => {
      if (photoUrl?.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  return (
    <div className="mc-card">

      {/* ── HEADER ─────────────────────────── */}
      <div className="mc-header">

        {/* AVATAR */}
        {photoUrl ? (
          <div className="mc-avatar mc-avatar--photo" aria-label={name}>
            <img src={photoUrl} alt={name} className="mc-avatar-img" />
          </div>
        ) : (
          <div
            className="mc-avatar"
            style={{ background: avatarColor }}
            aria-label={name}
          >
            {initials}
          </div>
        )}

        {/* NAME + EMAIL */}
        <div className="mc-info">
          <h3 className="mc-name">{name}</h3>
          <p className="mc-email">
            <svg className="mc-email-icon" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="2"
                    stroke="#98a2b3" strokeWidth="1.2" />
              <path d="M1 5l7 5 7-5"
                    stroke="#98a2b3" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {email}
          </p>
        </div>

        {/* EDIT BUTTON */}
        <button
          type="button"
          className="mc-edit-btn"
          onClick={() => onEdit(user)}
          title="Edit"
          aria-label={`Edit ${name}`}
        >
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path
              d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z"
              stroke="#1677ff" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>

      </div>

      {/* ── DETAILS ────────────────────────── */}
      <div className="mc-details">

        {/* DESIGNATION */}
        <div className="mc-row">
          <svg className="mc-row-icon" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="4" width="12" height="9" rx="1.5"
                  stroke="#98a2b3" strokeWidth="1.2" />
            <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
                  stroke="#98a2b3" strokeWidth="1.2" />
          </svg>
          <span className="mc-label">Designation</span>
          <span className="mc-colon">:</span>
          <span className="mc-value">{designation}</span>
        </div>

        {/* EMP ID */}
        <div className="mc-row">
          <svg className="mc-row-icon" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2"
                  stroke="#98a2b3" strokeWidth="1.2" />
            <path d="M5 6h6M5 9h4"
                  stroke="#98a2b3" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="mc-label">Emp ID</span>
          <span className="mc-colon">:</span>
          <span className="mc-value">{empId}</span>
        </div>

        {/* ROLE + STATUS */}
        <div className="mc-row">
          <svg className="mc-row-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="3"
                    stroke="#98a2b3" strokeWidth="1.2" />
            <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
                  stroke="#98a2b3" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="mc-label">Role</span>
          <span className="mc-colon">:</span>
          <span className="mc-value">{role}</span>
          <span style={{ color: statusColour, fontSize: "13px", fontWeight: "600" }}>
            {status}
          </span>
        </div>

      </div>

    </div>
  );
};

export default MemberCard;
