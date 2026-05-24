import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";
import { useAuthStore } from "../store/authStore.js";

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

  // Modal de nuevo pedido
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [cart, setCart] = useState([]); // [{menuItem, quantity}]
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const { user } = useAuthStore();
  const isClient = user?.role === "Cliente" || user?.role === "CLIENT";
  const isAdmin = user?.role === "Admin" || user?.role === "ADMIN";

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

  // Solo admin puede cambiar estado
  const updateStatus = async (id, status) => {
    if (isClient) return;
    try {
      await axiosAdmin.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch {
      alert("Error al actualizar estado");
    }
  };

  // Abrir modal y cargar datos
  const openOrderModal = async () => {
    setOrderError("");
    setCart([]);
    setSelectedTable("");
    try {
      const [menuRes, tablesRes] = await Promise.all([
        axiosAdmin.get("/menu-items"),
        axiosAdmin.get("/tables"),
      ]);
      setMenuItems(menuRes.data);
      setTables(tablesRes.data);
    } catch {
      setOrderError("Error al cargar el menú o mesas");
    }
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    if (creatingOrder) return;
    setShowOrderModal(false);
    setCart([]);
    setSelectedTable("");
    setOrderError("");
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem._id === item._id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem._id === itemId);
      if (existing?.quantity === 1) {
        return prev.filter((c) => c.menuItem._id !== itemId);
      }
      return prev.map((c) =>
        c.menuItem._id === itemId ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  };

  const cartTotal = cart.reduce(
    (acc, c) => acc + c.menuItem.price * c.quantity,
    0
  );

  const handleCreateOrder = async () => {
    setOrderError("");
    if (!selectedTable) {
      setOrderError("Selecciona una mesa");
      return;
    }
    if (cart.length === 0) {
      setOrderError("Agrega al menos un item");
      return;
    }

    setCreatingOrder(true);
    try {
      const tableObj = tables.find((t) => t._id === selectedTable);
      await axiosAdmin.post("/orders", {
        table: { number: tableObj?.number ?? 0, _id: selectedTable },
        items: cart.map((c) => ({
          menuItem: c.menuItem._id,
          quantity: c.quantity,
        })),
        status: "pendiente",
        total: cartTotal,
        createdAt: new Date().toISOString(),
      });
      closeOrderModal();
      fetchOrders();
    } catch (err) {
      setOrderError(err.response?.data?.message || "Error al crear el pedido");
    } finally {
      setCreatingOrder(false);
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
          {isClient ? "Realiza y consulta tus pedidos" : "Control de órdenes en tiempo real"}
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
            {isClient
              ? "Haz tu primer pedido usando el botón de abajo."
              : "Los pedidos aparecerán aquí cuando los clientes ordenen."}
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
                    <strong>Q{(order.total || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {/* FOOTER — solo admin cambia estado */}
                {!isClient && (
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
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* BOTÓN HACER PEDIDO — visible para todos */}
      <div style={{
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "flex-end"
      }}>
        <button
          onClick={openOrderModal}
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

      {/* ===========================
            MODAL HACER PEDIDO
      =========================== */}
      {showOrderModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 50,
        }}>
          <div style={{
            width: "100%",
            maxWidth: "620px",
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: "18px",
            background: "linear-gradient(145deg, rgba(20,28,24,0.98), rgba(10,14,12,0.98))",
            border: "1px solid rgba(201,151,42,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            padding: "24px",
          }}>

            <h2 style={{ color: "#fff", fontWeight: 300, fontSize: 22, marginBottom: 6 }}>
              Nuevo Pedido
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 20 }}>
              Selecciona la mesa y los items que deseas ordenar
            </p>

            {/* SELECCIÓN DE MESA */}
            <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, display: "block", marginBottom: 6 }}>
              Mesa
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              style={inputStyle}
            >
              <option value="">— Elige una mesa —</option>
              {tables.map((t) => (
                <option key={t._id} value={t._id}>
                  Mesa #{t.number} — {t.status === "disponible" ? "Disponible" : "Ocupada"}
                </option>
              ))}
            </select>

            {/* MENÚ */}
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 18, marginBottom: 8 }}>
              Menú
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              maxHeight: "280px",
              overflowY: "auto",
              paddingRight: 4,
            }}>
              {menuItems.map((item) => {
                const inCart = cart.find((c) => c.menuItem._id === item._id);
                return (
                  <div key={item._id} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: inCart ? "1px solid rgba(201,151,42,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}>
                    <span style={{ color: "#C9972A", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {item.category || "Sin categoría"}
                    </span>
                    <p style={{ color: "#fff", fontSize: 13, margin: 0, fontWeight: 500 }}>
                      {item.name}
                    </p>
                    <p style={{ color: "#B8860B", fontSize: 13, margin: 0 }}>
                      Q{Number(item.price).toFixed(2)}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        disabled={!inCart}
                        style={{
                          width: 26, height: 26,
                          borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "transparent",
                          color: "#fff",
                          cursor: inCart ? "pointer" : "not-allowed",
                          opacity: inCart ? 1 : 0.3,
                          fontSize: 16,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >−</button>
                      <span style={{ color: "#fff", fontSize: 13, minWidth: 16, textAlign: "center" }}>
                        {inCart?.quantity ?? 0}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          width: 26, height: 26,
                          borderRadius: "50%",
                          border: "none",
                          background: "#B8860B",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 16,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RESUMEN */}
            {cart.length > 0 && (
              <div style={{
                marginTop: 16,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                padding: "12px 14px",
                border: "1px solid rgba(201,151,42,0.2)"
              }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 8 }}>
                  RESUMEN DEL PEDIDO
                </p>
                {cart.map((c) => (
                  <div key={c.menuItem._id} style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontSize: 13, marginBottom: 4 }}>
                    <span>{c.menuItem.name} × {c.quantity}</span>
                    <span>Q{(c.menuItem.price * c.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#fff", fontWeight: 500 }}>Total</span>
                  <span style={{ color: "#B8860B", fontWeight: 600 }}>Q{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {orderError && (
              <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 10 }}>{orderError}</p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={closeOrderModal}
                disabled={creatingOrder}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent", color: "rgba(255,255,255,0.7)", cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={creatingOrder}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  background: "linear-gradient(135deg, #0F6E56, #1a9e7a)",
                  border: "none", color: "#fff", fontWeight: 500, cursor: "pointer"
                }}
              >
                {creatingOrder ? "Enviando..." : "Confirmar pedido"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  outline: "none",
  fontSize: 13,
};
