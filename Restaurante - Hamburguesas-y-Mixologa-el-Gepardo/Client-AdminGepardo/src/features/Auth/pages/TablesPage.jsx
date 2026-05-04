import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";

const EMPTY_FORM = { number: "", capacity: "", status: "disponible", restaurant: "" };

const STATUS_STYLES = {
  disponible: { bg: "rgba(74,222,128,0.12)", color: "var(--color-success)", border: "rgba(74,222,128,0.3)", label: "Disponible" },
  ocupada:    { bg: "rgba(239,68,68,0.10)",  color: "var(--color-error)",   border: "rgba(239,68,68,0.2)",  label: "Ocupada" },
};

export const TablesPage = () => {
  const [tables, setTables]           = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [tablesRes, restRes] = await Promise.all([
        axiosAdmin.get("/tables"),
        axiosAdmin.get("/restaurants"),
      ]);
      setTables(tablesRes.data);
      setRestaurants(restRes.data);
    } catch {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, restaurant: restaurants[0]?._id || "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      number: t.number, capacity: t.capacity,
      status: t.status, restaurant: t.restaurant?._id || t.restaurant
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await axiosAdmin.put(`/tables/${editing._id}`, form);
      } else {
        await axiosAdmin.post("/tables", form);
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta mesa?")) return;
    try {
      await axiosAdmin.delete(`/tables/${id}`);
      fetchAll();
    } catch {
      alert("Error al eliminar");
    }
  };

  const toggleStatus = async (t) => {
    const newStatus = t.status === "disponible" ? "ocupada" : "disponible";
    try {
      await axiosAdmin.put(`/tables/${t._id}`, { status: newStatus });
      fetchAll();
    } catch {
      alert("Error al cambiar estado");
    }
  };

  const disponibles = tables.filter(t => t.status === "disponible").length;
  const ocupadas    = tables.filter(t => t.status === "ocupada").length;

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Mesas</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {disponibles} disponibles · {ocupadas} ocupadas
          </p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "var(--color-accent)", color: "#fff" }}>
          + Nueva mesa
        </button>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Disponibles", value: disponibles, color: "var(--color-success)" },
          { label: "Ocupadas",    value: ocupadas,    color: "var(--color-error)" },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Grid de mesas */}
      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : tables.length === 0 ? (
        <div className="card p-12 text-center">
          <p style={{ color: "var(--text-muted)" }}>No hay mesas registradas aún.</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-accent)", color: "#fff" }}>
            Crear la primera
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {tables.map(t => {
            const s = STATUS_STYLES[t.status] || STATUS_STYLES.disponible;
            return (
              <div key={t._id} className="card p-4 flex flex-col gap-3">
                {/* Número y estado */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                      #{t.number}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {t.capacity} personas
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    {s.label}
                  </span>
                </div>

                {/* Restaurante */}
                {t.restaurant && (
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                    🍽️ {t.restaurant?.name || "—"}
                  </p>
                )}

                {/* Acciones */}
                <div className="flex gap-1.5 mt-auto">
                  <button onClick={() => toggleStatus(t)}
                    className="flex-1 py-1 rounded-lg text-xs font-medium transition hover:opacity-80"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    {t.status === "disponible" ? "Ocupar" : "Liberar"}
                  </button>
                  <button onClick={() => openEdit(t)}
                    className="px-2 py-1 rounded-lg text-xs transition hover:opacity-80"
                    style={{ background: "rgba(183,109,27,0.15)", color: "var(--color-accent)", border: "1px solid rgba(183,109,27,0.3)" }}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(t._id)}
                    className="px-2 py-1 rounded-lg text-xs transition hover:opacity-80"
                    style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {editing ? "Editar mesa" : "Nueva mesa"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Número de mesa *</label>
                <input type="number" placeholder="1" value={form.number}
                  onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Capacidad *</label>
                <input type="number" placeholder="4" value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Estado</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Restaurante *</label>
                <select value={form.restaurant} onChange={e => setForm(f => ({ ...f, restaurant: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="">Seleccionar...</option>
                  {restaurants.map(r => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-xs" style={{ color: "var(--color-error)" }}>{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                  style={{ background: "var(--color-accent)", color: "#fff" }}>
                  {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
