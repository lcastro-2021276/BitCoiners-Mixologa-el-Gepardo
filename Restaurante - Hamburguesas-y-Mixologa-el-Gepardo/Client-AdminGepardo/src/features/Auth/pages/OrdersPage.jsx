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
    tw: "bg-[#C9972A]/15 text-[#C9972A] border-[#C9972A]/30",
    dot: "bg-[#C9972A]",
    bar: "bg-[#B8860B]",
    glow: "shadow-[#B8860B]/20",
    bg: "bg-[#B8860B]/10",
  },
  preparacion: {
    label: "En preparación",
    Icon: FireIcon,
    tw: "bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30",
    dot: "bg-[#4A90E2]",
    bar: "bg-[#4A90E2]",
    glow: "shadow-[#4A90E2]/20",
    bg: "bg-[#4A90E2]/10",
  },
  entregado: {
    label: "Entregado",
    Icon: CheckCircleSolid,
    tw: "bg-[#1B7A4A]/15 text-[#2ecc71] border-[#1B7A4A]/30",
    dot: "bg-[#2ecc71]",
    bar: "bg-[#1B7A4A]",
    glow: "shadow-[#1B7A4A]/20",
    bg: "bg-[#1B7A4A]/10",
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
    <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-all duration-200 ${s.tw}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} animate-pulse`} />
      {s.label}
    </span>
  );
};

const KpiCard = ({ label, value, accent }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[#C9972A]/15 bg-gradient-to-br from-[#0f2018] to-[#0a1510] p-8 transition-all duration-300 hover:border-[#C9972A]/30 hover:shadow-xl hover:shadow-[#B8860B]/20 hover:scale-[1.02] flex flex-col items-center justify-center text-center">
    <div className={`absolute inset-x-0 top-0 h-[3px] ${accent} transition-all duration-300 group-hover:h-[4px]`} />
    <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />
    <p className="text-[36px] font-bold leading-none text-white transition-transform duration-300 group-hover:scale-105">{value}</p>
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
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-[#C9972A]/20 bg-gradient-to-br from-[#0f2018] to-[#0a1510] py-32 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C9972A]/25 bg-[#C9972A]/10 animate-pulse">
        <TableCellsIcon className="h-9 w-9 text-[#C9972A]" />
      </div>
      <div>
        <h3 className="text-[16px] font-semibold text-zinc-300">Sin pedidos activos</h3>
        <p className="mt-2 text-[13px] text-zinc-600">Los pedidos aparecerán aquí en tiempo real.</p>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[#C9972A]/20 bg-gradient-to-br from-[#0f2018] to-[#0a1510] shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#C9972A]/20 bg-black/20">
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Mesa</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Estado</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Items</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Total</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Tiempo</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9972A]/10">
            {orders.map((order) => {
              const s = STATUS[order.status] ?? STATUS.pendiente;
              return (
                <tr key={order._id} className={`transition-all duration-200 hover:bg-white/[0.015] hover:scale-[1.005] ${s.bg}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.dot} animate-pulse`} />
                      <span className="text-[15px] font-bold text-white">#{order.table?.number ?? "—"}</span>
                    </div>
                  </td>

                  {/* ── Status column: now uses the inline dropdown selector ── */}
                  <td className="px-6 py-5">
                    <AdminStatusSelector
                      currentStatus={order.status}
                      onSelect={(newStatus) => onUpdateStatus(order._id, newStatus)}
                    />
                  </td>

                  <td className="px-6 py-5 max-w-[220px]">
                    <p className="truncate text-[13px] text-zinc-400">
                      {(order.items ?? []).map((item) => item.menuItem?.name ?? item.name ?? "Item").join(", ")}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[16px] font-bold text-white">Q{(order.total ?? 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] text-zinc-500">{order.createdAt ? timeAgo(order.createdAt) : ""}</span>
                  </td>

                  {/* ── Actions column: kept Preparar / Entregar buttons + reset ── */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2.5">
                      {order.status === "pendiente" && (
                        <button
                          onClick={() => onUpdateStatus(order._id, "preparacion")}
                          className="flex items-center gap-2 rounded-xl border border-[#4A90E2]/30 bg-[#4A90E2]/10 px-4 py-2.5 text-[12px] font-semibold text-[#4A90E2] transition hover:bg-[#4A90E2]/20 hover:shadow-lg hover:shadow-[#4A90E2]/20 hover:scale-105 active:scale-95"
                        >
                          <FireIcon className="h-3.5 w-3.5" /> Preparar
                        </button>
                      )}
                      {order.status === "preparacion" && (
                        <button
                          onClick={() => onUpdateStatus(order._id, "entregado")}
                          className="flex items-center gap-2 rounded-xl border border-[#1B7A4A]/30 bg-[#1B7A4A]/10 px-4 py-2.5 text-[12px] font-semibold text-[#2ecc71] transition hover:bg-[#1B7A4A]/20 hover:shadow-lg hover:shadow-[#1B7A4A]/20 hover:scale-105 active:scale-95"
                        >
                          <CheckCircleIcon className="h-3.5 w-3.5" /> Entregar
                        </button>
                      )}
                      {order.status === "entregado" && (
                        <span className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-[#2ecc71]">
                          <CheckCircleSolid className="h-4 w-4" /> Entregado
                        </span>
                      )}
                      <button
                        onClick={() => onUpdateStatus(order._id, "pendiente")}
                        title="Reiniciar a pendiente"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9972A]/20 bg-[#C9972A]/10 text-[#C9972A] transition hover:bg-[#C9972A]/20 hover:shadow-lg hover:shadow-[#C9972A]/20 hover:scale-105 active:scale-95"
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
      <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[#C9972A]/30 bg-gradient-to-br from-[#0f2018] via-[#0d1b14] to-[#0a1510] py-32 text-center shadow-2xl shadow-[#B8860B]/10">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#C9972A]/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-[#B8860B]/10 blur-2xl animate-pulse" />
        </div>

        <div className="relative flex flex-col items-center justify-center gap-8">
          {/* Icon with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9972A] to-[#B8860B] rounded-3xl blur-xl opacity-30 animate-pulse" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-[#C9972A]/30 bg-gradient-to-br from-[#C9972A]/15 to-[#B8860B]/10 text-6xl shadow-2xl shadow-[#B8860B]/20">
              🍽️
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[22px] font-bold text-white">Sin pedidos aún</h3>
            <p className="text-[15px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Explora nuestro delicioso menú y haz tu primer pedido usando el botón de abajo.
            </p>
          </div>

          {/* Decorative food icons */}
          <div className="flex gap-6 text-3xl opacity-40">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🍔</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍕</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🍹</span>
          </div>
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
      <div className="overflow-hidden rounded-2xl border border-[#C9972A]/20 bg-gradient-to-br from-[#0f2018] to-[#0a1510] shadow-2xl transition-all duration-300 hover:shadow-[#B8860B]/20">
        <div className={`h-[4px] w-full ${s.bar} animate-pulse`} />

        <div className="flex items-center justify-between px-8 py-8">
          <div className="flex items-center gap-5">
            <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border ${s.tw} transition-all duration-300 hover:scale-110`}>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${s.bar} opacity-20 blur-lg`} />
              <Icon className="h-7 w-7 relative z-10" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/60">Tu pedido</p>
              <p className="mt-0.5 text-[22px] font-bold text-white">Mesa #{order.table?.number ?? "—"}</p>
              <p className="mt-0.5 text-[12px] text-zinc-500">{order.createdAt ? timeAgo(order.createdAt) : ""}</p>
            </div>
          </div>
          {/* Read-only badge — client cannot interact with it */}
          <StatusBadge status={order.status} />
        </div>

        <div className={`mx-8 mb-6 rounded-xl border border-[#C9972A]/20 px-5 py-4 ${s.bg} transition-all duration-300`}>
          <p className="text-[13px] leading-relaxed text-zinc-300">{statusMsg[order.status]}</p>
        </div>

        <div className="px-8 pb-6">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/60">Detalle del pedido</p>
          <div className="space-y-2.5">
            {(order.items ?? []).map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-[#C9972A]/15 bg-black/20 px-5 py-4 transition-all duration-200 hover:bg-[#C9972A]/5 hover:border-[#C9972A]/25">
                <span className="text-[14px] text-zinc-200">{item.menuItem?.name ?? item.name ?? "Item"}</span>
                <span className="rounded-lg bg-[#C9972A]/10 px-3 py-1 text-[12px] font-bold text-[#C9972A]">×{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#C9972A]/20 pt-6">
            <span className="text-[13px] font-bold text-[#C9972A]/70">Total</span>
            <span className="text-[28px] font-bold text-white transition-all duration-300 hover:scale-105">Q{(order.total ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#C9972A]/20 bg-black/20 px-8 py-5">
          <span className="text-[12px] text-zinc-600">{order.createdAt ? timeAgo(order.createdAt) : ""}</span>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#C9972A]/25 bg-[#C9972A]/10 px-5 py-2.5 text-[13px] font-medium text-[#C9972A] transition hover:bg-[#C9972A]/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
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
    <div className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
      inCart
        ? "border-[#C9972A] bg-gradient-to-br from-[#C9972A]/25 to-[#B8860B]/15 shadow-2xl shadow-[#B8860B]/40 scale-[1.03]"
        : "border-[#C9972A]/20 bg-gradient-to-br from-[#0d1b14] to-[#0a1510] hover:border-[#C9972A]/50 hover:shadow-xl hover:shadow-[#B8860B]/30 hover:scale-[1.02]"
    }`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-[#C9972A]/10 to-transparent opacity-0 transition-opacity duration-300 ${inCart ? 'opacity-100' : 'group-hover:opacity-100'}`} />

      {/* Image/Emoji Section */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#0f2018] to-[#0a1510]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b14] via-transparent to-transparent opacity-80" />
        <div className="flex h-full items-center justify-center text-7xl transform group-hover:scale-110 transition-transform duration-500">
          {foodEmoji}
        </div>
        {inCart && (
          <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#C9972A] shadow-lg shadow-[#B8860B]/30">
            <span className="text-[12px] font-bold text-[#0d1b14]">{qty}</span>
          </div>
        )}
      </div>

      <div className="relative p-5 flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#C9972A] bg-[#C9972A]/10 rounded-full border border-[#C9972A]/30">
            {item.category ?? "Sin categoría"}
          </span>
        </div>
        <p className="text-[16px] font-bold leading-tight text-white mb-2">{item.name}</p>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[20px] font-bold text-[#C9972A]">Q{Number(item.price).toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-auto">
          <button
            onClick={() => onRemove(item._id)}
            disabled={!inCart}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-200 ${
              inCart
                ? "border-[#C9972A] bg-[#C9972A] text-[#0d1b14] hover:bg-[#B8860B] hover:scale-110 active:scale-95 shadow-lg shadow-[#B8860B]/30"
                : "border-[#C9972A]/30 text-[#C9972A]/40 disabled:opacity-30 disabled:cursor-not-allowed"
            }`}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onAdd(item)}
            className="flex-1 h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#C9972A] to-[#B8860B] text-[#0d1b14] transition hover:from-[#B8860B] hover:to-[#C9972A] hover:scale-105 active:scale-95 shadow-xl shadow-[#B8860B]/40 border-2 border-[#C9972A] font-bold text-[13px]"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 sm:p-10"
      onClick={(e) => { if (!submitting && e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex w-full max-w-7xl flex-col rounded-3xl border border-[#C9972A]/30 bg-[#0d1b14] shadow-2xl transition-all duration-500 overflow-hidden"
        style={{ height: "92vh" }}
      >
        {/* Animated gradient header */}
        <div className="relative shrink-0 overflow-hidden border-b-2 border-[#C9972A]/30 bg-gradient-to-r from-[#0f2018] via-[#0d1b14] to-[#0f2018]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C9972A]/5 via-[#C9972A]/10 to-[#C9972A]/5 animate-pulse" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C9972A]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#C9972A]/15 rounded-full blur-2xl animate-pulse" />

          <div className="relative flex items-center justify-between px-12 py-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9972A] to-[#B8860B] rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9972A] via-[#B8860B] to-[#C9972A] shadow-2xl shadow-[#B8860B]/40 ring-2 ring-[#C9972A]/40">
                  <PlusIcon className="h-10 w-10 text-[#0d1b14]" />
                </div>
              </div>
              <div>
                <h2 className="text-[28px] font-bold text-white">
                  Nuevo Pedido
                </h2>
                <p className="mt-2 text-[15px] text-[#C9972A]/80">Selecciona mesa e items del menú</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#C9972A]/30 text-[#C9972A]/60 transition hover:border-[#C9972A]/60 hover:bg-[#C9972A]/20 hover:text-[#C9972A] hover:scale-110 active:scale-95"
            >
              <XMarkIcon className="h-7 w-7" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#C9972A]/0 to-[#C9972A]/10 opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#C9972A]/20 border-t-[#C9972A]" />
              <p className="text-[16px] text-[#C9972A]/70">Cargando menú...</p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left panel - Menu selection */}
            <div className="flex flex-1 flex-col overflow-hidden border-r-2 border-[#C9972A]/20 bg-gradient-to-br from-[#0f2018]/50 to-[#0a1510]/50">
              <div className="shrink-0 border-b-2 border-[#C9972A]/20 px-12 py-10 bg-[#0d1b14]/30 backdrop-blur-sm">
                <label className="mb-4 block text-[12px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">
                  Seleccionar Mesa
                </label>
                <div className="relative">
                  <select
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-[#C9972A]/30 bg-[#C9972A]/10 px-8 py-5 text-[15px] text-white outline-none transition-all duration-300 focus:border-[#C9972A]/60 focus:bg-[#C9972A]/20 focus:shadow-2xl focus:shadow-[#B8860B]/30 [&>option]:bg-[#0d1b14]"
                  >
                    <option value="">— Elige una mesa —</option>
                    {tables.map((t) => (
                      <option key={t._id} value={t._id}>
                        Mesa #{t.number} — {t.status === "disponible" ? "✅ Disponible" : "🔒 Ocupada"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-[#C9972A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-12 py-12 space-y-12">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="mb-8 flex items-center gap-6">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9972A]/40 to-transparent" />
                      <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/90 px-6 py-3 rounded-full bg-[#C9972A]/15 border-2 border-[#C9972A]/30">
                        {category}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9972A]/40 to-transparent" />
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
            <div className="flex w-[420px] shrink-0 flex-col bg-gradient-to-br from-[#0d1b14] to-[#0a1510]">
              <div className="shrink-0 border-b-2 border-[#C9972A]/20 px-12 py-10 bg-[#0f2018]/30 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#C9972A]/20 rounded-xl blur-lg animate-pulse" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9972A]/20 to-[#B8860B]/20 border-2 border-[#C9972A]/30">
                      <span className="text-[#C9972A] text-xl">🛒</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Resumen</p>
                    <p className="text-[14px] text-[#C9972A]/60">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-12 py-8">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#C9972A]/10 rounded-full blur-2xl animate-pulse" />
                      <span className="relative text-6xl opacity-30">🛒</span>
                    </div>
                    <p className="mt-8 text-[16px] text-zinc-500 font-medium">Carrito vacío</p>
                    <p className="mt-3 text-[13px] text-zinc-600">Agrega items del menú</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((c, index) => (
                      <div
                        key={c._id}
                        className="group relative flex items-start justify-between gap-6 rounded-2xl border-2 border-[#C9972A]/20 bg-black/30 px-8 py-6 transition-all duration-300 hover:border-[#C9972A]/40 hover:bg-[#C9972A]/15 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#B8860B]/20"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C9972A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-zinc-200">{c.name}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <span className="rounded-lg bg-gradient-to-br from-[#C9972A]/20 to-[#B8860B]/20 px-4 py-2 text-[12px] font-bold text-[#C9972A] border border-[#C9972A]/30">
                              × {c.qty}
                            </span>
                          </div>
                        </div>
                        <span className="relative shrink-0 text-[18px] font-bold text-[#C9972A]">
                          Q{(c.price * c.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="shrink-0 border-t-2 border-[#C9972A]/20 px-12 py-10 bg-[#0f2018]/30 backdrop-blur-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#C9972A]/70 uppercase tracking-wider">Subtotal</span>
                    <span className="text-[24px] font-bold text-[#C9972A]">Q{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t-2 border-[#C9972A]/20">
                    <span className="text-[18px] font-bold text-white uppercase tracking-wider">Total</span>
                    <span className="text-[40px] font-bold text-[#C9972A] transition-all duration-300 hover:scale-105">Q{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && (
          <div className="shrink-0 border-t-2 border-[#C9972A]/20 bg-gradient-to-r from-[#0f2018] via-[#0d1b14] to-[#0f2018] px-12 py-10">
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
                className="relative flex-1 rounded-2xl border-2 border-[#C9972A]/30 bg-[#C9972A]/10 py-5 text-[15px] font-semibold text-[#C9972A] transition-all duration-300 hover:bg-[#C9972A]/20 hover:border-[#C9972A]/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                Cancelar
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C9972A]/0 to-[#C9972A]/10 opacity-0 hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0 || !tableId}
                className="relative flex-1 rounded-2xl bg-gradient-to-r from-[#C9972A] via-[#B8860B] to-[#C9972A] py-5 text-[15px] font-bold text-[#0d1b14] transition-all duration-300 hover:from-[#B8860B] hover:via-[#C9972A] hover:to-[#B8860B] hover:scale-105 hover:shadow-2xl hover:shadow-[#B8860B]/40 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:from-[#C9972A]/50 disabled:via-[#B8860B]/50 disabled:to-[#C9972A]/50 border-2 border-[#C9972A]"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0d1b14]/30 border-t-[#0d1b14]" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Confirmar Pedido
                    {cart.length > 0 && (
                      <span className="bg-[#0d1b14]/30 px-4 py-2 rounded-lg text-[13px] border border-[#0d1b14]/20">
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
  const isClient = ["cliente", "client"].includes((user?.role ?? "").toLowerCase());
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
    { label: "Pendientes",       value: orders.filter((o) => o.status === "pendiente").length,              accent: "bg-gradient-to-r from-[#C9972A] to-[#B8860B]" },
    { label: "En preparación",   value: orders.filter((o) => o.status === "preparacion").length,            accent: "bg-gradient-to-r from-[#4A90E2] to-blue-400" },
    { label: "Ingresos totales", value: `Q${orders.reduce((s, o) => s + (o.total ?? 0), 0).toFixed(2)}`,   accent: "bg-gradient-to-r from-emerald-500 to-emerald-400" },
  ];

  return (
    <div className="py-10 px-1">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-white">Pedidos</h1>
          <p className="mt-1.5 text-[14px] text-zinc-500">
            {isClient ? "Realiza y consulta tus pedidos" : "Control de órdenes en tiempo real"}
          </p>
        </div>
        {!isClient && (
          <button
            onClick={async () => { const all = await fetchAllOrders(); setOrders(all); }}
            className="flex items-center gap-2 rounded-xl border border-[#C9972A]/20 bg-[#C9972A]/10 px-5 py-2.5 text-[12px] font-semibold text-[#C9972A] transition hover:bg-[#C9972A]/20"
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
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#C9972A]/20 border-t-[#C9972A]" />
        </div>
      ) : isClient ? (
        <ClientView order={clientOrder} onRefresh={handleRefresh} refreshing={refreshing} />
      ) : (
        <AdminView orders={orders} onUpdateStatus={handleUpdateStatus} />
      )}

      {isClient && orderHistory.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[20px] font-bold text-white mb-6">Historial de Pedidos</h2>
          <div className="grid gap-4">
            {orderHistory.map((order) => (
              <div
                key={order._id}
                className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#0d1b14] to-[#0f2018] p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 hover:scale-[1.01]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-400/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-500/20 border border-amber-500/30">
                      <span className="text-[20px]">📦</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[14px] font-bold text-white">
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
                    <p className="text-[24px] font-bold text-amber-400">
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
          className="relative group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#C9972A] via-[#B8860B] to-[#C9972A] px-10 py-4 text-[15px] font-bold text-[#0d1b14] shadow-2xl shadow-[#B8860B]/40 transition-all duration-300 hover:from-[#B8860B] hover:via-[#C9972A] hover:to-[#B8860B] hover:scale-105 hover:shadow-[#B8860B]/50 active:scale-95 border-2 border-[#C9972A]"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#0d1b14]/20">
            <PlusIcon className="h-5 w-5" />
          </div>
          <span className="relative">
            {isClient && clientOrder ? "Hacer otro pedido" : "Hacer pedido"}
          </span>
          <span className="relative text-2xl">🍔</span>
        </button>
      </div>

      {showModal && (
        <OrderModal onClose={() => setShowModal(false)} onCreated={handleOrderCreated} />
      )}
    </div>
  );
};