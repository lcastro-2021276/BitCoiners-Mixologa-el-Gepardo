// src/features/dashboard/pages/DashboardHome.jsx
import { useAuthStore } from "../../auth/store/authStore";

const STATS = [
  { label: "Pedidos hoy",    value: "—", icon: "", color: "var(--color-accent)" },
  { label: "Mesas activas",  value: "—", icon: "", color: "var(--color-info)" },
  { label: "Reservaciones",  value: "—", icon: "", color: "var(--color-success)" },
  { label: "Reseñas nuevas", value: "—", icon: "", color: "var(--color-warning)" },
];

export const DashboardHome = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>

      {/* BIENVENIDA */}
      <div
        style={{
          padding: "24px 28px",
          borderRadius: "14px",
          background: "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))",
          border: "1px solid var(--border-color)",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
          ¡Bienvenido, {user?.name || "Administrador"}!
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          Panel de administración — Hamburguesas y Mixología el Gepardo
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {STATS.map(({ label, value, icon, color }) => (
          <div
            key={label}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px", height: "48px",
                borderRadius: "12px",
                background: `${color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div>
              <p style={{ fontSize: "24px", fontWeight: 700, color }}>{value}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TIP */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "10px",
          background: "rgba(183,109,27,0.08)",
          border: "1px solid rgba(183,109,27,0.2)",
          fontSize: "13px",
          color: "var(--text-secondary)",
        }}
      >
        Usa el menú lateral para navegar entre las secciones del panel.
      </div>
    </div>
  );
};