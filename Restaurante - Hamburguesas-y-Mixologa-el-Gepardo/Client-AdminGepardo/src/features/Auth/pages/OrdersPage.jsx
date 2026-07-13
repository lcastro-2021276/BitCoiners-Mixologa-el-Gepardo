import { useEffect, useRef, useState, useCallback } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";
import { useAuthStore } from "../store/authStore.js";
import {
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
  MinusIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

const STATUS = {
  pendiente: {
    label: "Pendiente",
    Icon: ClockIcon,
    tw: "status-pending",
    dot: "bg-[#f59e0b]",
    bar: "bg-[#f59e0b]",
    glow: "shadow-[#f59e0b]/20",
    bg: "bg-[#f59e0b]/10",
  },
  preparacion: {
    label: "En preparación",
    Icon: FireIcon,
    tw: "status-preparing",
    dot: "bg-[#3b82f6]",
    bar: "bg-[#3b82f6]",
    glow: "shadow-[#3b82f6]/20",
    bg: "bg-[#3b82f6]/10",
  },
  entregado: {
    label: "Entregado",
    Icon: CheckCircleSolid,
    tw: "status-delivered",
    dot: "bg-[#10b981]",
    bar: "bg-[#10b981]",
    glow: "shadow-[#10b981]/20",
    bg: "bg-[#10b981]/10",
  },
};

const timeAgo = (d) => {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "Ahora mismo";
  if (m < 60) return `Hace ${m} min`;
  return `Hace ${Math.floor(m / 60)}h`;
};

const storageKey = (uid) => `gepardo_order_${uid}`;
const saveOrder = (uid, data) => sessionStorage.setItem(storageKey(uid), JSON.stringify(data));
const loadOrder = (uid) => { try { return JSON.parse(sessionStorage.getItem(storageKey(uid))); } catch { return null; } };
const fetchAllOrders = async () => { const res = await axiosAdmin.get("/orders"); return res.data ?? []; };
const findOrderById = (orders, id) => orders.find((o) => (o._id ?? o.id) === id) ?? null;

const StatusBadge = ({ status }) => {
  const s = STATUS[status] ?? STATUS.pendiente;
  return (
    <span className={`order-status-badge ${s.tw}`}>
      <span className={`status-dot ${s.dot}`} />
      {s.label}
    </span>
  );
};

const KpiCard = ({ label, value, accent }) => (
  <div className="order-kpi-card flex flex-col items-center justify-center text-center">
    <div className={`order-kpi-glow ${accent}`} />
    <p className="order-kpi-value">{value}</p>
    <p className="order-kpi-label">{label}</p>
  </div>
);

// ─── ADMIN STATUS SELECTOR ────────────────────────────────────────────────────
// Inline dropdown that lets the admin move an order through any status directly.
const AdminStatusSelector = ({ currentStatus, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const s = STATUS[currentStatus] ?? STATUS.pendiente;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-bold tracking-wide uppercase transition ${s.tw} hover:opacity-80`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${s.dot} animate-pulse`} />
        {s.label}
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-[#C9972A]/20 bg-[#0d1b14] shadow-xl shadow-black/40">
          {Object.entries(STATUS).map(([key, st]) => (
            <button
              key={key}
              onClick={() => { onSelect(key); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-4 py-3 text-[11px] font-bold uppercase tracking-wide transition hover:bg-white/5 ${
                key === currentStatus ? "opacity-40 cursor-default" : ""
              }`}
              disabled={key === currentStatus}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              <span style={{ color: key === "pendiente" ? "#C9972A" : key === "preparacion" ? "#4A90E2" : "#2ecc71" }}>
                {st.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const AdminView = ({ orders, onUpdateStatus }) => {
  if (orders.length === 0) return (
    <div className="order-empty-state">
      <div className="order-empty-icon">📋</div>
      <h3 className="order-empty-title">Sin pedidos activos</h3>
      <p className="order-empty-text">Los pedidos aparecerán aquí en tiempo real.</p>
    </div>
  );

  return (
    <div className="order-table">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Mesa</th>
              <th>Estado</th>
              <th>Items</th>
              <th>Total</th>
              <th>Tiempo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const s = STATUS[order.status] ?? STATUS.pendiente;
              return (
                <tr key={order._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.dot} animate-pulse`} />
                      <span className="text-[13px] font-bold text-gray-900">#{order.table?.number ?? "—"}</span>
                    </div>
                  </td>

                  {/* ── Status column: now uses the inline dropdown selector ── */}
                  <td>
                    <AdminStatusSelector
                      currentStatus={order.status}
                      onSelect={(newStatus) => onUpdateStatus(order._id, newStatus)}
                    />
                  </td>

                  <td className="max-w-[220px]">
                    <p className="truncate text-[13px] text-zinc-400">
                      {(order.items ?? []).map((item) => item.menuItem?.name ?? item.name ?? "Item").join(", ")}
                    </p>
                  </td>
                  <td>
                    <span className="text-[14px] font-bold text-gray-900">Q{(order.total ?? 0).toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="text-[13px] text-zinc-500">{order.createdAt ? timeAgo(order.createdAt) : ""}</span>
                  </td>

                  {/* ── Actions column: kept Preparar / Entregar buttons + reset ── */}
                  <td>
                    <div className="flex items-center justify-end gap-2.5">
                      {order.status === "pendiente" && (
                        <button
                          onClick={() => onUpdateStatus(order._id, "preparacion")}
                          className="order-action-button order-action-button-secondary"
                        >
                          <FireIcon className="h-3.5 w-3.5" /> Preparar
                        </button>
                      )}
                      {order.status === "preparacion" && (
                        <button
                          onClick={() => onUpdateStatus(order._id, "entregado")}
                          className="order-action-button order-action-button-success"
                        >
                          <CheckCircleIcon className="h-3.5 w-3.5" /> Entregar
                        </button>
                      )}
                      {order.status === "entregado" && (
                        <span className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-[#10b981]">
                          <CheckCircleSolid className="h-4 w-4" /> Entregado
                        </span>
                      )}
                      <button
                        onClick={() => onUpdateStatus(order._id, "pendiente")}
                        title="Reiniciar a pendiente"
                        className="order-action-button"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── CLIENT VIEW ─────────────────────────────────────────────────────────────
// The client only sees their order status — no controls to change it.
const ClientView = ({ order, onRefresh, refreshing }) => {
  if (!order) return (
    <div className="mx-auto max-w-lg">
      <div className="order-empty-state">
        <div className="order-empty-icon">🍽️</div>
        <h3 className="order-empty-title">Sin pedidos aún</h3>
        <p className="order-empty-text">
          Explora nuestro delicioso menú y haz tu primer pedido usando el botón de abajo.
        </p>
        <div className="flex gap-6 text-3xl opacity-40 mt-6">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍔</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍕</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🍹</span>
        </div>
      </div>
    </div>
  );

  const s = STATUS[order.status] ?? STATUS.pendiente;
  const { Icon } = s;
  const statusMsg = {
    pendiente: "Tu pedido fue recibido y está en la cola. En breve comenzará su preparación.",
    preparacion: "¡Tu pedido está en cocina! El equipo está trabajando en él.",
    entregado: "¡Tu pedido fue entregado exitosamente! Buen provecho.",
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="order-client-card">
        <div className={`h-[4px] w-full ${s.bar} animate-pulse`} />

        <div className="flex items-center justify-between px-8 py-8">
          <div className="flex items-center gap-5">
            <div className={`order-client-icon ${s.tw}`}>
              <div className="order-client-icon-glow" />
              <Icon className="h-7 w-7 relative z-10" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Tu pedido</p>
              <p className="mt-0.5 text-[18px] font-bold text-gray-900">Mesa #{order.table?.number ?? "—"}</p>
              <p className="mt-0.5 text-[12px] text-zinc-500">{order.createdAt ? timeAgo(order.createdAt) : ""}</p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className={`mx-8 mb-6 rounded-xl border border-[#e94560]/20 px-5 py-4 ${s.bg} transition-all duration-300`}>
          <p className="text-[13px] leading-relaxed text-zinc-300">{statusMsg[order.status]}</p>
        </div>

        <div className="px-8 pb-6">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Detalle del pedido</p>
          <div className="space-y-2.5">
            {(order.items ?? []).map((item, i) => (
              <div key={i} className="order-item-row">
                <span className="text-[14px] text-zinc-200">{item.menuItem?.name ?? item.name ?? "Item"}</span>
                <span className="rounded-lg bg-[#e94560]/10 px-3 py-1 text-[12px] font-bold text-[#e94560]">×{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#e94560]/20 pt-6">
            <span className="text-[13px] font-bold text-[#94a3b8]">Total</span>
            <span className="text-[22px] font-bold text-gray-900 transition-all duration-300 hover:scale-105">Q{(order.total ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#e94560]/20 bg-black/20 px-8 py-5">
          <span className="text-[12px] text-zinc-600">{order.createdAt ? timeAgo(order.createdAt) : ""}</span>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="order-action-button"
          >
            <ArrowPathIcon className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar estado
          </button>
        </div>
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const MenuItemCard = ({ item, qty, onAdd, onRemove }) => {
  const inCart = qty > 0;

  // Food emoji mapping based on category
  const getFoodEmoji = (category) => {
    const emojiMap = {
      'hamburguesas': '🍔',
      'bebidas': '🥤',
      'postres': '🍰',
      'entradas': '🥗',
      'pizzas': '🍕',
      'mixologia': '🍹',
      'default': '🍽️'
    };
    return emojiMap[category?.toLowerCase()] || emojiMap.default;
  };

  const foodEmoji = getFoodEmoji(item.category);

  return (
    <div className={`order-menu-item-card ${inCart ? 'in-cart' : ''}`}>
      {/* Image/Emoji Section */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#f5f0e8] to-[#e5e7eb]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#e5e7eb] via-transparent to-transparent opacity-80" />
        <div className="flex h-full items-center justify-center text-7xl transform group-hover:scale-110 transition-transform duration-500">
          {foodEmoji}
        </div>
        {inCart && (
          <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0F6E56] shadow-lg shadow-[#0F6E56]/30">
            <span className="text-[12px] font-bold text-white">{qty}</span>
          </div>
        )}
      </div>

      <div className="relative p-5 flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#0F6E56] bg-[#0F6E56]/10 rounded-full border border-[#0F6E56]/30">
            {item.category ?? "Sin categoría"}
          </span>
        </div>
        <p className="text-[16px] font-bold leading-tight text-[#1a1a1a] mb-2">{item.name}</p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[20px] font-bold text-[#0F6E56]">Q{Number(item.price).toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-auto">
          <button
            onClick={() => onRemove(item._id)}
            disabled={!inCart}
            className="order-quantity-button"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onAdd(item)}
            className="order-quantity-button add flex-1"
          >
            {inCart ? 'Agregar más' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderModal = ({ onClose, onCreated }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [cart, setCart] = useState([]);
  const [tableId, setTableId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([axiosAdmin.get("/menu-items"), axiosAdmin.get("/tables")])
      .then(([m, t]) => { setMenuItems(m.data); setTables(t.data); })
      .catch(() => setError("Error al cargar menú o mesas"))
      .finally(() => setLoading(false));
  }, []);

  const addItem = (item) =>
    setCart((p) => {
      const ex = p.find((c) => c._id === item._id);
      return ex ? p.map((c) => c._id === item._id ? { ...c, qty: c.qty + 1 } : c) : [...p, { ...item, qty: 1 }];
    });

  const removeItem = (id) =>
    setCart((p) => {
      const ex = p.find((c) => c._id === id);
      if (!ex) return p;
      return ex.qty === 1 ? p.filter((c) => c._id !== id) : p.map((c) => c._id === id ? { ...c, qty: c.qty - 1 } : c);
    });

  const getQty = (id) => cart.find((c) => c._id === id)?.qty ?? 0;
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const grouped = menuItems.reduce((acc, item) => {
    const cat = item.category ?? "Sin categoría";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const handleSubmit = async () => {
    if (!tableId) { setError("Selecciona una mesa"); return; }
    if (cart.length < 1) { setError("Agrega al menos un item"); return; }
    setError(""); setSubmitting(true);
    try {
      const res = await axiosAdmin.post("/orders", {
        table: tableId,
        items: cart.map((c) => ({ menuItem: c._id, quantity: c.qty })),
      });
      const created = res.data;
      const tableObj = tables.find((t) => t._id === tableId);
      onCreated({
        orderId: created._id ?? created.id,
        status: created.status ?? "pendiente",
        total: created.total ?? cartTotal,
        createdAt: created.createdAt ?? new Date().toISOString(),
        table: tableObj ?? { number: "—" },
        items: cart.map((c) => ({ menuItem: { _id: c._id, name: c.name }, name: c.name, quantity: c.qty, price: c.price })),
      });
    } catch (e) {
      setError(e.response?.data?.message ?? e.response?.data?.error ?? "Error al crear el pedido");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="order-modal"
      onClick={(e) => { if (!submitting && e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="order-modal-content"
        style={{ height: "92vh" }}
      >
        {/* Elegant header */}
        <div className="relative shrink-0 overflow-hidden border-b-2 border-[#0F6E56]/20 bg-gradient-to-r from-[#f5f0e8] via-[#ffffff] to-[#f5f0e8]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F6E56]/5 via-[#0F6E56]/10 to-[#0F6E56]/5" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0F6E56]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#0F6E56]/8 rounded-full blur-2xl" />

          <div className="relative flex items-center justify-between px-12 py-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F6E56] to-[#16a34a] rounded-2xl blur-xl opacity-30" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F6E56] via-[#16a34a] to-[#0F6E56] shadow-xl shadow-[#0F6E56]/30 ring-2 ring-[#0F6E56]/30">
                  <PlusIcon className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-[28px] font-bold text-[#1a1a1a]">
                  Nuevo Pedido
                </h2>
                <p className="mt-2 text-[15px] text-[#0F6E56]/80">Selecciona mesa e items del menú</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="order-quantity-button h-14 w-14"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="order-loading-spinner" />
              <p className="text-[16px] text-[#0F6E56]/70">Cargando menú...</p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left panel - Menu selection */}
            <div className="flex flex-1 flex-col overflow-hidden border-r-2 border-[#0F6E56]/20 bg-gradient-to-br from-[#f5f0e8]/50 to-[#ffffff]/50">
              <div className="shrink-0 border-b-2 border-[#0F6E56]/20 px-12 py-10 bg-[#ffffff]/80 backdrop-blur-sm">
                <label className="mb-4 block text-[12px] font-bold uppercase tracking-[0.14em] text-[#0F6E56]/70">
                  Seleccionar Mesa
                </label>
                <div className="relative">
                  <select
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                    className="order-select"
                  >
                    <option value="">— Elige una mesa —</option>
                    {tables.map((t) => (
                      <option key={t._id} value={t._id}>
                        Mesa #{t.number} — {t.status === "disponible" ? "✅ Disponible" : "🔒 Ocupada"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-12 py-12 space-y-12">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="order-section-header">
                      <div className="order-section-line" />
                      <span className="order-section-title px-6 py-3 rounded-full bg-[#0F6E56]/15 border-2 border-[#0F6E56]/30">
                        {category}
                      </span>
                      <div className="order-section-line" />
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                      {items.map((item) => (
                        <MenuItemCard
                          key={item._id}
                          item={item}
                          qty={getQty(item._id)}
                          onAdd={addItem}
                          onRemove={removeItem}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel - Cart summary */}
            <div className="flex w-[420px] shrink-0 flex-col bg-gradient-to-br from-[#ffffff] to-[#f5f0e8]">
              <div className="shrink-0 border-b-2 border-[#0F6E56]/20 px-12 py-10 bg-[#f5f0e8]/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#0F6E56]/20 rounded-xl blur-lg animate-pulse" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F6E56]/20 to-[#16a34a]/20 border-2 border-[#0F6E56]/30">
                      <span className="text-[#0F6E56] text-xl">🛒</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0F6E56]/70">Resumen</p>
                    <p className="text-[14px] text-[#0F6E56]/60">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-12 py-8">
                {cart.length === 0 ? (
                  <div className="order-empty-state py-24">
                    <div className="order-empty-icon">🛒</div>
                    <p className="order-empty-title">Carrito vacío</p>
                    <p className="order-empty-text">Agrega items del menú</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((c, index) => (
                      <div
                        key={c._id}
                        className="order-cart-item"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="relative min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-[#1a1a1a]">{c.name}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <span className="rounded-lg bg-gradient-to-br from-[#0F6E56]/20 to-[#16a34a]/20 px-4 py-2 text-[12px] font-bold text-[#0F6E56] border border-[#0F6E56]/30">
                              × {c.qty}
                            </span>
                          </div>
                        </div>
                        <span className="relative shrink-0 text-[18px] font-bold text-[#0F6E56]">
                          Q{(c.price * c.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="shrink-0 border-t-2 border-[#0F6E56]/20 px-12 py-10 bg-[#f5f0e8]/80 backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#0F6E56]/70 uppercase tracking-wider">Subtotal</span>
                    <span className="text-[24px] font-bold text-[#0F6E56]">Q{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t-2 border-[#0F6E56]/20">
                    <span className="text-[18px] font-bold text-[#1a1a1a] uppercase tracking-wider">Total</span>
                    <span className="text-[40px] font-bold text-[#0F6E56] transition-all duration-300 hover:scale-105">Q{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && (
          <div className="shrink-0 border-t-2 border-[#0F6E56]/20 bg-gradient-to-r from-[#f5f0e8] via-[#ffffff] to-[#f5f0e8] px-12 py-10">
            {error && (
              <div className="mb-6 rounded-2xl border-2 border-red-500/30 bg-red-500/[0.1] px-8 py-5 text-[14px] text-red-400 animate-pulse flex items-center gap-4">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}
            <div className="flex gap-6">
              <button
                onClick={onClose}
                disabled={submitting}
                className="order-action-button flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0 || !tableId}
                className="order-action-button order-action-button-primary flex-1"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Confirmar Pedido
                    {cart.length > 0 && (
                      <span className="bg-white/30 px-4 py-2 rounded-lg text-[13px] border border-white/20">
                        Q{cartTotal.toFixed(2)}
                      </span>
                    )}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const OrdersPage = () => {
  const { user } = useAuthStore();
  const isClient = ["cliente", "client"].includes((user?.role?.name ?? "").toLowerCase());
  const uid = user?._id ?? user?.id ?? "guest";

  const [orders, setOrders] = useState([]);
  const [clientOrder, setClientOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const pollingRef = useRef(null);

  const refreshOrders = useCallback(async () => {
    try {
      const all = await fetchAllOrders();
      if (!isClient) { setOrders(all); return; }
      const saved = loadOrder(uid);
      if (!saved) return;
      const found = findOrderById(all, saved.orderId);
      if (!found) return;
      setClientOrder((prev) => prev ? { ...prev, status: found.status } : prev);
      saveOrder(uid, { ...saved, status: found.status });
      // Cargar historial de pedidos del cliente
      const clientOrders = all.filter(o => o.userId === uid || o.user === uid);
      setOrderHistory(clientOrders);
    } catch {}
  }, [isClient, uid]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (isClient) {
          const saved = loadOrder(uid);
          if (saved) {
            setClientOrder(saved);
            const all = await fetchAllOrders();
            const found = findOrderById(all, saved.orderId);
            if (found) { const updated = { ...saved, status: found.status }; setClientOrder(updated); saveOrder(uid, updated); }
          }
        } else {
          const all = await fetchAllOrders();
          setOrders(all);
        }
      } catch {}
      finally { setLoading(false); }
    };
    init();
  }, [isClient, uid]);

  useEffect(() => {
    pollingRef.current = setInterval(refreshOrders, 5000);
    return () => clearInterval(pollingRef.current);
  }, [refreshOrders]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosAdmin.put(`/orders/${id}/status`, { status });
      const all = await fetchAllOrders();
      setOrders(all);
    } catch { alert("Error al actualizar estado"); }
  };

  const handleRefresh = async () => { setRefreshing(true); await refreshOrders(); setRefreshing(false); };

  const handleOrderCreated = (orderData) => {
    setShowModal(false);
    if (isClient) { saveOrder(uid, orderData); setClientOrder(orderData); }
    else { fetchAllOrders().then(setOrders).catch(() => {}); }
  };

  const kpis = [
    { label: "Total pedidos",    value: orders.length,                                                     accent: "bg-gradient-to-r from-zinc-500 to-zinc-400" },
    { label: "Pendientes",       value: orders.filter((o) => o.status === "pendiente").length,              accent: "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]" },
    { label: "En preparación",   value: orders.filter((o) => o.status === "preparacion").length,            accent: "bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]" },
    { label: "Ingresos totales", value: `Q${orders.reduce((s, o) => s + (o.total ?? 0), 0).toFixed(2)}`,   accent: "bg-gradient-to-r from-[#10b981] to-[#34d399]" },
  ];

  return (
    <div className="py-10 px-1">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold leading-tight text-gray-900">Pedidos</h1>
          <p className="mt-1.5 text-[14px] text-zinc-500">
            {isClient ? "Realiza y consulta tus pedidos" : "Control de órdenes en tiempo real"}
          </p>
        </div>
        {!isClient && (
          <button
            onClick={async () => { const all = await fetchAllOrders(); setOrders(all); }}
            className="order-action-button"
          >
            <ArrowPathIcon className="h-4 w-4" /> Recargar
          </button>
        )}
      </div>

      {!isClient && (
        <div className="mb-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="order-loading-spinner" />
        </div>
      ) : isClient ? (
        <ClientView order={clientOrder} onRefresh={handleRefresh} refreshing={refreshing} />
      ) : (
        <AdminView orders={orders} onUpdateStatus={handleUpdateStatus} />
      )}

      {isClient && orderHistory.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[18px] font-bold text-gray-900 mb-6">Historial de Pedidos</h2>
          <div className="grid gap-4">
            {orderHistory.map((order) => (
              <div
                key={order._id}
                className="order-client-card p-6"
              >
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="order-client-icon">
                      <span className="text-[20px]">📦</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[13px] font-bold text-gray-900">
                          Pedido #{order._id?.toString().slice(-6) || "---"}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-GT') : "---"}
                        </span>
                        <span className="flex items-center gap-1">
                          🪑 Mesa {order.table?.number || "---"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[24px] font-bold text-[#e94560]">
                      Q{(order.total ?? 0).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`mt-10 flex ${isClient ? "justify-center" : "justify-end"}`}>
        <button
          onClick={() => setShowModal(true)}
          className="order-action-button order-action-button-primary px-10 py-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <PlusIcon className="h-5 w-5" />
          </div>
          {isClient && clientOrder ? "Hacer otro pedido" : "Hacer pedido"}
          <span className="text-2xl">🍔</span>
        </button>
      </div>

      {showModal && (
        <OrderModal onClose={() => setShowModal(false)} onCreated={handleOrderCreated} />
      )}
    </div>
  );
};