// src/features/auth/pages/ReviewsPage.jsx

import { useEffect, useState } from "react";
import { axiosAdmin } from "../../../shared/apis/api.js";

const EMPTY_FORM = {
  customerName: "",
  restaurant: "",
  rating: 5,
  comment: "",
};

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const gold = "#B8860B";
  const goldLight = "#C9972A";
  const serif = "'Cormorant Garamond', Georgia, serif";

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [reviewsRes, restaurantsRes] = await Promise.all([
        axiosAdmin.get("/reviews"),
        axiosAdmin.get("/restaurants"),
      ]);

      setReviews(reviewsRes.data);
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

      if (!form.customerName || !form.restaurant || !form.rating) {
        setError("Nombre, restaurante y calificación son obligatorios");
        return;
      }

      await axiosAdmin.post("/reviews", {
        ...form,
        rating: Number(form.rating),
      });

      closeModal();
      fetchAll();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Error al guardar reseña"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "¿Eliminar esta reseña?"
    );

    if (!confirmDelete) return;

    try {
      await axiosAdmin.delete(`/reviews/${id}`);
      fetchAll();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const restaurantName =
      review.restaurant?.name || "";

    return (
      restaurantName
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      review.comment
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      review.customerName
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
          Reseñas
          <span
            style={{
              display: "block",
              color: goldLight,
            }}
          >
            Opiniones de clientes
          </span>
        </h1>

        <p
          style={{
            marginTop: "12px",
            color: "rgba(255,255,255,0.55)",
            fontSize: "13px",
          }}
        >
          Administra reseñas y valoraciones
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
          + Nueva reseña
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
          placeholder="Buscar reseña..."
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
          {filteredReviews.length} reseñas
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
            gridTemplateColumns:
              "repeat(auto-fill,minmax(320px,1fr))",
            gap: "16px",
          }}
        >
          {filteredReviews.map((review) => (
            <div
              key={review._id}
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
                  ⭐ {review.rating}/5
                </small>

                <h3
                  style={{
                    margin: "6px 0 2px 0",
                    fontWeight: 300,
                  }}
                >
                  {review.restaurant?.name || "Restaurante"}
                </h3>

                <small style={{ color: "rgba(255,255,255,0.55)" }}>
                  {review.customerName}
                </small>
              </div>

              <div style={{ padding: "16px" }}>
                <p
                  style={{
                    margin: 0,
                    color: "#666",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {review.comment || "Sin comentario"}
                </p>

                <button
                  onClick={() =>
                    handleDelete(review._id)
                  }
                  style={{
                    marginTop: "18px",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#d62828",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
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
              border:
                "1px solid rgba(201,151,42,0.2)",
            }}
          >
            <h2
              style={{
                color: "#fff",
                fontFamily: serif,
                fontWeight: 300,
              }}
            >
              Nueva reseña
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
              {/* CAMPO NUEVO: nombre del cliente */}
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
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

              <select
                value={form.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rating: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="1">1 estrella</option>
                <option value="2">2 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="5">5 estrellas</option>
              </select>

              <textarea
                placeholder="Comentario"
                value={form.comment}
                onChange={(e) =>
                  setForm({
                    ...form,
                    comment: e.target.value,
                  })
                }
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "none",
                }}
              />

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
                    : "Guardar reseña"}
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
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "#fff",
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