import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  restaurant: "",
};

const CATEGORIES = [
  "Entradas",
  "Platos principales",
  "Hamburguesas",
  "Bebidas",
  "Mixología",
  "Postres",
  "Otro",
];

export const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [filterRest, setFilterRest] = useState("all");
  const [filterCat, setFilterCat] = useState("all");

  const gold = "#B8860B";
  const goldLight = "#C9972A";
  const serif = "'Cormorant Garamond', Georgia, serif";

  /* =========================
        DATA FETCH
  ========================= */
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [menuRes, restRes] = await Promise.all([
        axiosAdmin.get("/menu-items"),
        axiosAdmin.get("/restaurants"),
      ]);

      setItems(menuRes.data);
      setRestaurants(restRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* =========================
        MODAL CONTROL
  ========================= */
  const openCreate = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      restaurant: restaurants[0]?._id || "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category || "",
      restaurant: item.restaurant?._id || item.restaurant,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  /* =========================
        SAVE
  ========================= */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.name || !form.price || !form.restaurant) {
        setError("Nombre, precio y restaurante son obligatorios");
        setSaving(false);
        return;
      }

      if (editing) {
        await axiosAdmin.put(`/menu-items/${editing._id}`, form);
      } else {
        await axiosAdmin.post("/menu-items", form);
      }

      closeModal();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este item del menú?")) return;

    await axiosAdmin.delete(`/menu-items/${id}`);
    fetchAll();
  };

  /* =========================
        FILTERS
  ========================= */
  const filtered = items.filter((item) => {
    const matchRest =
      filterRest === "all" ||
      item.restaurant?._id === filterRest ||
      item.restaurant === filterRest;

    const matchCat = filterCat === "all" || item.category === filterCat;

    return matchRest && matchCat;
  });

  const presentCats = [
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ];

  /* =========================
        UI
  ========================= */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>

      {/* HEADER */}
      <section
        style={{
          background: "#0e1e15",
          borderRadius: "16px",
          padding: "40px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h1 style={{ fontFamily: serif, fontSize: "42px", fontWeight: 300, margin: 0 }}>
          Menú
          <span style={{ display: "block", color: goldLight }}>
            Gestión gastronómica
          </span>
        </h1>

        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "10px" }}>
          Administra platillos, bebidas y categorías del restaurante
        </p>

        <button
          onClick={openCreate}
          style={{
            marginTop: "14px",
            background: gold,
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          + Nuevo item
        </button>
      </section>

      {/* FILTERS */}
      <section
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          background: "#fff",
          border: "1px solid #e8e4dc",
          borderRadius: "12px",
          padding: "14px",
        }}
      >
        <select
          value={filterRest}
          onChange={(e) => setFilterRest(e.target.value)}
        >
          <option value="all">Todos los restaurantes</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {presentCats.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div style={{ marginLeft: "auto", color: gold }}>
          {filtered.length} items
        </div>
      </section>

      {/* LIST */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              border: "3px solid #eee",
              borderTop: `3px solid ${gold}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "14px",
          }}
        >
          {filtered.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#fff",
                border: "1px solid #e8e4dc",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              <div style={{ background: "#0e1e15", padding: "14px", color: "#fff" }}>
                <small style={{ color: goldLight }}>
                  {item.category || "Sin categoría"}
                </small>
                <h3 style={{ margin: 0, fontWeight: 300 }}>{item.name}</h3>
              </div>

              <div style={{ padding: "14px" }}>
                <p style={{ fontSize: "12px", color: "#777" }}>
                  {item.description || "Sin descripción"}
                </p>

                <p style={{ color: gold }}>
                  Q{Number(item.price).toFixed(2)}
                </p>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEdit(item)}>Editar</button>
                  <button onClick={() => handleDelete(item._id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
            MODAL PREMIUM
      ========================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              borderRadius: "18px",
              padding: "22px",
              background:
                "linear-gradient(145deg, rgba(20,28,24,0.98), rgba(10,14,12,0.98))",
              border: "1px solid rgba(201,151,42,0.25)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,151,42,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h2 style={{ color: "#fff", fontFamily: serif, fontWeight: 300 }}>
              {editing ? "Editar item" : "Nuevo item"}
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              <input
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />

              <textarea
                placeholder="Descripción"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="number"
                placeholder="Precio"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                style={inputStyle}
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                <option value="">Categoría</option>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={form.restaurant}
                onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
                style={inputStyle}
              >
                <option value="">Restaurante</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {error && (
                <p style={{ color: "#ff6b6b", fontSize: "12px" }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={closeModal} style={btnSecondary}>
                  Cancelar
                </button>

                <button type="submit" disabled={saving} style={btnPrimary(gold, goldLight)}>
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


const inputStyle = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  outline: "none",
};

const btnSecondary = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "rgba(255,255,255,0.7)",
  cursor: "pointer",
};

const btnPrimary = (gold, goldLight) => ({
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
  border: "none",
  color: "#fff",
  fontWeight: 500,
  cursor: "pointer",
});