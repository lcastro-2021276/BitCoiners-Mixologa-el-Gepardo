// src/features/dashboard/DashboardHome.jsx
import { useAuthStore } from "../../auth/store/authStore";
import {
  ClipboardDocumentListIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const gold = "#B8860B";
const goldLight = "#C9972A";
const serif = "'Cormorant Garamond', Georgia, serif";

const STATS = [
  { label: "Pedidos hoy",    value: "128", icon: ClipboardDocumentListIcon },
  { label: "Mesas activas",  value: "24",  icon: TableCellsIcon },
  { label: "Reservaciones",  value: "16",  icon: CalendarDaysIcon },
  { label: "Reseñas nuevas", value: "37",  icon: StarIcon },
];

const ACTIVITY = [
  "Nueva reservación para 4 personas",
  "Pedido #1024 entregado correctamente",
  "Nueva reseña de cliente recibida",
  "Mesa VIP marcada como ocupada",
];

export const DashboardHome = () => {
  const user = useAuthStore((s) => s.user);
  const isClient = user?.role === "Cliente" || user?.role === "CLIENT";

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "28px" }}>

      <section style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#0e1e15",
        padding: "48px 48px 44px",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "40px", right: "40px", height: "1px",
          background: `linear-gradient(to right, transparent, ${gold}55, transparent)`,
        }} />

        <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: `${gold}99`, marginBottom: "16px" }}>
          {isClient ? "Panel Cliente" : "Panel Administrativo"}
        </p>

        <h1 style={{ fontFamily: serif, fontSize: "44px", fontWeight: 300, color: "#fff", lineHeight: 1.1, margin: 0 }}>
          Bienvenido,
          <span style={{ display: "block", color: goldLight }}>
            {user?.name || (isClient ? "Cliente" : "Administrador")}
          </span>
        </h1>

        <p style={{ marginTop: "16px", fontSize: "13px", lineHeight: 1.7, color: "rgba(255,255,255,0.45)", maxWidth: "520px" }}>
          {isClient
            ? <>Realiza tus pedidos y disfruta la experiencia de{" "}<span style={{ color: `${goldLight}cc` }}>Hamburguesas y Mixología El Gepardo</span>.</>
            : <>Gestiona pedidos, reservaciones, mesas y la experiencia gastronómica de{" "}<span style={{ color: `${goldLight}cc` }}>Hamburguesas y Mixología El Gepardo</span>.</>
          }
        </p>

        <div style={{ marginTop: "28px", display: "flex", gap: "12px" }}>
          <button style={{
            background: gold, color: "#fff", border: "none",
            borderRadius: "8px", padding: "10px 24px",
            fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em", cursor: "pointer",
          }}>
            Ver pedidos
          </button>
          {!isClient && (
            <button style={{
              background: "transparent", color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px", padding: "10px 24px",
              fontSize: "12px", fontWeight: 400, letterSpacing: "0.06em", cursor: "pointer",
            }}>
              Gestionar menú
            </button>
          )}
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: "40px", right: "40px", height: "1px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)",
        }} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} style={{
            background: "#fff",
            border: "1px solid #e8e4dc",
            borderRadius: "12px",
            padding: "20px 22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa", margin: 0 }}>
                {label}
              </p>
              <Icon style={{ width: "15px", height: "15px", color: "#ccc", flexShrink: 0 }} />
            </div>
            <p style={{ fontFamily: serif, fontSize: "38px", fontWeight: 300, color: "#1a1a1a", margin: 0, lineHeight: 1 }}>
              {value}
            </p>
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              <span style={{ fontSize: "10px", color: "#bbb" }}>Actualizado ahora</span>
            </div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "16px" }}>

        <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: "12px", padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888", margin: 0 }}>
                Actividad reciente
              </p>
              <p style={{ fontSize: "11px", color: "#bbb", marginTop: "3px", marginBottom: 0 }}>
                Últimos movimientos del sistema
              </p>
            </div>
            <button style={{ fontSize: "11px", color: gold, background: "none", border: "none", cursor: "pointer" }}>
              Ver todo →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {ACTIVITY.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "12px 14px",
                borderTop: i === 0 ? "none" : "1px solid #f0ece4",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: `${gold}80`, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "13px", color: "#333", margin: 0 }}>{item}</p>
                  <span style={{ fontSize: "11px", color: "#bbb" }}>Hace unos minutos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#111008", borderRadius: "12px", padding: "28px 24px", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: 0 }}>
            Rendimiento
          </p>
          <p style={{ fontFamily: serif, fontSize: "52px", fontWeight: 300, color: goldLight, margin: "12px 0 4px", lineHeight: 1 }}>
            98%
          </p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>
            Satisfacción de clientes este mes
          </p>

          <div style={{ marginTop: "auto", paddingTop: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>
              <span>Meta mensual</span><span>98 / 100</span>
            </div>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}>
              <div style={{ height: "1px", width: "98%", background: `${gold}70` }} />
            </div>
          </div>

          <button style={{
            marginTop: "20px", width: "100%",
            background: "transparent",
            border: `1px solid ${gold}40`,
            borderRadius: "8px", padding: "10px",
            fontSize: "11px", letterSpacing: "0.06em",
            color: `${goldLight}99`, cursor: "pointer",
          }}>
            Ver estadísticas
          </button>
        </div>
      </section>

      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        background: "#fff", border: "1px solid #e8e4dc",
        borderRadius: "12px", padding: "16px 20px",
      }}>
        <div style={{
          width: "32px", height: "32px", flexShrink: 0,
          background: `${gold}15`, borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
        }}>
          🌿
        </div>
        <p style={{ fontSize: "12px", color: "#888", margin: 0, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 500, color: "#444" }}>Consejo rápido — </span>
          {isClient
            ? "Usa el menú lateral para hacer pedidos y consultar tus reservaciones."
            : "Usa el menú lateral para administrar pedidos, mesas y reservas rápidamente."
          }
        </p>
      </div>

    </div>
  );
};