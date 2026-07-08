import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "",
};

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([
    { _id: "admin", name: "Admin" },
    { _id: "cliente", name: "Cliente" },
    { _id: "mesero", name: "Mesero" },
  ]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, userId: null, userName: "" });

  const gold = "#B8860B";
  const goldLight = "#C9972A";
  const serif = "'Cormorant Garamond', Georgia, serif";

  
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [usersRes, rolesRes] = await Promise.all([
        axiosAdmin.get("/users"),
        axiosAdmin.get("/roles"),
      ]);

      setUsers(usersRes.data);
      
      // Si no hay roles, usar roles por defecto
      if (!rolesRes.data || rolesRes.data.length === 0) {
        setRoles([
          { _id: "admin", name: "Admin" },
          { _id: "cliente", name: "Cliente" },
          { _id: "mesero", name: "Mesero" },
        ]);
      } else {
        setRoles(rolesRes.data);
      }
    } catch (err) {
      console.log(err);
      // En caso de error, usar roles por defecto
      setRoles([
        { _id: "admin", name: "Admin" },
        { _id: "cliente", name: "Cliente" },
        { _id: "mesero", name: "Mesero" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* =========================
        MODAL
  ========================= */
  const openCreate = () => {
    setEditing(null);

    setForm({
      ...EMPTY_FORM,
      role: roles[0]?._id || "",
    });

    setError("");
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditing(user);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role?._id || user.role,
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

    try {
      setSaving(true);
      setError("");

      if (!form.name || !form.email || !form.role) {
        setError("Nombre, correo y rol son obligatorios");
        return;
      }

      if (!editing && !form.password) {
        setError("La contraseña es obligatoria");
        return;
      }

      if (editing) {
        await axiosAdmin.put(`/users/${editing._id}`, form);
      } else {
        await axiosAdmin.post("/auth/register", form);
      }

      closeModal();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
        DELETE
  ========================= */
  const handleDelete = async (id) => {
    const user = users.find(u => u._id === id);
    setDeleteDialog({
      isOpen: true,
      userId: id,
      userName: user?.name || "este usuario"
    });
  };

  const confirmDelete = async () => {
    try {
      await axiosAdmin.delete(`/users/${deleteDialog.userId}`);
      fetchAll();
      setDeleteDialog({ isOpen: false, userId: null, userName: "" });
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
        FILTER
  ========================= */
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* =========================
        UI
  ========================= */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* HEADER */}
      <section
        style={{
          background: "#0e1e15",
          borderRadius: "18px",
          padding: "40px",
          color: "#fff",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            fontWeight: 300,
            fontFamily: serif,
          }}
        >
          Usuarios
          <span
            style={{
              display: "block",
              color: goldLight,
            }}
          >
            Panel administrativo
          </span>
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: "rgba(255,255,255,0.55)",
            fontSize: "13px",
          }}
        >
          Gestiona usuarios, accesos y roles del sistema
        </p>

        <button
          onClick={openCreate}
          style={{
            marginTop: "18px",
            background: gold,
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          + Nuevo usuario
        </button>
      </section>

      {/* FILTER */}
      <section
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e8e4dc",
          padding: "14px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />

        <div style={{ color: gold }}>
          {filteredUsers.length} usuarios
        </div>
      </section>

      {/* LIST */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              border: "3px solid #eee",
              borderTop: `3px solid ${gold}`,
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: "16px",
          }}
        >
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              style={{
                background: "#fff",
                borderRadius: "14px",
                border: "1px solid #e8e4dc",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#0e1e15",
                  padding: "18px",
                  color: "#fff",
                }}
              >
                <small style={{ color: goldLight }}>
                  {user.role?.name || "Sin rol"}
                </small>

                <h3
                  style={{
                    margin: "6px 0 0 0",
                    fontWeight: 300,
                  }}
                >
                  {user.name}
                </h3>
              </div>

              <div style={{ padding: "16px" }}>
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  {user.email}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "18px",
                  }}
                >
                  <button
                    onClick={() => openEdit(user)}
                    style={btnSecondary}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    style={btnDanger}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
            MODAL
      ========================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              borderRadius: "18px",
              padding: "24px",
              background:
                "linear-gradient(145deg, rgba(20,28,24,0.98), rgba(10,14,12,0.98))",
              border: "1px solid rgba(201,151,42,0.2)",
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontFamily: serif,
                fontWeight: 300,
              }}
            >
              {editing ? "Editar usuario" : "Nuevo usuario"}
            </h2>

            <form
              onSubmit={handleSave}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "18px",
              }}
            >
              <input
                type="text"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="password"
                placeholder={
                  editing
                    ? "Nueva contraseña (opcional)"
                    : "Contraseña"
                }
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                style={inputStyle}
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                style={{
                  ...inputStyle,
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                }}
              >
                <option value="">Seleccionar rol</option>

                {roles.map((role) => (
                  <option key={role._id} value={role._id} style={{ color: "#000" }}>
                    {role.name}
                  </option>
                ))}
              </select>

              {error && (
                <p
                  style={{
                    color: "#ff6b6b",
                    fontSize: "13px",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={btnSecondary}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={btnPrimary(gold, goldLight)}
                >
                  {saving
                    ? "Guardando..."
                    : editing
                    ? "Actualizar"
                    : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, userId: null, userName: "" })}
        onConfirm={confirmDelete}
        title="Eliminar usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${deleteDialog.userName}"? Esta acción se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

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
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const btnDanger = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#d62828",
  color: "#fff",
  cursor: "pointer",
};

const btnPrimary = (gold, goldLight) => ({
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
});