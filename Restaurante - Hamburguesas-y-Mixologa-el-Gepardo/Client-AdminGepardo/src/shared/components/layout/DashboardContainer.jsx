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
    <div
      className="flex min-h-screen"
      style={{ background: "var(--bg-dark)", color: "var(--text-primary)" }}
    >
      {/* Overlay mobile */}
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

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={title}
          subtitle={subtitle}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};