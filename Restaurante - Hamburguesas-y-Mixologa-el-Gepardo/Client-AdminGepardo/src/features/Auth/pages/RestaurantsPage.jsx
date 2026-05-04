import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";

const EMPTY_FORM = {
  name: "", address: "", phone: "", email: "", capacity: "", openingHours: ""
};

export const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);   // null = crear, obj = editar
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  // ── Cargar ──────────────────────────────────────────────
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axiosAdmin.get("/restaurants");
      setRestaurants(res.data);
    } catch {
      setError("Error al cargar restaurantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  // ── Abrir modal ──────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      name: r.name || "", address: r.address || "", phone: r.phone || "",
      email: r.email || "", capacity: r.capacity || "", openingHours: r.openingHours || ""
    });
    setError("");
    setShowModal(true);
  };

  // ── Guardar ──────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await axiosAdmin.put(`/restaurants/${editing._id}`, form);
      } else {
        await axiosAdmin.post("/restaurants", form);
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este restaurante?")) return;
    try {
      await axiosAdmin.delete(`/restaurants/${id}`);
      fetchRestaurants();
    } catch {
      alert("Error al eliminar");
    }
  };

  // ── UI ───────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Restaurantes
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {restaurants.length} registrado{restaurants.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={openCreate} className="btn-accent px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "var(--color-accent)", color: "#fff" }}>
          + Nuevo restaurante
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>Cargando...</div>
      ) : restaurants.length === 0 ? (
        <div className="card p-12 text-center">
          <p style={{ color: "var(--text-muted)" }}>No hay restaurantes registrados aún.</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-accent)", color: "#fff" }}>
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", background: "rgba(0,0,0,0.2)" }}>
                {["Nombre", "Dirección", "Teléfono", "Horario", "Capacidad", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r, i) => (
                <tr key={r._id}
                  style={{ borderBottom: i < restaurants.length - 1 ? "1px solid var(--border-color)" : "none" }}
                  className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                    {r.name}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{r.address || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{r.phone || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{r.openingHours || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {r.capacity ? `${r.capacity} personas` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(r)}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition hover:opacity-80"
                        style={{ background: "rgba(183,109,27,0.15)", color: "var(--color-accent)", border: "1px solid rgba(183,109,27,0.3)" }}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(r._id)}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition hover:opacity-80"
                        style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-error)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {editing ? "Editar restaurante" : "Nuevo restaurante"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { key: "name",         label: "Nombre *",    placeholder: "El Gepardo" },
                { key: "address",      label: "Dirección",   placeholder: "Zona 10, Guatemala" },
                { key: "phone",        label: "Teléfono",    placeholder: "55551234" },
                { key: "email",        label: "Email",       placeholder: "contacto@gepardo.com" },
                { key: "capacity",     label: "Capacidad",   placeholder: "60", type: "number" },
                { key: "openingHours", label: "Horario",     placeholder: "10:00 - 22:00" },
              ].map(({ key, label, placeholder, type = "text" }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }} />
                </div>
              ))}
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
