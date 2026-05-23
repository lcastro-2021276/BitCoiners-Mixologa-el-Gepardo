// src/shared/components/layout/DashboardContainer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar }  from "./Navbar";

export const DashboardContainer = ({ user, onLogout, title, subtitle, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f5f0e8", color: "#1a1a1a" }}>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Navbar
          title={title}
          subtitle={subtitle}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <main style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
          background: "#f5f0e8",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};