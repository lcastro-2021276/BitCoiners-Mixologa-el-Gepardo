import { useAuthStore } from "../../auth/store/authStore";

const STATS = [
  { label: "Pedidos hoy",    value: "—", icon: "🍔", color: "var(--color-accent)" },
  { label: "Mesas activas",  value: "—", icon: "🪑", color: "var(--color-info)" },
  { label: "Reservaciones",  value: "—", icon: "📅", color: "var(--color-success)" },
  { label: "Reseñas nuevas", value: "—", icon: "⭐", color: "var(--color-warning)" },
];

export const DashboardHome = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Bienvenida */}
      <div
        className="p-6 rounded-2xl"
        style={{ background: "linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))", border: "1px solid var(--border-color)" }}
      >
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          ¡Bienvenido, {user?.name || "Administrador"}! 🐆
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Panel de administración — Hamburguesas y Mixología el Gepardo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${color}20` }}
            >
              {icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div
        className="p-5 rounded-xl text-sm"
        style={{ background: "rgba(183,109,27,0.08)", border: "1px solid rgba(183,109,27,0.2)", color: "var(--text-secondary)" }}
      >
         Usa el menú lateral para navegar entre las secciones del panel.
      </div>
    </div>
  );
};