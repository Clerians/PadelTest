// src/pages/ReservasAdmin.tsx

import "../styles/ReservasAdmin.css";
import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
import { getAllBookings, Booking } from "../services/bookingService";

export const ReservasAdmin = () => {
  const [reservas, setReservas] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const rut = userInfo.rut;

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const response = await getAllBookings(rut);
        if (response.message) {
          setError(response.message);
        } else if (response.history) {
          setReservas(response.history);
        }
      } catch (e) {
        setError("No se pudieron cargar las reservas");
      }
    };

    cargarReservas();
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="welcome">Historial de Reservas</h2>

        {error && <p className="error">{error}</p>}

        <ul className="lista-reservas">
          {reservas.map((r) => (
            <li key={r.id}>
              <strong>Reserva #{r.id}</strong><br />
              Cancha: {r.court_number} | Fecha: {r.date}<br />
              Horario: {r.start_time} - {r.finish_time}<br />
              Total: ${r.total_cost}<br />
              RUT Cliente: {r.rut}
            </li>
          ))}
        </ul>
      </div>
      <BottomNav/>
    </>
  );
};

export default ReservasAdmin;

