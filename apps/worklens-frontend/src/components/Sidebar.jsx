import "../styles/Sidebar.css";

// Menu items per role.
// TODO: Replace placeholder labels/paths with real feature routes as they are built.
const ROLE_MENUS = {
  FH: [
    // Common
    { label: "Dashboard", path: "/home" },
    // FH-only
    { label: "Team Overview", path: "/team-overview" },       // TODO: FH feature
    { label: "Approvals", path: "/approvals" },               // TODO: FH feature
    { label: "Reports", path: "/reports" },                   // TODO: FH feature
  ],
  TL: [
    // Common
    { label: "Dashboard", path: "/home" },
    // TL-only
    { label: "My Team", path: "/my-team" },                   // TODO: TL feature
    { label: "Task Assignments", path: "/task-assignments" }, // TODO: TL feature
    { label: "Reports", path: "/reports" },                   // TODO: TL feature
  ],
  Member: [
    // Common
    { label: "Dashboard", path: "/home" },
    // Member-only
    { label: "My Tasks", path: "/my-tasks" },                 // TODO: Member feature
    { label: "My Profile", path: "/profile" },               // TODO: Member feature
  ],
};

function Sidebar({ role }) {
  const normalizedRole = role?.toUpperCase() === "FH"
    ? "FH"
    : role?.toUpperCase() === "TL"
    ? "TL"
    : "Member";

  const menuItems = ROLE_MENUS[normalizedRole] ?? ROLE_MENUS["Member"];

  return (
    <aside className="sidebar">
      <div className="sidebar__role-badge">{normalizedRole}</div>
      <ul className="sidebar__nav">
        {menuItems.map((item) => (
          <li key={item.path}>
            <a
              href={item.path}
              className={`sidebar__nav-item${
                window.location.pathname === item.path
                  ? " sidebar__nav-item--active"
                  : ""
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
