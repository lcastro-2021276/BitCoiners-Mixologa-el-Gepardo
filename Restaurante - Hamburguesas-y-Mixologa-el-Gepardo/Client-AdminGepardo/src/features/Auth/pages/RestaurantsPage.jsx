import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";
import { useAuthStore } from "../store/authStore.js";
import { uploadToCloudinary } from "../../../shared/hooks/useCloudinaryUpload.js";

const EMPTY_FORM = {
  name: "",
  address: "",
  phone: "",
  email: "",
  capacity: "",
  openingHours: "",
  imageUrl: "",
};

export const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const gold = "#B8860B";
  const goldLight = "#C9972A";
  const serif = "'Cormorant Garamond', Georgia, serif";

  const { user } = useAuthStore();
  const isClient = user?.role === "Cliente" || user?.role === "CLIENT";

  /* =========================
        FETCH
  ========================= */
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axiosAdmin.get("/restaurants");
      setRestaurants(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  /* =========================
        MODAL
  ========================= */
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      name: r.name || "",
      address: r.address || "",
      phone: r.phone || "",
      email: r.email || "",
      capacity: r.capacity || "",
      openingHours: r.openingHours || "",
      imageUrl: r.imageUrl || "",
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving || uploading) return;
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError(err.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
        SAVE
  ========================= */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.name) {
        setError("El nombre es obligatorio");
        setSaving(false);
        return;
      }

      if (editing) {
        await axiosAdmin.put(`/restaurants/${editing._id}`, form);
      } else {
        await axiosAdmin.post("/restaurants", form);
      }

      closeModal();
      fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este restaurante?")) return;

    await axiosAdmin.delete(`/restaurants/${id}`);
    fetchRestaurants();
  };

  const totalCapacity = restaurants.reduce(
    (acc, r) => acc + Number(r.capacity || 0),
    0
  );

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
          Restaurantes
          <span style={{ display: "block", color: goldLight }}>
            Sucursales del sistema
          </span>
        </h1>

        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "10px" }}>
          {isClient ? "Explora nuestras sucursales y horarios" : "Administra ubicaciones, horarios y capacidad operativa"}
        </p>

        {!isClient && (
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
          + Nuevo restaurante
        </button>
        )}
      </section>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>

        <div style={cardStyle}>
          <p style={statLabel}>Restaurantes</p>
          <h2 style={{ color: "#18392b", fontSize: "34px", margin: 0 }}>
            {restaurants.length}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={statLabel}>Capacidad total</p>
          <h2 style={{ color: gold, fontSize: "34px", margin: 0 }}>
            {totalCapacity}
          </h2>
        </div>

        <div style={cardStyle}>
          <p style={statLabel}>Estado</p>
          <div style={badge}>
            <div style={dot} />
            Activo
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div style={spinner(gold)} />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "14px",
          }}
        >
          {restaurants.map((r) => (
            <div key={r._id} style={restaurantCard}>

              {/* IMAGEN */}
              {r.imageUrl ? (
                <img
                  src={r.imageUrl}
                  alt={r.name}
                  style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100px",
                  background: "linear-gradient(135deg, #0e1e15, #1a3a25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36
                }}>🏪</div>
              )}

              {/* TOP */}
              <div style={restaurantTop}>
                <span style={tag}>Restaurante</span>
                <h3 style={{ color: "#fff", fontWeight: 300, marginTop: 10 }}>
                  {r.name}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                  {r.address || "Sin dirección"}
                </p>
              </div>

              {/* BODY */}
              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>

                <p style={infoText}> {r.phone || "—"}</p>
                <p style={infoText}> {r.email || "—"}</p>
                <p style={infoText}> {r.capacity || "—"} personas</p>
                <p style={infoText}> {r.openingHours || "—"}</p>

                {!isClient && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button onClick={() => openEdit(r)} style={btnEdit}>
                    Editar
                  </button>

                  <button onClick={() => handleDelete(r._id)} style={btnDelete}>
                    Eliminar
                  </button>
                </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={overlay}>
          <div style={modal}>

            <h2 style={{ color: "#fff", fontFamily: serif, fontWeight: 300 }}>
              {editing ? "Editar restaurante" : "Nuevo restaurante"}
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {["name", "phone", "email", "capacity"].map((key) => (
                <input
                  key={key}
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  style={input}
                />
              ))}

              <input
                placeholder="Dirección"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                style={input}
              />

              <input
                placeholder="Horario"
                value={form.openingHours}
                onChange={(e) =>
                  setForm({ ...form, openingHours: e.target.value })
                }
                style={input}
              />

              {/* IMAGEN */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", display: "block", marginBottom: 6 }}>
                  Imagen del restaurante
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  style={{ ...input, cursor: "pointer", fontSize: "12px" }}
                />
                {uploading && (
                  <p style={{ color: "#C9972A", fontSize: "12px", marginTop: 6 }}>
                    ⏳ Subiendo imagen...
                  </p>
                )}
                {form.imageUrl && !uploading && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, marginTop: 8 }}
                  />
                )}
              </div>

              {error && <p style={errorText}>{error}</p>}

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" onClick={closeModal} style={btnSecondary}>
                  Cancelar
                </button>

                <button type="submit" disabled={saving || uploading} style={btnPrimary(gold, goldLight)}>
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

/* =========================
      STYLES
========================= */

const gold = "#B8860B";
const goldLight = "#C9972A";

const serif = "'Cormorant Garamond', Georgia, serif";

const cardStyle = {
  background: "#fff",
  border: "1px solid #e8e4dc",
  borderRadius: "14px",
  padding: "16px",
};

const statLabel = {
  fontSize: "12px",
  color: "#888",
};

const badge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "#e7f7ee",
  padding: "6px 10px",
  borderRadius: "999px",
  color: "#1b7a4a",
  fontSize: "12px",
};

const dot = {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#1b7a4a",
};

const restaurantCard = {
  background: "#0e1e15",
  borderRadius: "16px",
  overflow: "hidden",
};

const restaurantTop = {
  padding: "16px",
  background: "linear-gradient(135deg, #0e1e15, #152a21)",
};

const tag = {
  fontSize: "10px",
  color: goldLight,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
};

const infoText = {
  fontSize: "12px",
  color: "#444",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const modal = {
  width: "100%",
  maxWidth: "520px",
  background: "linear-gradient(145deg, #141c18, #0a0e0c)",
  border: "1px solid rgba(201,151,42,0.25)",
  borderRadius: "18px",
  padding: "20px",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
};

const errorText = {
  color: "#ff6b6b",
  fontSize: "12px",
};

const btnEdit = {
  flex: 1,
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #C9972A",
  background: "#C9972A15",
  color: gold,
};

const btnDelete = {
  flex: 1,
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #e57373",
  background: "#ffebee",
  color: "#d32f2f",
};

const btnSecondary = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "rgba(255,255,255,0.7)",
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

const spinner = (gold) => ({
  width: "34px",
  height: "34px",
  border: "3px solid #eee",
  borderTop: `3px solid ${gold}`,
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
});