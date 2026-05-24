import { useEffect, useRef, useState, useCallback } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";
import { useAuthStore } from "../store/authStore.js";

/* ─────────────────────────────────────────
   CONSTANTES
───────────────────────────────────────── */
const STATUS = {
  pendiente:   { label: "Pendiente",      icon: "⏳", bg: "#FAEEDA", color: "#854F0B" },
  preparacion: { label: "En preparación", icon: "👨‍🍳", bg: "#E6F1FB", color: "#185FA5" },
  entregado:   { label: "Entregado",      icon: "✅", bg: "#E1F5EE", color: "#0F6E56" },
};

const timeAgo = (d) => {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "ahora mismo";
  if (m < 60) return `hace ${m} min`;
  return `hace ${Math.floor(m / 60)}h`;
};

/* ─────────────────────────────────────────
   SESSION STORAGE
   — usa sessionStorage para que el logout
     (que hace localStorage.clear) no borre
     el pedido activo del cliente
───────────────────────────────────────── */
const storageKey = (uid) => `gepardo_order_${uid}`;
const saveOrder  = (uid, data) => sessionStorage.setItem(storageKey(uid), JSON.stringify(data));
const loadOrder  = (uid) => { try { return JSON.parse(sessionStorage.getItem(storageKey(uid))); } catch { return null; } };
const clearOrder = (uid) => sessionStorage.removeItem(storageKey(uid));

/* ─────────────────────────────────────────
   OBTENER TODOS LOS PEDIDOS Y FILTRAR
   — el backend no tiene GET /orders/:id
     así que buscamos dentro del listado
───────────────────────────────────────── */
const fetchAllOrders = async () => {
  const res = await axiosAdmin.get("/orders");
  return res.data ?? [];
};

const findOrderById = (orders, id) =>
  orders.find((o) => (o._id ?? o.id) === id) ?? null;

/* ─────────────────────────────────────────
   BADGE
───────────────────────────────────────── */
const Badge = ({ status }) => {
  const s = STATUS[status] ?? STATUS.pendiente;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 12px", borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>
      {s.icon} {s.label}
    </span>
  );
};

/* ─────────────────────────────────────────
   VISTA CLIENTE
───────────────────────────────────────── */
const ClientView = ({ order, onRefresh, refreshing }) => {
  if (!order) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 14, padding: "5rem 1rem",
      border: "1px dashed var(--color-border-secondary)",
      borderRadius: "var(--border-radius-lg)",
      background: "var(--color-background-primary)", textAlign: "center",
    }}>
      <span style={{ fontSize: 52 }}>🍽️</span>
      <h3 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Sin pedidos aún</h3>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
        Usa el botón de abajo para hacer tu primer pedido.
      </p>
    </div>
  );

  const s = STATUS[order.status] ?? STATUS.pendiente;

  return (
    <div style={{
      maxWidth: 500, margin: "0 auto",
      background: "var(--color-background-primary)",
      border: "1px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)", overflow: "hidden",
    }}>
      {/* Header con color del estado */}
      <div style={{
        background: s.bg, padding: "22px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 11, color: s.color, margin: 0, fontWeight: 700, opacity: 0.65, letterSpacing: "0.05em" }}>
            TU PEDIDO
          </p>
          <p style={{ fontSize: 22, fontWeight: 600, margin: "4px 0 0", color: s.color }}>
            Mesa #{order.table?.number ?? "—"}
          </p>
          <p style={{ fontSize: 12, color: s.color, margin: "4px 0 0", opacity: 0.65 }}>
            {order.createdAt ? timeAgo(order.createdAt) : ""}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>{s.icon}</div>
          <p style={{ fontSize: 12, fontWeight: 700, color: s.color, margin: "4px 0 0" }}>{s.label}</p>
        </div>
      </div>

      {/* Mensaje descriptivo */}
      <div style={{
        padding: "12px 24px", fontSize: 13,
        color: "var(--color-text-secondary)",
        background: "var(--color-background-secondary)",
        borderBottom: "1px solid var(--color-border-tertiary)",
      }}>
        {order.status === "pendiente"   && "⏳ Tu pedido fue recibido y está esperando ser procesado."}
        {order.status === "preparacion" && "👨‍🍳 ¡Tu pedido está en cocina! No tardará mucho."}
        {order.status === "entregado"   && "✅ ¡Tu pedido fue entregado! Buen provecho 🎉"}
      </div>

      {/* Detalle items */}
      <div style={{ padding: "16px 24px" }}>
        <p style={{
          fontSize: 11, color: "var(--color-text-secondary)",
          marginBottom: 12, fontWeight: 700, letterSpacing: "0.06em",
        }}>
          DETALLE
        </p>
        {(order.items ?? []).map((item, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 14, marginBottom: 8, color: "var(--color-text-primary)",
          }}>
            <span>{item.menuItem?.name ?? item.name ?? "Item"}</span>
            <span style={{
              color: "var(--color-text-secondary)",
              background: "var(--color-background-secondary)",
              padding: "2px 8px", borderRadius: 999, fontSize: 12,
            }}>×{item.quantity}</span>
          </div>
        ))}
        <div style={{
          borderTop: "1px solid var(--color-border-tertiary)",
          marginTop: 10, paddingTop: 12,
          display: "flex", justifyContent: "space-between",
          fontSize: 15, fontWeight: 700,
        }}>
          <span>Total</span>
          <span>Q{(order.total ?? 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Botón actualizar */}
      <div style={{
        padding: "12px 24px",
        borderTop: "1px solid var(--color-border-tertiary)",
        textAlign: "center",
      }}>
        <button onClick={onRefresh} disabled={refreshing} style={{
          background: "none", border: "none",
          cursor: refreshing ? "default" : "pointer",
          fontSize: 13, color: "var(--color-text-secondary)",
          opacity: refreshing ? 0.5 : 1,
        }}>
          {refreshing ? "Actualizando..." : "🔄 Actualizar estado"}
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   VISTA ADMIN
───────────────────────────────────────── */
const AdminView = ({ orders, onUpdateStatus }) => {
  if (orders.length === 0) return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 8, padding: "5rem 0",
      border: "1px dashed var(--color-border-secondary)",
      borderRadius: "var(--border-radius-lg)",
      background: "var(--color-background-primary)", textAlign: "center",
    }}>
      <span style={{ fontSize: 42 }}>📋</span>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>No hay pedidos</h3>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
        Los pedidos aparecerán aquí cuando los clientes ordenen.
      </p>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
      {orders.map((order) => (
        <div key={order._id} style={{
          background: "var(--color-background-primary)",
          border: "1px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: "14px 16px", borderBottom: "1px solid var(--color-border-tertiary)",
          }}>
            <div>
              <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: 0 }}>Mesa</p>
              <p style={{ fontSize: 20, fontWeight: 600, margin: "2px 0 0" }}>
                #{order.table?.number ?? "—"}
              </p>
              <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
                {order.createdAt ? timeAgo(order.createdAt) : ""}
              </p>
            </div>
            <Badge status={order.status} />
          </div>

          {/* Items */}
          <div style={{ padding: "12px 16px" }}>
            {(order.items ?? []).map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, marginBottom: 5,
              }}>
                <span>{item.menuItem?.name ?? item.name ?? "Item"}</span>
                <span style={{ color: "var(--color-text-secondary)" }}>×{item.quantity}</span>
              </div>
            ))}
            <div style={{
              borderTop: "1px solid var(--color-border-tertiary)",
              marginTop: 8, paddingTop: 8,
              display: "flex", justifyContent: "space-between",
              fontSize: 14, fontWeight: 700,
            }}>
              <span>Total</span>
              <span>Q{(order.total ?? 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Botones de estado */}
          <div style={{
            display: "flex", gap: 6, padding: "10px 16px",
            background: "var(--color-background-secondary)",
            borderTop: "1px solid var(--color-border-tertiary)",
          }}>
            {order.status === "pendiente" && (
              <button
                onClick={() => onUpdateStatus(order._id, "preparacion")}
                style={actionBtn(STATUS.preparacion.bg, STATUS.preparacion.color)}>
                👨‍🍳 En preparación
              </button>
            )}
            {order.status === "preparacion" && (
              <button
                onClick={() => onUpdateStatus(order._id, "entregado")}
                style={actionBtn(STATUS.entregado.bg, STATUS.entregado.color)}>
                ✅ Marcar entregado
              </button>
            )}
            {order.status === "entregado" && (
              <span style={{
                flex: 1, textAlign: "center", fontSize: 12,
                color: STATUS.entregado.color, padding: "7px 0", fontWeight: 700,
              }}>
                ✅ Entregado
              </span>
            )}
            <button
              onClick={() => onUpdateStatus(order._id, "pendiente")}
              title="Reiniciar a pendiente"
              style={{
                padding: "6px 10px", borderRadius: 8, fontSize: 14,
                border: "1px solid var(--color-border-secondary)",
                background: "transparent", cursor: "pointer",
                color: "var(--color-text-secondary)",
              }}>
              ↺
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   MODAL NUEVO PEDIDO
───────────────────────────────────────── */
const OrderModal = ({ onClose, onCreated }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [tables,    setTables]    = useState([]);
  const [cart,      setCart]      = useState([]);
  const [tableId,   setTableId]   = useState("");
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    Promise.all([axiosAdmin.get("/menu-items"), axiosAdmin.get("/tables")])
      .then(([m, t]) => { setMenuItems(m.data); setTables(t.data); })
      .catch(() => setError("Error al cargar menú o mesas"))
      .finally(() => setLoading(false));
  }, []);

  const addItem = (item) =>
    setCart((p) => {
      const ex = p.find((c) => c._id === item._id);
      return ex
        ? p.map((c) => c._id === item._id ? { ...c, qty: c.qty + 1 } : c)
        : [...p, { ...item, qty: 1 }];
    });

  const removeItem = (id) =>
    setCart((p) => {
      const ex = p.find((c) => c._id === id);
      if (!ex) return p;
      return ex.qty === 1
        ? p.filter((c) => c._id !== id)
        : p.map((c) => c._id === id ? { ...c, qty: c.qty - 1 } : c);
    });

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const handleSubmit = async () => {
    if (!tableId)        { setError("Selecciona una mesa"); return; }
    if (cart.length < 1) { setError("Agrega al menos un item"); return; }
    setError(""); setSubmitting(true);

    try {
      // El backend espera table como ObjectId string, no como objeto
      const res = await axiosAdmin.post("/orders", {
        table: tableId,
        items: cart.map((c) => ({ menuItem: c._id, quantity: c.qty })),
      });

      const created = res.data;
      const tableObj = tables.find((t) => t._id === tableId);

      // Pasar al padre el pedido con los datos que necesita mostrar
      onCreated({
        orderId:   created._id ?? created.id,
        status:    created.status ?? "pendiente",
        total:     created.total ?? cartTotal,
        createdAt: created.createdAt ?? new Date().toISOString(),
        table:     tableObj ?? { number: "—" },
        // items enriquecidos con nombre para mostrar sin depender del servidor
        items: cart.map((c) => ({
          menuItem: { _id: c._id, name: c.name },
          name:     c.name,
          quantity: c.qty,
          price:    c.price,
        })),
      });
    } catch (e) {
      setError(e.response?.data?.message ?? e.response?.data?.error ?? "Error al crear el pedido");
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={(e) => { if (!submitting && e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: 620, maxHeight: "92vh", overflowY: "auto",
        borderRadius: 18, padding: 24,
        background: "linear-gradient(145deg,rgba(20,28,24,.98),rgba(10,14,12,.98))",
        border: "1px solid rgba(201,151,42,.25)",
        boxShadow: "0 24px 64px rgba(0,0,0,.6)",
      }}>
        <h2 style={{ color: "#fff", fontWeight: 300, fontSize: 22, marginBottom: 4 }}>Nuevo Pedido</h2>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: 13, marginBottom: 20 }}>
          Elige mesa e items
        </p>

        {loading ? (
          <p style={{ color: "rgba(255,255,255,.5)", textAlign: "center", padding: "2rem 0" }}>
            Cargando...
          </p>
        ) : (
          <>
            {/* Mesa */}
            <label style={{ color: "rgba(255,255,255,.6)", fontSize: 12, display: "block", marginBottom: 6 }}>
              Mesa
            </label>
            <select value={tableId} onChange={(e) => setTableId(e.target.value)} style={selectStyle}>
              <option value="">— Elige una mesa —</option>
              {tables.map((t) => (
                <option key={t._id} value={t._id}>
                  Mesa #{t.number} — {t.status === "disponible" ? "Disponible" : "Ocupada"}
                </option>
              ))}
            </select>

            {/* Menú */}
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 12, marginTop: 18, marginBottom: 8 }}>Menú</p>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 10, maxHeight: 270, overflowY: "auto", paddingRight: 4,
            }}>
              {menuItems.map((item) => {
                const inCart = cart.find((c) => c._id === item._id);
                return (
                  <div key={item._id} style={{
                    background: "rgba(255,255,255,.04)",
                    border: inCart
                      ? "1px solid rgba(201,151,42,.6)"
                      : "1px solid rgba(255,255,255,.08)",
                    borderRadius: 12, padding: 12,
                    display: "flex", flexDirection: "column", gap: 5,
                  }}>
                    <span style={{ color: "#C9972A", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em" }}>
                      {item.category ?? "Sin categoría"}
                    </span>
                    <p style={{ color: "#fff", fontSize: 13, margin: 0, fontWeight: 500 }}>{item.name}</p>
                    <p style={{ color: "#B8860B", fontSize: 13, margin: 0 }}>Q{Number(item.price).toFixed(2)}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={!inCart}
                        style={qtyBtnStyle(!inCart)}>−</button>
                      <span style={{ color: "#fff", fontSize: 13, minWidth: 16, textAlign: "center" }}>
                        {inCart?.qty ?? 0}
                      </span>
                      <button onClick={() => addItem(item)} style={qtyBtnActiveStyle}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen carrito */}
            {cart.length > 0 && (
              <div style={{
                marginTop: 14, background: "rgba(255,255,255,.04)",
                borderRadius: 12, padding: "12px 14px",
                border: "1px solid rgba(201,151,42,.2)",
              }}>
                <p style={{ color: "rgba(255,255,255,.5)", fontSize: 11, marginBottom: 8, letterSpacing: ".05em" }}>
                  RESUMEN
                </p>
                {cart.map((c) => (
                  <div key={c._id} style={{
                    display: "flex", justifyContent: "space-between",
                    color: "#fff", fontSize: 13, marginBottom: 4,
                  }}>
                    <span>{c.name} × {c.qty}</span>
                    <span>Q{(c.price * c.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{
                  borderTop: "1px solid rgba(255,255,255,.1)",
                  marginTop: 8, paddingTop: 8,
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span style={{ color: "#fff", fontWeight: 600 }}>Total</span>
                  <span style={{ color: "#B8860B", fontWeight: 700 }}>Q{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {error && (
              <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 10 }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={onClose} disabled={submitting} style={btnSecondary}>Cancelar</button>
              <button onClick={handleSubmit} disabled={submitting} style={btnPrimary}>
                {submitting ? "Enviando..." : "Confirmar pedido"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   PÁGINA PRINCIPAL
───────────────────────────────────────── */
export const OrdersPage = () => {
  const { user } = useAuthStore();

  // Normalizar rol — funciona con "Cliente","cliente","CLIENT","client"
  const isClient = ["cliente", "client"].includes((user?.role ?? "").toLowerCase());
  const uid = user?._id ?? user?.id ?? "guest";

  const [orders,      setOrders]      = useState([]);
  const [clientOrder, setClientOrder] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [showModal,   setShowModal]   = useState(false);

  const pollingRef = useRef(null);

  /* ── Obtener todos los pedidos y actualizar estado del cliente ── */
  const refreshOrders = useCallback(async () => {
    try {
      const all = await fetchAllOrders();

      if (!isClient) {
        // Admin: mostrar todos
        setOrders(all);
        return;
      }

      // Cliente: buscar su pedido activo por ID guardado
      const saved = loadOrder(uid);
      if (!saved) return;

      const found = findOrderById(all, saved.orderId);
      if (!found) return; // aún no apareció o fue eliminado — no borrar

      // Actualizar solo el status (lo que puede cambiar)
      setClientOrder((prev) =>
        prev ? { ...prev, status: found.status } : prev
      );
      // Persistir nuevo status
      saveOrder(uid, { ...saved, status: found.status });
    } catch { /* silencioso en polling */ }
  }, [isClient, uid]);

  /* ── Inicializar ── */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (isClient) {
          // Mostrar lo que tenemos guardado inmediatamente
          const saved = loadOrder(uid);
          if (saved) {
            setClientOrder(saved);
            // Luego actualizar status desde el servidor
            const all = await fetchAllOrders();
            const found = findOrderById(all, saved.orderId);
            if (found) {
              const updated = { ...saved, status: found.status };
              setClientOrder(updated);
              saveOrder(uid, updated);
            }
          }
        } else {
          // Admin: cargar todos
          const all = await fetchAllOrders();
          setOrders(all);
        }
      } catch { /* silencioso */ }
      finally  { setLoading(false); }
    };
    init();
  }, [isClient, uid]);

  /* ── Polling cada 5s ── */
  useEffect(() => {
    pollingRef.current = setInterval(refreshOrders, 5000);
    return () => clearInterval(pollingRef.current);
  }, [refreshOrders]);

  /* ── Admin: cambiar estado ── */
  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosAdmin.put(`/orders/${id}/status`, { status });
      // Recargar lista
      const all = await fetchAllOrders();
      setOrders(all);
    } catch { alert("Error al actualizar estado"); }
  };

  /* ── Cliente: refrescar manualmente ── */
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  /* ── Pedido creado ── */
  const handleOrderCreated = (orderData) => {
    setShowModal(false);
    if (isClient) {
      saveOrder(uid, orderData);
      setClientOrder(orderData);
    } else {
      fetchAllOrders().then(setOrders).catch(() => {});
    }
  };

  /* ── KPIs admin ── */
  const kpis = {
    total:       orders.length,
    pendiente:   orders.filter((o) => o.status === "pendiente").length,
    preparacion: orders.filter((o) => o.status === "preparacion").length,
    ingresos:    orders.reduce((s, o) => s + (o.total ?? 0), 0),
  };

  return (
    <div style={{ padding: "1.5rem 0" }}>

      {/* HEADER */}
      <div style={{
        marginBottom: "1.5rem",
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
            Pedidos
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
            {isClient ? "Realiza y consulta tus pedidos" : "Control de órdenes en tiempo real"}
          </p>
        </div>
        {!isClient && (
          <button
            onClick={async () => { const all = await fetchAllOrders(); setOrders(all); }}
            style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 12,
              border: "1px solid var(--color-border-secondary)",
              background: "transparent", cursor: "pointer",
              color: "var(--color-text-secondary)",
            }}>
            🔄 Recargar
          </button>
        )}
      </div>

      {/* KPIs — solo admin */}
      {!isClient && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: "1.5rem" }}>
          {[
            { label: "Total pedidos",  value: kpis.total,       bg: "var(--color-background-secondary)", color: "var(--color-text-primary)" },
            { label: "Pendientes",     value: kpis.pendiente,   bg: "#FAEEDA", color: "#854F0B" },
            { label: "En preparación", value: kpis.preparacion, bg: "#E6F1FB", color: "#185FA5" },
            { label: "Ingresos",       value: `Q${kpis.ingresos.toFixed(2)}`, bg: "#E1F5EE", color: "#0F6E56" },
          ].map((k) => (
            <div key={k.label} style={{
              background: k.bg, borderRadius: "var(--border-radius-md)", padding: "1rem",
            }}>
              <p style={{ fontSize: 12, color: k.color, marginBottom: 6, opacity: 0.7 }}>{k.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: k.color, margin: 0 }}>{k.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* CONTENIDO */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 240 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "3px solid #E1F5EE", borderTop: "3px solid #0F6E56",
            animation: "spin .8s linear infinite",
          }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : isClient ? (
        <ClientView order={clientOrder} onRefresh={handleRefresh} refreshing={refreshing} />
      ) : (
        <AdminView orders={orders} onUpdateStatus={handleUpdateStatus} />
      )}

      {/* BOTÓN HACER PEDIDO */}
      <div style={{
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: isClient ? "center" : "flex-end",
      }}>
        <button onClick={() => setShowModal(true)} style={{
          background: "#0F6E56", color: "#fff", border: "none",
          borderRadius: "var(--border-radius-md)", cursor: "pointer",
          padding: isClient ? "13px 36px" : "10px 16px",
          fontSize: 13, fontWeight: 700,
        }}>
          {isClient && clientOrder ? "✚ Hacer otro pedido" : "+ Hacer pedido"}
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <OrderModal onClose={() => setShowModal(false)} onCreated={handleOrderCreated} />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   ESTILOS
───────────────────────────────────────── */
const actionBtn = (bg, color) => ({
  flex: 1, padding: "7px 0", fontSize: 12, fontWeight: 700,
  borderRadius: 8, border: `1px solid ${color}`,
  background: bg, color, cursor: "pointer",
});

const selectStyle = {
  width: "100%", boxSizing: "border-box", padding: "11px 14px",
  borderRadius: 10, border: "1px solid rgba(255,255,255,.08)",
  background: "rgba(255,255,255,.04)", color: "#fff",
  outline: "none", fontSize: 13,
};

const qtyBtnStyle = (disabled) => ({
  width: 26, height: 26, borderRadius: "50%",
  border: "1px solid rgba(255,255,255,.15)", background: "transparent",
  color: "#fff", cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.3 : 1, fontSize: 16,
  display: "flex", alignItems: "center", justifyContent: "center",
});

const qtyBtnActiveStyle = {
  width: 26, height: 26, borderRadius: "50%",
  border: "none", background: "#B8860B", color: "#fff",
  cursor: "pointer", fontSize: 16,
  display: "flex", alignItems: "center", justifyContent: "center",
};

const btnSecondary = {
  flex: 1, padding: 12, borderRadius: 10,
  border: "1px solid rgba(255,255,255,.12)", background: "transparent",
  color: "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 13,
};

const btnPrimary = {
  flex: 1, padding: 12, borderRadius: 10, border: "none",
  background: "linear-gradient(135deg,#0F6E56,#1a9e7a)",
  color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13,
};
