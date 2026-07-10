// src/features/dashboard/DashboardHome.jsx
import { useAuthStore } from "../../auth/store/authStore";
import {
  ClipboardDocumentListIcon,
  TableCellsIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const primary = "#0F6E56";
const primaryLight = "#16a34a";
const accent = "#d97706";
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
        borderRadius: "20px",
        border: "1px solid rgba(15, 110, 86, 0.1)",
        background: "linear-gradient(135deg, #f5f0e8 0%, #ffffff 50%, #f5f0e8 100%)",
        padding: "56px 56px 52px",
        boxShadow: "0 8px 32px rgba(15, 110, 86, 0.08)",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "40px", right: "40px", height: "1px",
          background: `linear-gradient(to right, transparent, ${primary}30, transparent)`,
        }} />

        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: `${primary}80`, marginBottom: "18px" }}>
          {isClient ? "Panel Cliente" : "Panel Administrativo"}
        </p>

        <h1 style={{ fontFamily: serif, fontSize: "48px", fontWeight: 400, color: "#1a1a1a", lineHeight: 1.1, margin: 0 }}>
          Bienvenido,
          <span style={{ display: "block", color: primaryLight }}>
            {user?.name || (isClient ? "Cliente" : "Administrador")}
          </span>
        </h1>

        <p style={{ marginTop: "18px", fontSize: "14px", lineHeight: 1.7, color: "#6b7280", maxWidth: "560px" }}>
          {isClient
            ? <>Realiza tus pedidos y disfruta la experiencia de{" "}<span style={{ color: primaryLight, fontWeight: 500 }}>Hamburguesas y Mixología El Gepardo</span>.</>
            : <>Gestiona pedidos, reservaciones, mesas y la experiencia gastronómica de{" "}<span style={{ color: primaryLight, fontWeight: 500 }}>Hamburguesas y Mixología El Gepardo</span>.</>
          }
        </p>

        <div style={{ marginTop: "32px", display: "flex", gap: "14px" }}>
          <button style={{
            background: primary, color: "#fff", border: "none",
            borderRadius: "12px", padding: "12px 28px",
            fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(15, 110, 86, 0.25)",
            transition: "all 0.3s ease",
          }}>
            Ver pedidos
          </button>
          {!isClient && (
            <button style={{
              background: "#ffffff", color: primary,
              border: `2px solid ${primary}30`,
              borderRadius: "12px", padding: "12px 28px",
              fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", cursor: "pointer",
              transition: "all 0.3s ease",
            }}>
              Gestionar menú
            </button>
          )}
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: "40px", right: "40px", height: "1px",
          background: "linear-gradient(to right, transparent, rgba(15, 110, 86, 0.08), transparent)",
        }} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} style={{
            background: "#ffffff",
            border: "1px solid rgba(15, 110, 86, 0.1)",
            borderRadius: "16px",
            padding: "24px 26px",
            boxShadow: "0 4px 20px rgba(15, 110, 86, 0.06)",
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", margin: 0 }}>
                {label}
              </p>
              <Icon style={{ width: "18px", height: "18px", color: primary, flexShrink: 0 }} />
            </div>
            <p style={{ fontFamily: serif, fontSize: "42px", fontWeight: 400, color: "#1a1a1a", margin: 0, lineHeight: 1 }}>
              {value}
            </p>
            <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: primaryLight, display: "inline-block" }} />
              <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 500 }}>Actualizado ahora</span>
            </div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "20px" }}>

        <div style={{ background: "#ffffff", border: "1px solid rgba(15, 110, 86, 0.1)", borderRadius: "16px", padding: "28px 32px", boxShadow: "0 4px 20px rgba(15, 110, 86, 0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b7280", margin: 0 }}>
                Actividad reciente
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", marginBottom: 0 }}>
                Últimos movimientos del sistema
              </p>
            </div>
            <button style={{ fontSize: "12px", color: primary, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Ver todo →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {ACTIVITY.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "14px 16px",
                borderTop: i === 0 ? "none" : "1px solid rgba(15, 110, 86, 0.08)",
                borderRadius: "12px",
                backgroundColor: i === 0 ? "rgba(15, 110, 86, 0.03)" : "transparent",
              }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: primary, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "14px", color: "#1a1a1a", margin: 0, fontWeight: 500 }}>{item}</p>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Hace unos minutos</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", borderRadius: "16px", padding: "32px 28px", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Rendimiento
          </p>
          <p style={{ fontFamily: serif, fontSize: "56px", fontWeight: 400, color: primaryLight, margin: "16px 0 6px", lineHeight: 1 }}>
            98%
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>
            Satisfacción de clientes este mes
          </p>

          <div style={{ marginTop: "auto", paddingTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "8px", fontWeight: 500 }}>
              <span>Meta mensual</span><span>98 / 100</span>
            </div>
            <div style={{ height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
              <div style={{ height: "2px", width: "98%", background: primaryLight, borderRadius: "2px", boxShadow: "0 0 10px rgba(22, 163, 74, 0.5)" }} />
            </div>
          </div>

          <button style={{
            marginTop: "24px", width: "100%",
            background: "transparent",
            border: `1px solid ${primaryLight}50`,
            borderRadius: "12px", padding: "12px",
            fontSize: "12px", letterSpacing: "0.06em", fontWeight: 600,
            color: primaryLight, cursor: "pointer",
            transition: "all 0.3s ease",
          }}>
            Ver estadísticas
          </button>
        </div>
      </section>

      <div style={{
        display: "flex", alignItems: "center", gap: "16px",
        background: "#ffffff", border: "1px solid rgba(15, 110, 86, 0.1)",
        borderRadius: "16px", padding: "18px 24px",
        boxShadow: "0 4px 20px rgba(15, 110, 86, 0.06)",
      }}>
        <div style={{
          width: "36px", height: "36px", flexShrink: 0,
          background: `${primary}15`, borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
        }}>
          �️
        </div>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: "#1a1a1a" }}>Consejo rápido — </span>
          {isClient
            ? "Usa el menú lateral para hacer pedidos y consultar tus reservaciones."
            : "Usa el menú lateral para administrar pedidos, mesas y reservas rápidamente."
          }
        </p>
      </div>

    </div>
  );
};