import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";

const EMPTY_FORM = { name: "", description: "", price: "", category: "", restaurant: "" };

const CATEGORIES = ["Entradas", "Platos principales", "Hamburguesas", "Bebidas", "Mixología", "Postres", "Otro"];

export const MenuPage = () => {
  const [items, setItems]             = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [filterRest, setFilterRest]   = useState("all");
  const [filterCat, setFilterCat]     = useState("all");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [menuRes, restRes] = await Promise.all([
        axiosAdmin.get("/menu-items"),
        axiosAdmin.get("/restaurants"),
      ]);
      setItems(menuRes.data);
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

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name, description: item.description || "",
      price: item.price, category: item.category || "",
      restaurant: item.restaurant?._id || item.restaurant
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
        await axiosAdmin.put(`/menu-items/${editing._id}`, form);
      } else {
        await axiosAdmin.post("/menu-items", form);
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
    if (!confirm("¿Eliminar este item del menú?")) return;
    try {
      await axiosAdmin.delete(`/menu-items/${id}`);
      fetchAll();
    } catch {
      alert("Error al eliminar");
    }
  };

  // Filtros
  const filtered = items.filter(item => {
    const matchRest = filterRest === "all" || item.restaurant?._id === filterRest || item.restaurant === filterRest;
    const matchCat  = filterCat  === "all" || item.category === filterCat;
    return matchRest && matchCat;
  });

  // Categorías presentes
  const presentCats = [...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Menú</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "var(--color-accent)", color: "#fff" }}>
          + Nuevo item
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <select value={filterRest} onChange={e => setFilterRest(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
          <option value="all">Todos los restaurantes</option>
          {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
          <option value="all">Todas las categorías</option>
          {presentCats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid de items */}
      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p style={{ color: "var(--text-muted)" }}>No hay items en el menú aún.</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-accent)", color: "#fff" }}>
            Agregar el primero
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item._id} className="card p-4 flex flex-col gap-3">
              {/* Categoría */}
              {item.category && (
                <span className="self-start px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(183,109,27,0.15)", color: "var(--color-accent)", border: "1px solid rgba(183,109,27,0.25)" }}>
                  {item.category}
                </span>
              )}

              {/* Nombre y precio */}
              <div>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                {item.description && (
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {item.description}
                  </p>
                )}
              </div>

              {/* Precio y restaurante */}
              <div className="flex items-end justify-between mt-auto">
                <p className="text-xl font-bold" style={{ color: "var(--color-accent)" }}>
                  Q{Number(item.price).toFixed(2)}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {item.restaurant?.name || "—"}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80"
                  style={{ background: "rgba(183,109,27,0.15)", color: "var(--color-accent)", border: "1px solid rgba(183,109,27,0.3)" }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(item._id)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition hover:opacity-80"
                  style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {editing ? "Editar item" : "Nuevo item del menú"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Nombre *</label>
                <input type="text" placeholder="Hamburguesa Clásica" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Descripción</label>
                <textarea placeholder="Con queso, lechuga y tomate..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>Precio (Q) *</label>
                  <input type="number" placeholder="75" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>Categoría</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                    <option value="">Sin categoría</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}>Restaurante *</label>
                <select value={form.restaurant} onChange={e => setForm(f => ({ ...f, restaurant: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="">Seleccionar...</option>
                  {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
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
