// src/pages/ReservasPage.tsx
import "../styles/ReservasPage.css";
import BottomNav from "../components/BottomNav";
import ReservaModal from "../components/ReservaModal";
import { useState, useEffect } from "react";
import {
  createBooking,
  getMyBookings,
  deleteBooking,
  Booking,
} from "../services/bookingService";

const ReservasPage = () => {
  const [modo, setModo] = useState<"reservas" | "modificar">("reservas");
  const [tabReservas, setTabReservas] = useState<"activas" | "porPagar" | "porConfirmar">("activas");
  const [tabModificar, setTabModificar] = useState<"activas" | "canceladas">("activas");
  const [showModal, setShowModal] = useState(false);
  const [reservas, setReservas] = useState<Booking[]>([]);
  const [userInfo, setUserInfo] = useState<{ rut?: string; role?: string }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const userData = storedUser ? JSON.parse(storedUser) : null;

    if (userData?.rut) {
      setUserInfo(userData);

      const obtenerReservas = async () => {
        try {
          const response = await getMyBookings(userData.rut);
          if (response?.bookings) {
            setReservas(response.bookings);
          }
        } catch (error) {
          console.error("Error al obtener reservas", error);
        }
      };

      obtenerReservas();
    }
  }, []);

  const isAdmin = userInfo?.role === "admin";

  const handleDeleteReserva = async (id: number) => {
    try {
      await deleteBooking(id, userInfo.rut!);
      setReservas(reservas.filter((reserva) => reserva.id !== id));
    } catch (error) {
      console.error("Error al eliminar reserva", error);
    }
  };

  const handleCrearReserva = async (reservaParcial: Omit<Booking, "id" | "total_cost">) => {
    try {
      if (!userInfo.rut) {
        console.error("Usuario no autenticado");
        return;
      }

      const nuevaReserva = { ...reservaParcial, rut: userInfo.rut };
      const response = await createBooking(nuevaReserva);

      if (response?.message === "Reserva creada exitosamente") {
        const recarga = await getMyBookings(userInfo.rut);
        setReservas(recarga.bookings || []);
      }
    } catch (error) {
      console.error("Error al crear reserva", error);
    }
  };

  return (
    <>
      <div className="reservas-container">
        <div className="reservas-header">
          <h3>Mis Reservas</h3>
          <div className="reservas-switch">
            <button className={modo === "reservas" ? "active" : ""} onClick={() => setModo("reservas")}>
              Reservas
            </button>
            <button className={modo === "modificar" ? "active" : ""} onClick={() => setModo("modificar")}>
              Modificar
            </button>
          </div>
          <div className="reservas-tabs">
            {modo === "reservas" ? (
              <>
                <button className={tabReservas === "activas" ? "active" : ""} onClick={() => setTabReservas("activas")}>
                  Activas
                </button>
                <button className={tabReservas === "porPagar" ? "active" : ""} onClick={() => setTabReservas("porPagar")}>
                  Por pagar
                </button>
                <button className={tabReservas === "porConfirmar" ? "active" : ""} onClick={() => setTabReservas("porConfirmar")}>
                  Por confirmar
                </button>
              </>
            ) : (
              <>
                <button className={tabModificar === "activas" ? "active" : ""} onClick={() => setTabModificar("activas")}>
                  Activas
                </button>
                <button className={tabModificar === "canceladas" ? "active" : ""} onClick={() => setTabModificar("canceladas")}>
                  Canceladas
                </button>
              </>
            )}
          </div>
        </div>

        <div className="reservas-content">
          {reservas.length > 0 ? (
            reservas.map((reserva) => (
              <div key={reserva.id} className="reserva-card">
                <p>
                  Cancha {reserva.court_number} - {reserva.date} ({reserva.start_time} - {reserva.finish_time})
                </p>
                <button onClick={() => handleDeleteReserva(reserva.id!)}>Eliminar</button>
              </div>
            ))
          ) : (
            <p className="no-reservas">No tienes reservas activas en este momento.</p>
          )}
        </div>

        <button className="nueva-reserva-btn" onClick={() => setShowModal(true)}>
          Nueva reserva
        </button>
      </div>

      {showModal && (
        <ReservaModal
          onClose={() => setShowModal(false)}
          onCreateReserva={handleCrearReserva}
        />
      )}
      <BottomNav/>
    </>
  );
};

export default ReservasPage;
