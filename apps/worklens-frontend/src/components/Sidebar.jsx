import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

/**
 * Sidebar reads userInfo from localStorage directly — no role prop needed.
 *
 * Nav items are the same for all roles for now; role-gating can be
 * layered in once the permission model is finalised.
 *
 * "Sprint Activities" links to /sprints/:sprintId/activities.
 * Because the sprint is chosen from the Active Sprints page, the sidebar item
 * is marked disabled until a sprint is in context.
 */

const NAV_ITEMS = [
  { label: "Home",               path: "/home",        icon: "bi-house" },
  { label: "Dashboard",          path: "/dashboard",   icon: "bi-grid-1x2" },
  { label: "Projects And Sprints", path: "/projects",  icon: "bi-kanban" },
  // Sprint-Activities: navigated to from the sprints page; no fixed sidebar path
  { label: "Sprint Activities",  path: null,           icon: "bi-activity",      sprintNav: true },
  { label: "Activities",         path: "/activities",  icon: "bi-journal-text" },
  { label: "Entries",            path: "/entries",     icon: "bi-pencil-square" },
  { label: "Reports",            path: "/reports",     icon: "bi-bar-chart" },
  { label: "Members",            path: "/members",     icon: "bi-people" },
  { label: "Support Files",      path: "/support-files", icon: "bi-paperclip" },
  { label: "Settings",           path: "/settings",    icon: "bi-gear" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active sprint from current URL if on sprint-activities page
  const sprintMatch = location.pathname.match(/^\/sprints\/([^/]+)\/activities/);
  const activeSprintId = sprintMatch?.[1] ?? null;

  return (
    <aside className="sidebar">
      <ul className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          /* Sprint Activities — only navigable when a sprint is in the URL */
          if (item.sprintNav) {
            const isActive = !!activeSprintId;
            return (
              <li key="sprint-activities">
                <button
                  className={`sidebar__nav-item${isActive ? " sidebar__nav-item--active" : " sidebar__nav-item--disabled"}`}
                  onClick={() => activeSprintId && navigate(`/sprints/${activeSprintId}/activities`)}
                  title={isActive ? undefined : "Select a sprint first"}
                  disabled={!isActive}
                >
                  <i className={`bi ${item.icon} sidebar__nav-icon`} />
                  {item.label}
                </button>
              </li>
            );
          }

          /* Regular nav items */
          const isActive = item.path && location.pathname === item.path;
          return (
            <li key={item.path}>
              <a
                href={item.path ?? "#"}
                className={`sidebar__nav-item${isActive ? " sidebar__nav-item--active" : ""}`}
              >
                <i className={`bi ${item.icon} sidebar__nav-icon`} />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
