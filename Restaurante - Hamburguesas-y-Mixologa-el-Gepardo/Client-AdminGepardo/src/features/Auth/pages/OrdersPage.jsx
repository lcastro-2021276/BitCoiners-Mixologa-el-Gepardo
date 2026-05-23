import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";

const STATUS_CONFIG = {
  pendiente: {
    badge: "background:#FAEEDA;color:#854F0B",
    label: "Pendiente",
  },
  preparacion: {
    badge: "background:#E6F1FB;color:#185FA5",
    label: "En preparación",
  },
  entregado: {
    badge: "background:#E1F5EE;color:#0F6E56",
    label: "Entregado",
  },
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1) return "ahora mismo";
  if (diff < 60) return `hace ${diff} min`;
  return `hace ${Math.floor(diff / 60)}h`;
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosAdmin.get("/orders");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axiosAdmin.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch {
      alert("Error al actualizar estado");
    }
  };

  // ✅ NUEVA FUNCIÓN: HACER PEDIDO
  const createOrder = async () => {
    const tableNumber = prompt("Número de mesa para el nuevo pedido:");

    if (!tableNumber) return;

    try {
      await axiosAdmin.post("/orders", {
        table: { number: Number(tableNumber) },
        items: [],
        status: "pendiente",
        createdAt: new Date().toISOString(),
      });

      fetchOrders();
    } catch (error) {
      alert("Error al crear el pedido");
    }
  };

  const total = orders.length;
  const pendiente = orders.filter((o) => o.status === "pendiente").length;
  const preparacion = orders.filter((o) => o.status === "preparacion").length;
  const revenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div style={{ padding: "1.5rem 0" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Pedidos
        </h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
          Control de órdenes en tiempo real
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: "1.5rem" }}>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>Total pedidos</p>
          <p style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)" }}>{total}</p>
        </div>

        <div style={{ background: "#FAEEDA", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <p style={{ fontSize: 12, color: "#854F0B", marginBottom: 6 }}>Pendientes</p>
          <p style={{ fontSize: 24, fontWeight: 500, color: "#854F0B" }}>{pendiente}</p>
        </div>

        <div style={{ background: "#E6F1FB", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <p style={{ fontSize: 12, color: "#185FA5", marginBottom: 6 }}>En preparación</p>
          <p style={{ fontSize: 24, fontWeight: 500, color: "#185FA5" }}>{preparacion}</p>
        </div>

        <div style={{ background: "#E1F5EE", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <p style={{ fontSize: 12, color: "#0F6E56", marginBottom: 6 }}>Ingresos</p>
          <p style={{ fontSize: 24, fontWeight: 500, color: "#0F6E56" }}>
            Q{revenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 240 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid #E1F5EE",
            borderTop: "3px solid #0F6E56",
            animation: "spin 0.8s linear infinite"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 0",
          textAlign: "center",
          border: "0.5px dashed var(--color-border-secondary)",
          borderRadius: "var(--border-radius-lg)",
          background: "var(--color-background-primary)"
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 500 }}>No hay pedidos aún</h3>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 6 }}>
            Los pedidos aparecerán aquí cuando los clientes ordenen.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pendiente;

            return (
              <div
                key={order._id}
                style={{
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)",
                  overflow: "hidden"
                }}
              >

                {/* HEADER CARD */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderBottom: "0.5px solid var(--color-border-tertiary)"
                }}>
                  <div>
                    <p style={{ fontSize: 11 }}>Mesa</p>
                    <p style={{ fontSize: 16, fontWeight: 500 }}>
                      #{order.table?.number ?? "—"}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                      {timeAgo(order.createdAt)}
                    </p>
                  </div>

                  <span style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    borderRadius: 999,
                    ...Object.fromEntries(
                      status.badge.split(";").map((s) => {
                        const [k, v] = s.split(":");
                        return [k, v];
                      })
                    )
                  }}>
                    {status.label}
                  </span>
                </div>

                {/* BODY */}
                <div style={{ padding: "14px 16px" }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{item.menuItem?.name}</span>
                      <span>×{item.quantity}</span>
                    </div>
                  ))}

                  <hr />

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total</span>
                    <strong>Q{order.total.toFixed(2)}</strong>
                  </div>
                </div>

                {/* FOOTER */}
                <div style={{
                  display: "flex",
                  gap: 8,
                  padding: "12px 16px",
                  background: "var(--color-background-secondary)"
                }}>
                  <button
                    onClick={() =>
                      updateStatus(
                        order._id,
                        order.status === "pendiente"
                          ? "preparacion"
                          : "entregado"
                      )
                    }
                  >
                    Avanzar estado
                  </button>

                  <button onClick={() => updateStatus(order._id, "entregado")}>
                    ✓
                  </button>

                  <button onClick={() => updateStatus(order._id, "pendiente")}>
                    ↺
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      <div style={{
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "flex-end"
      }}>
        <button
          onClick={createOrder}
          style={{
            background: "#0F6E56",
            color: "#E1F5EE",
            border: "none",
            borderRadius: "var(--border-radius-md)",
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          + Hacer pedido
        </button>
      </div>

    </div>
  );
};