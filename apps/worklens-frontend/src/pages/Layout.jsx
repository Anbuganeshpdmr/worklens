import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Layout.css";

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stored = localStorage.getItem("userInfo");
  const userInfo = stored ? JSON.parse(stored) : null;

  const role = userInfo?.role || "Member";

  return (
    <div className="app-layout">
      {/* Left Layout */}
      <div className={`app-layout__left ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Sidebar 
            collapsed={sidebarCollapsed}
            role={role}
        />
      </div>

      {/* Right Layout */}
      <div className="app-layout__right">
        {/* Navbar */}
        <Navbar
          onMenuClick={() =>
            setSidebarCollapsed(!sidebarCollapsed)
          }
        />

        {/* Work Area */}
        <main className="app-layout__work-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;