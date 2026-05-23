import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";

const EMPTY_FORM = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  reservationDate: "",
  numberOfGuests: 1,
  restaurant: "",
};

export const ReservationsPage = () => {

  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const gold = "#B8860B";
  const goldLight = "#C9972A";
  const dark = "#0e1e15";

  const fetchAll = async () => {

    try {

      setLoading(true);

      const [reservationsRes, restaurantsRes] = await Promise.all([
        axiosAdmin.get("/reservations"),
        axiosAdmin.get("/restaurants"),
      ]);

      setReservations(reservationsRes.data);
      setRestaurants(restaurantsRes.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {

    setForm({
      ...EMPTY_FORM,
      restaurant: restaurants[0]?._id || "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {

    if (saving) return;

    setShowModal(false);

    setForm(EMPTY_FORM);

    setError("");
  };


  const handleSave = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      setError("");

      if (
        !form.customerName ||
        !form.reservationDate ||
        !form.restaurant
      ) {
        setError("Nombre, fecha y restaurante son obligatorios");
        return;
      }

      await axiosAdmin.post("/reservations", form);

      closeModal();

      fetchAll();

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Error al crear la reserva"
      );

    } finally {

      setSaving(false);
    }
  };


  const handleDelete = async (id) => {

    const confirmDelete = confirm(
      "¿Seguro que deseas eliminar esta reserva?"
    );

    if (!confirmDelete) return;

    try {

      await axiosAdmin.delete(`/reservations/${id}`);

      fetchAll();

    } catch (err) {

      console.log(err);
    }
  };


  const filteredReservations = reservations.filter((reservation) => {

    return (
      reservation.customerName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      reservation.customerEmail
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  });


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >

      {/* HEADER */}
      <section
        style={{
          background: dark,
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
          }}
        >
          Reservas
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: "rgba(255,255,255,0.55)",
            fontSize: "14px",
          }}
        >
          Gestiona reservas de clientes y restaurantes
        </p>

        <button
          onClick={openCreate}
          style={{
            marginTop: "20px",
            background: gold,
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Nueva reserva
        </button>
      </section>

      {/* FILTER */}
      <section
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e8e4dc",
          padding: "14px",
        }}
      >
        <input
          type="text"
          placeholder="Buscar reserva..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            outline: "none",
          }}
        />
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
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: "16px",
          }}
        >

          {filteredReservations.map((reservation) => (

            <div
              key={reservation._id}
              style={{
                background: "#fff",
                borderRadius: "14px",
                border: "1px solid #e8e4dc",
                overflow: "hidden",
              }}
            >

              <div
                style={{
                  background: dark,
                  padding: "18px",
                  color: "#fff",
                }}
              >
                <small style={{ color: goldLight }}>
                  {reservation.restaurant?.name || "Sin restaurante"}
                </small>

                <h3
                  style={{
                    margin: "6px 0 0 0",
                    fontWeight: 400,
                  }}
                >
                  {reservation.customerName}
                </h3>
              </div>

              <div style={{ padding: "16px" }}>

                <p style={textStyle}>
                  📧 {reservation.customerEmail || "Sin correo"}
                </p>

                <p style={textStyle}>
                  📞 {reservation.customerPhone || "Sin teléfono"}
                </p>

                <p style={textStyle}>
                  👥 {reservation.numberOfGuests} personas
                </p>

                <p style={textStyle}>
                  📅 {
                    new Date(
                      reservation.reservationDate
                    ).toLocaleString()
                  }
                </p>

                <button
                  onClick={() => handleDelete(reservation._id)}
                  style={btnDanger}
                >
                  Eliminar
                </button>

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
              maxWidth: "550px",
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
                fontWeight: 400,
              }}
            >
              Nueva reserva
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
                placeholder="Nombre del cliente"
                value={form.customerName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customerName: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Teléfono"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customerPhone: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customerEmail: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                type="datetime-local"
                value={form.reservationDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reservationDate: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                type="number"
                placeholder="Número de personas"
                value={form.numberOfGuests}
                onChange={(e) =>
                  setForm({
                    ...form,
                    numberOfGuests: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <select
                value={form.restaurant}
                onChange={(e) =>
                  setForm({
                    ...form,
                    restaurant: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">
                  Seleccionar restaurante
                </option>

                {restaurants.map((restaurant) => (
                  <option
                    key={restaurant._id}
                    value={restaurant._id}
                  >
                    {restaurant.name}
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
                    : "Crear reserva"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
};

const textStyle = {
  margin: "6px 0",
  color: "#555",
  fontSize: "14px",
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
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const btnDanger = {
  width: "100%",
  marginTop: "14px",
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