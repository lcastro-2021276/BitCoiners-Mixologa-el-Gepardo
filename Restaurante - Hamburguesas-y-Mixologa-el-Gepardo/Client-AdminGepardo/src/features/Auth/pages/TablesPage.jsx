import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";
import { useAuthStore } from "../store/authStore.js";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";

const EMPTY_FORM = {
  number: "",
  capacity: "",
  status: "disponible",
  restaurant: "",
};

export const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, tableId: null, tableNumber: "" });

  const gold = "#B8860B";
  const goldLight = "#C9972A";
  const serif = "'Cormorant Garamond', Georgia, serif";

  const { user } = useAuthStore();
  const isClient = user?.role === "Cliente" || user?.role === "CLIENT";

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [tablesRes, restRes] = await Promise.all([
        axiosAdmin.get("/tables"),
        axiosAdmin.get("/restaurants"),
      ]);

      setTables(tablesRes.data);
      setRestaurants(restRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  
  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, restaurant: restaurants[0]?._id || "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      number: t.number,
      capacity: t.capacity,
      status: t.status,
      restaurant: t.restaurant?._id || t.restaurant,
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.number || !form.capacity) {
        setError("Número y capacidad son obligatorios");
        setSaving(false);
        return;
      }

      if (editing) {
        await axiosAdmin.put(`/tables/${editing._id}`, form);
      } else {
        await axiosAdmin.post("/tables", form);
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
    const table = tables.find(t => t._id === id);
    setDeleteDialog({
      isOpen: true,
      tableId: id,
      tableNumber: table?.number || "esta mesa"
    });
  };

  const confirmDelete = async () => {
    try {
      await axiosAdmin.delete(`/tables/${deleteDialog.tableId}`);
      fetchAll();
      setDeleteDialog({ isOpen: false, tableId: null, tableNumber: "" });
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const toggleStatus = async (t) => {
    const newStatus =
      t.status === "disponible" ? "ocupada" : "disponible";

    await axiosAdmin.put(`/tables/${t._id}`, {
      status: newStatus,
    });

    fetchAll();
  };

  const disponibles = tables.filter(
    (t) => t.status === "disponible"
  ).length;

  const ocupadas = tables.filter(
    (t) => t.status === "ocupada"
  ).length;


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>

      {/* HEADER */}
      <section style={hero}>
        <h1 style={{ fontFamily: serif, fontSize: "42px", fontWeight: 300, margin: 0 }}>
          Mesas
          <span style={{ display: "block", color: goldLight }}>
            Control de ocupación
          </span>
        </h1>

        <p style={sub}>
          {isClient ? "Consulta la disponibilidad de mesas" : "Gestiona disponibilidad y asignación de mesas en tiempo real"}
        </p>

        {!isClient && (
        <button onClick={openCreate} style={btnPrimary(gold, goldLight)}>
          + Nueva mesa
        </button>
        )}
      </section>

      {/* STATS */}
      <div style={grid3}>
        <div style={statCard}>
          <p style={label}>Total</p>
          <h2 style={value}>{tables.length}</h2>
        </div>

        <div style={{ ...statCard, border: "1px solid #d1fae5" }}>
          <p style={{ ...label, color: "#059669" }}>Disponibles</p>
          <h2 style={{ color: "#10b981", fontSize: "34px", margin: 0 }}>
            {disponibles}
          </h2>
        </div>

        <div style={{ ...statCard, border: "1px solid #fee2e2" }}>
          <p style={{ ...label, color: "#dc2626" }}>Ocupadas</p>
          <h2 style={{ color: "#ef4444", fontSize: "34px", margin: 0 }}>
            {ocupadas}
          </h2>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div style={center}>
          <div style={spinner(gold)} />
        </div>
      ) : (
        <div style={gridTables}>
          {tables.map((t) => {
            const isFree = t.status === "disponible";

            return (
              <div key={t._id} style={tableCard}>

                {/* TOP */}
                <div
                  style={{
                    ...tableTop,
                    background: isFree
                      ? "linear-gradient(135deg,#065f46,#10b981)"
                      : "linear-gradient(135deg,#7f1d1d,#ef4444)",
                  }}
                >
                  <div>
                    <p style={mini}>Mesa</p>
                    <h2 style={number}>#{t.number}</h2>
                  </div>

                  <span style={badge(isFree)}>
                    {isFree ? "Disponible" : "Ocupada"}
                  </span>
                </div>

                {/* BODY */}
                <div style={body}>

                  <div style={infoBox}>
                    <p style={mini2}>Capacidad</p>
                    <p style={infoValue}>{t.capacity} personas</p>
                  </div>

                  <div style={infoBox}>
                    <p style={mini2}>Estado</p>
                    <p
                      style={{
                        ...infoValue,
                        color: isFree ? "#10b981" : "#ef4444",
                      }}
                    >
                      {isFree ? "Libre" : "En uso"}
                    </p>
                  </div>

                  <div style={infoBoxFull}>
                    <p style={mini2}>Restaurante</p>
                    <p style={infoValue}>
                      🍽 {t.restaurant?.name || "—"}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div style={actions}>

                    {!isClient && (
                    <button
                      onClick={() => toggleStatus(t)}
                      style={toggleBtn(isFree)}
                    >
                      {isFree ? "Ocupar" : "Liberar"}
                    </button>
                    )}

                    {!isClient && (
                    <button
                      onClick={() => openEdit(t)}
                      style={iconBtn("#f59e0b")}
                    >
                      ✏️
                    </button>
                    )}

                    {!isClient && (
                    <button
                      onClick={() => handleDelete(t._id)}
                      style={iconBtn("#ef4444")}
                    >
                      🗑️
                    </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>

            <h2 style={{ color: "#fff", fontFamily: serif }}>
              {editing ? "Editar mesa" : "Nueva mesa"}
            </h2>

            <form onSubmit={handleSave} style={formStyle}>

              <input
                placeholder="Número"
                value={form.number}
                onChange={(e) =>
                  setForm({ ...form, number: e.target.value })
                }
                style={input}
              />

              <input
                placeholder="Capacidad"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
                style={input}
              />

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                style={input}
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
              </select>

              <select
                value={form.restaurant}
                onChange={(e) =>
                  setForm({ ...form, restaurant: e.target.value })
                }
                style={input}
              >
                <option value="">Restaurante</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>

              {error && <p style={errorText}>{error}</p>}

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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, tableId: null, tableNumber: "" })}
        onConfirm={confirmDelete}
        title="Eliminar mesa"
        message={`¿Estás seguro de que deseas eliminar la mesa #${deleteDialog.tableNumber}? Esta acción se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

    </div>
  );
};



const gold = "#B8860B";
const goldLight = "#C9972A";

const serif = "'Cormorant Garamond', Georgia, serif";

/* layout */
const hero = {
  background: "#0e1e15",
  padding: "40px",
  borderRadius: "16px",
  color: "#fff",
};

const sub = {
  color: "rgba(255,255,255,0.45)",
  fontSize: "13px",
  marginTop: "10px",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "12px",
};

const statCard = {
  background: "#fff",
  border: "1px solid #e8e4dc",
  borderRadius: "14px",
  padding: "16px",
};

const label = {
  fontSize: "12px",
  color: "#888",
};

const value = {
  fontSize: "34px",
  color: "#18392b",
  margin: 0,
};

const gridTables = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
  gap: "14px",
};

const tableCard = {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
};

const tableTop = {
  padding: "16px",
  color: "#fff",
};

const mini = { fontSize: "10px", opacity: 0.7 };
const number = { fontSize: "42px", margin: 0 };

const body = { padding: "14px", display: "flex", flexDirection: "column", gap: "10px" };

const infoBox = {
  background: "#f9fafb",
  padding: "10px",
  borderRadius: "10px",
};

const infoBoxFull = {
  background: "#f9fafb",
  padding: "10px",
  borderRadius: "10px",
};

const mini2 = { fontSize: "10px", color: "#999" };

const infoValue = { fontSize: "12px", fontWeight: 600 };

const actions = { display: "flex", gap: "8px" };

const toggleBtn = (isFree) => ({
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  background: isFree ? "#ef4444" : "#10b981",
  color: "#fff",
  border: "none",
});

const iconBtn = (color) => ({
  padding: "10px",
  borderRadius: "10px",
  border: `1px solid ${color}`,
  background: `${color}15`,
});

const badge = (isFree) => ({
  padding: "6px 10px",
  borderRadius: "999px",
  background: isFree ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
  color: isFree ? "#10b981" : "#ef4444",
  fontSize: "12px",
});

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "linear-gradient(145deg,#141c18,#0a0e0c)",
  padding: "20px",
  borderRadius: "18px",
  width: "100%",
  maxWidth: "420px",
};

const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };

const input = {
  padding: "12px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
};

const errorText = { color: "#ff6b6b", fontSize: "12px" };

const btnSecondary = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent",
  color: "rgba(255,255,255,0.7)",
};

const btnPrimary = (g, gl) => ({
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  background: `linear-gradient(135deg,${g},${gl})`,
  color: "#fff",
  border: "none",
});

const center = {
  display: "flex",
  justifyContent: "center",
  padding: "60px",
};

const spinner = (gold) => ({
  width: "34px",
  height: "34px",
  border: "3px solid #eee",
  borderTop: `3px solid ${gold}`,
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
});