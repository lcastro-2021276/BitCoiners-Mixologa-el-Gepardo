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
    <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase ${s.tw}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} animate-pulse`} />
      {s.label}
    </span>
  );
};

const KpiCard = ({ label, value, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-[#C9972A]/15 bg-gradient-to-br from-[#0f2018] to-[#0a1510] p-6 transition-all duration-300 hover:border-[#C9972A]/30 hover:shadow-lg hover:shadow-[#B8860B]/10">
    <div className={`absolute inset-x-0 top-0 h-[2px] ${accent}`} />
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/60">{label}</p>
    <p className="mt-3 text-[32px] font-bold leading-none text-white">{value}</p>
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
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C9972A]/25 bg-[#C9972A]/10">
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
              <th className="px-7 py-5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Mesa</th>
              <th className="px-7 py-5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Estado</th>
              <th className="px-7 py-5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Items</th>
              <th className="px-7 py-5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Total</th>
              <th className="px-7 py-5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Tiempo</th>
              <th className="px-7 py-5 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9972A]/10">
            {orders.map((order) => {
              const s = STATUS[order.status] ?? STATUS.pendiente;
              return (
                <tr key={order._id} className={`transition-colors hover:bg-white/[0.015] ${s.bg}`}>
                  <td className="px-7 py-6">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.dot} animate-pulse`} />
                      <span className="text-[15px] font-bold text-white">#{order.table?.number ?? "—"}</span>
                    </div>
                  </td>

                  {/* ── Status column: now uses the inline dropdown selector ── */}
                  <td className="px-7 py-6">
                    <AdminStatusSelector
                      currentStatus={order.status}
                      onSelect={(newStatus) => onUpdateStatus(order._id, newStatus)}
                    />
                  </td>

                  <td className="px-7 py-6 max-w-[220px]">
                    <p className="truncate text-[13px] text-zinc-400">
                      {(order.items ?? []).map((item) => item.menuItem?.name ?? item.name ?? "Item").join(", ")}
                    </p>
                  </td>
                  <td className="px-7 py-6">
                    <span className="text-[16px] font-bold text-white">Q{(order.total ?? 0).toFixed(2)}</span>
                  </td>
                  <td className="px-7 py-6">
                    <span className="text-[13px] text-zinc-500">{order.createdAt ? timeAgo(order.createdAt) : ""}</span>
                  </td>

                  {/* ── Actions column: kept Preparar / Entregar buttons + reset ── */}
                  <td className="px-7 py-6">
                    <div className="flex items-center justify-end gap-2.5">
                      {order.status === "pendiente" && (
                        <button
                          onClick={() => onUpdateStatus(order._id, "preparacion")}
                          className="flex items-center gap-2 rounded-xl border border-[#4A90E2]/30 bg-[#4A90E2]/10 px-4 py-2.5 text-[12px] font-semibold text-[#4A90E2] transition hover:bg-[#4A90E2]/20 hover:shadow-lg hover:shadow-[#4A90E2]/20"
                        >
                          <FireIcon className="h-3.5 w-3.5" /> Preparar
                        </button>
                      )}
                      {order.status === "preparacion" && (
                        <button
                          onClick={() => onUpdateStatus(order._id, "entregado")}
                          className="flex items-center gap-2 rounded-xl border border-[#1B7A4A]/30 bg-[#1B7A4A]/10 px-4 py-2.5 text-[12px] font-semibold text-[#2ecc71] transition hover:bg-[#1B7A4A]/20 hover:shadow-lg hover:shadow-[#1B7A4A]/20"
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
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9972A]/20 bg-[#C9972A]/10 text-[#C9972A] transition hover:bg-[#C9972A]/20 hover:shadow-lg hover:shadow-[#C9972A]/20"
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
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-[#C9972A]/20 bg-gradient-to-br from-[#0f2018] to-[#0a1510] py-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C9972A]/25 bg-[#C9972A]/10 text-4xl">
          🍽️
        </div>
        <div>
          <h3 className="text-[17px] font-semibold text-zinc-300">Sin pedidos aún</h3>
          <p className="mt-2 text-[14px] text-zinc-600">Usa el botón de abajo para hacer tu primer pedido.</p>
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
      <div className="overflow-hidden rounded-2xl border border-[#C9972A]/20 bg-gradient-to-br from-[#0f2018] to-[#0a1510] shadow-2xl">
        <div className={`h-[3px] w-full ${s.bar}`} />

        <div className="flex items-center justify-between px-8 py-8">
          <div className="flex items-center gap-5">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${s.tw}`}>
              <Icon className="h-7 w-7" />
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

        <div className={`mx-8 mb-6 rounded-xl border border-[#C9972A]/20 px-5 py-4 ${s.bg}`}>
          <p className="text-[13px] leading-relaxed text-zinc-300">{statusMsg[order.status]}</p>
        </div>

        <div className="px-8 pb-6">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/60">Detalle del pedido</p>
          <div className="space-y-2.5">
            {(order.items ?? []).map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-[#C9972A]/15 bg-black/20 px-5 py-4">
                <span className="text-[14px] text-zinc-200">{item.menuItem?.name ?? item.name ?? "Item"}</span>
                <span className="rounded-lg bg-[#C9972A]/10 px-3 py-1 text-[12px] font-bold text-[#C9972A]">×{item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[#C9972A]/20 pt-6">
            <span className="text-[13px] font-bold text-[#C9972A]/70">Total</span>
            <span className="text-[28px] font-bold text-white">Q{(order.total ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#C9972A]/20 bg-black/20 px-8 py-5">
          <span className="text-[12px] text-zinc-600">{order.createdAt ? timeAgo(order.createdAt) : ""}</span>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#C9972A]/25 bg-[#C9972A]/10 px-5 py-2.5 text-[13px] font-medium text-[#C9972A] transition hover:bg-[#C9972A]/20 disabled:opacity-50"
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
  return (
    <div className={`flex flex-col rounded-xl border p-4 transition-all duration-200 ${
      inCart
        ? "border-[#C9972A]/40 bg-[#C9972A]/[0.07] shadow-lg shadow-[#B8860B]/15"
        : "border-[#C9972A]/15 bg-black/20 hover:border-[#C9972A]/30 hover:bg-[#C9972A]/[0.04]"
    }`}>
      <span className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/50">
        {item.category ?? "Sin categoría"}
      </span>
      <p className="flex-1 text-[13px] font-semibold leading-snug text-white">{item.name}</p>
      <p className="mt-2 text-[14px] font-bold text-[#C9972A]">Q{Number(item.price).toFixed(2)}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onRemove(item._id)}
            disabled={!inCart}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9972A]/25 text-[#C9972A]/60 transition disabled:cursor-not-allowed disabled:opacity-20 hover:enabled:border-[#C9972A]/50 hover:enabled:bg-[#C9972A]/15 hover:enabled:text-[#C9972A]"
          >
            <MinusIcon className="h-3.5 w-3.5" />
          </button>
          <span className={`w-6 text-center text-[15px] font-bold ${inCart ? "text-[#C9972A]" : "text-zinc-600"}`}>
            {qty}
          </span>
          <button
            onClick={() => onAdd(item)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9972A] text-[#0d1b14] transition hover:bg-[#B8860B] active:scale-95"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </button>
        </div>
        {inCart && (
          <span className="text-[12px] font-bold text-[#C9972A]/70">
            Q{(item.price * qty).toFixed(2)}
          </span>
        )}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
      onClick={(e) => { if (!submitting && e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex w-full max-w-5xl flex-col rounded-2xl border border-[#C9972A]/20 bg-[#0d1b14] shadow-2xl"
        style={{ height: "88vh" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#C9972A]/20 px-8 py-6">
          <div>
            <h2 className="text-[18px] font-bold text-white">Nuevo pedido</h2>
            <p className="mt-1 text-[12px] text-zinc-500">Selecciona mesa e items del menú</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C9972A]/20 text-[#C9972A]/60 transition hover:border-[#C9972A]/40 hover:bg-[#C9972A]/10 hover:text-[#C9972A]"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9972A]/20 border-t-[#C9972A]" />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col overflow-hidden border-r border-[#C9972A]/20">
              <div className="shrink-0 border-b border-[#C9972A]/20 px-8 py-6">
                <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/60">
                  Mesa
                </label>
                <select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full rounded-xl border border-[#C9972A]/25 bg-[#C9972A]/10 px-5 py-3.5 text-[13px] text-white outline-none transition focus:border-[#C9972A]/50 focus:bg-[#C9972A]/15 [&>option]:bg-[#0d1b14]"
                >
                  <option value="">— Elige una mesa —</option>
                  {tables.map((t) => (
                    <option key={t._id} value={t._id}>
                      Mesa #{t.number} — {t.status === "disponible" ? "Disponible" : "Ocupada"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-7 space-y-8">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="mb-5 flex items-center gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/70">
                        {category}
                      </span>
                      <div className="flex-1 border-t border-[#C9972A]/20" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
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

            <div className="flex w-80 shrink-0 flex-col">
              <div className="shrink-0 border-b border-[#C9972A]/20 px-7 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9972A]/60">Resumen del pedido</p>
              </div>

              <div className="flex-1 overflow-y-auto px-7 py-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="text-4xl opacity-20">🛒</span>
                    <p className="mt-4 text-[13px] text-zinc-600">Aún no hay items</p>
                    <p className="mt-1 text-[12px] text-zinc-700">Agrega items desde el menú</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((c) => (
                      <div key={c._id} className="flex items-start justify-between gap-3 rounded-xl border border-[#C9972A]/15 bg-black/20 px-4 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-zinc-200">{c.name}</p>
                          <p className="mt-0.5 text-[11px] text-[#C9972A]/60">× {c.qty}</p>
                        </div>
                        <span className="shrink-0 text-[13px] font-bold text-[#C9972A]">
                          Q{(c.price * c.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="shrink-0 border-t border-[#C9972A]/20 px-7 py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#C9972A]/60">Total estimado</span>
                    <span className="text-[22px] font-bold text-[#C9972A]">Q{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && (
          <div className="shrink-0 border-t border-[#C9972A]/20 bg-black/20 px-8 py-6">
            {error && (
              <p className="mb-4 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-5 py-3.5 text-[13px] text-red-400">
                {error}
              </p>
            )}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={submitting}
                className="flex-1 rounded-xl border border-[#C9972A]/20 bg-[#C9972A]/10 py-3.5 text-[13px] font-medium text-[#C9972A] transition hover:bg-[#C9972A]/15 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0 || !tableId}
                className="flex-1 rounded-xl bg-[#C9972A] py-3.5 text-[13px] font-bold text-[#0d1b14] transition hover:bg-[#B8860B] disabled:opacity-30 shadow-lg shadow-[#B8860B]/25"
              >
                {submitting ? "Enviando…" : `Confirmar${cart.length > 0 ? ` · Q${cartTotal.toFixed(2)}` : ""}`}
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
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
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

      <div className={`mt-10 flex ${isClient ? "justify-center" : "justify-end"}`}>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 rounded-xl bg-[#C9972A] px-7 py-3.5 text-[14px] font-bold text-[#0d1b14] shadow-lg shadow-[#B8860B]/25 transition hover:bg-[#B8860B] active:scale-95"
        >
          <PlusIcon className="h-5 w-5" />
          {isClient && clientOrder ? "Hacer otro pedido" : "Hacer pedido"}
        </button>
      </div>

      {showModal && (
        <OrderModal onClose={() => setShowModal(false)} onCreated={handleOrderCreated} />
      )}
    </div>
  );
};