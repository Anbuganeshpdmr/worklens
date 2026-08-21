import React from "react";

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
  const email       = user?.emailId     || user?.email       || "-";
  const empId       = user?.empId       || "-";
  const designation = user?.designation || "-";

  // role can be a plain string OR an object with a name field
  let role = "-";
  if (typeof user?.role === "string" && user.role) {
    role = user.role;
  } else if (user?.role?.name) {
    role = user.role.name;
  }

  // active flag — backend may send boolean or 1/0
  const isActive =
    user?.isActive === true  ||
    user?.isActive === 1     ||
    user?.active   === true  ||
    user?.active   === 1;

  const initial      = name !== "-" ? name.charAt(0).toUpperCase() : "?";
  const avatarColor  = getAvatarColor(name);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mc-card">

      {/* ── HEADER ─────────────────────────── */}
      <div className="mc-header">

        {/* AVATAR */}
        <div
          className="mc-avatar"
          style={{ background: avatarColor }}
          aria-label={name}
        >
          {initial}
        </div>

        {/* NAME + EMAIL */}
        <div className="mc-info">
          <h3 className="mc-name">{name}</h3>
          <p  className="mc-email">
            <svg className="mc-email-icon" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="2"
                    stroke="#98a2b3" strokeWidth="1.2"/>
              <path d="M1 5l7 5 7-5"
                    stroke="#98a2b3" strokeWidth="1.2" strokeLinecap="round"/>
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
                  stroke="#98a2b3" strokeWidth="1.2"/>
            <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"
                  stroke="#98a2b3" strokeWidth="1.2"/>
          </svg>
          <span className="mc-label">Designation</span>
          <span className="mc-colon">:</span>
          <span className="mc-value">{designation}</span>
        </div>

        {/* EMP ID */}
        <div className="mc-row">
          <svg className="mc-row-icon" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2"
                  stroke="#98a2b3" strokeWidth="1.2"/>
            <path d="M5 6h6M5 9h4" stroke="#98a2b3"
                  strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="mc-label">Emp ID</span>
          <span className="mc-colon">:</span>
          <span className="mc-value">{empId}</span>
        </div>

        {/* ROLE + STATUS */}
        <div className="mc-row">
          <svg className="mc-row-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="3"
                    stroke="#98a2b3" strokeWidth="1.2"/>
            <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
                  stroke="#98a2b3" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="mc-label">Role</span>
          <span className="mc-colon">:</span>
          <span className="mc-value">{role}</span>
          <span className={`mc-status ${isActive ? "mc-active" : "mc-inactive"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

      </div>

    </div>
  );
};

export default MemberCard;
