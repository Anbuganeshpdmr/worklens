import { useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

// Menu items per role.
// TODO: Replace placeholder labels/paths with real feature routes as they are built.
const ROLE_MENUS = {
  ADMIN: [
    {
      label: "User Management",
      path: "/user-management",
      icon: "/icons/userManagement.png",
    },
    { label: "Profile", path: "/profile", icon: "/icons/profile1.png" },
    { label: "Logout", icon: "/icons/logout.png" },
  ],

  FH: [
    { label: "Home", path: "/home", icon: "/icons/home.png" },
    { label: "Entries", path: "/entries", icon: "/icons/entries.png" },
    {
      label: "Record Status",
      path: "/record-status",
      icon: "/icons/recordStatus.png",
    },
    {
      label: "Sprint Management",
      path: "/projects",
      icon: "/icons/projectSprint.png",
    },
    {
      label: "Activity Type",
      path: "/activity-type",
      icon: "/icons/activityType.png",
    },
    //{ label: "Activities", path: "/activities", icon: "/icons/activities.png" },
    {
      label: "General Activity",
      path: "/general-activity",
      icon: "/icons/general.png",
    },
    //{ label: "Sprint", path: "/sprint", icon: "/icons/sprint.png" },
    //{ label: "Activity Movements", path: "/activity-movements", icon: "/icons/activityMovements.png" },
    {
      label: "User Management",
      path: "/user-management",
      icon: "/icons/userManagement.png",
    },
    { label: "Resource", path: "/resource", icon: "/icons/resource.png" },
    {
      label: "Report Dashboard",
      path: "/report-dashboard",
      icon: "/icons/reportDashboard.png",
    },
    { label: "Profile", path: "/profile", icon: "/icons/profile1.png" },
    { label: "Logout", icon: "/icons/logout.png" },
  ],

  TL: [
    { label: "Home", path: "/home", icon: "/icons/home.png" },
    { label: "Entries", path: "/entries", icon: "/icons/entries.png" },
    {
      label: "Entry Dashboard",
      path: "/entry-dashboard",
      icon: "/icons/entries.png",
    },
    {
      label: "Record Status",
      path: "/record-status",
      icon: "/icons/recordStatus.png",
    },
    {
      label: "Sprint Management",
      path: "/projects",
      icon: "/icons/projectSprint.png",
    },
    {
      label: "Activity Type",
      path: "/activity-type",
      icon: "/icons/activityType.png",
    },
    {
      label: "General Activity",
      path: "/general-activity",
      icon: "/icons/general.png",
    },
    {
      label: "User Management",
      path: "/user-management",
      icon: "/icons/userManagement.png",
    },
    { label: "Resource", path: "/resource", icon: "/icons/resource.png" },
    {
      label: "Report Dashboard",
      path: "/report-dashboard",
      icon: "/icons/reportDashboard.png",
    },
    { label: "Profile", path: "/profile", icon: "/icons/profile1.png" },
    { label: "Logout", icon: "/icons/logout.png" },
  ],

  MEMBER: [
    { label: "Home", path: "/home", icon: "/icons/home.png" },
    { label: "Entries", path: "/entries", icon: "/icons/entries.png" },
    {
      label: "Sprint Management",
      path: "/projects",
      icon: "/icons/projectSprint.png",
    },
    {
      label: "General Activity",
      path: "/general-activity",
      icon: "/icons/general.png",
    },
    { label: "Resource", path: "/resource", icon: "/icons/resource.png" },
    {
      label: "Report Dashboard",
      path: "/report-dashboard",
      icon: "/icons/reportDashboard.png",
    },
    { label: "Profile", path: "/profile", icon: "/icons/profile1.png" },
    { label: "Logout", icon: "/icons/logout.png" },
  ],
};

function normalizeRole(role) {
  const roleValue =
    typeof role === "object"
      ? role?.name || role?.roleName || role?.role
      : role;
  const normalized = String(roleValue || "MEMBER")
    .trim()
    .toUpperCase();

  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "FH" || normalized.includes("FUNCTIONAL HEAD"))
    return "FH";
  if (normalized === "TL" || normalized.includes("TEAM LEAD")) return "TL";
  return "MEMBER";
}

function Sidebar({ role, collapsed }) {
  const location = useLocation();
  const normalizedRole = normalizeRole(role);

  const menuItems = ROLE_MENUS[normalizedRole] ?? ROLE_MENUS["MEMBER"];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      {/* <div className="sidebar__role-badge">{normalizedRole}</div> */}
      <ul className="sidebar__nav">
        {menuItems.map((item) => (
          <li key={item.label}>
            {item.label === "Logout" ? (
              <button
                className="sidebar__nav-item sidebar__logout-btn"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userInfo");
                  window.location.replace("/");
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="sidebar__icon"
                />
                <span>{item.label}</span>
              </button>
            ) : (
              <a
                href={item.path}
                className={`sidebar__nav-item${
                  location.pathname === item.path
                    ? " sidebar__nav-item--active"
                    : ""
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="sidebar__icon"
                />
                <span>{item.label}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
