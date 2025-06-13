// src/pages/ReservasPage.tsx

import "../styles/ReservasPage.css";
import BottomNav from "../components/BottomNav";
import ReservaModal from "../components/ReservaModal";
import { useState } from "react";

const ReservasPage = () => {
  const [modo, setModo] = useState<"reservas" | "modificar">("reservas");
  const [tabReservas, setTabReservas] = useState("activas");
  const [tabModificar, setTabModificar] = useState("activas");
  const [showModal, setShowModal] = useState(false);

const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
console.log("DEBUG: userInfo", userInfo);
const isAdmin = userInfo?.role === "admin";


  return (
    <>
      <div className="reservas-container">
        <div className="reservas-header">
          <h3>Mis reservas</h3>

          <div className="reservas-switch">

            <button
              className={modo === "reservas" ? "active" : ""}
              onClick={() => setModo("reservas")}
            >Reservas</button>

            <button
              className={modo === "modificar" ? "active" : ""}
              onClick={() => setModo("modificar")}
            >Modificar</button>
          </div>

          <div className="reservas-tabs">
            {modo === "reservas" ? (
              <>
                <button
                  className={tabReservas === "activas" ? "active" : ""}
                  onClick={() => setTabReservas("activas")}
                >Activas</button>

                <button
                  className={tabReservas === "porPagar" ? "active" : ""}
                  onClick={() => setTabReservas("porPagar")}
                >Por pagar</button>

                <button
                  className={tabReservas === "porConfirmar" ? "active" : ""}
                  onClick={() => setTabReservas("porConfirmar")}
                >Por confirmar</button>
              </>
            ) : (
              <>
                <button
                  className={tabModificar === "activas" ? "active" : ""}
                  onClick={() => setTabModificar("activas")}
                >
                  Activas
                </button>
                <button
                  className={tabModificar === "canceladas" ? "active" : ""}
                  onClick={() => setTabModificar("canceladas")}
                >Canceladas</button>
              </>
            )}
          </div>
        </div>

        <div className="reservas-content">
          {modo === "reservas" && tabReservas === "activas" && (
            <div className="reserva-card">Cancha 1</div>
          )}
          {modo === "reservas" && tabReservas === "porPagar" && (
            <div className="reserva-card">Cancha 2 - $5000 por pagar</div>
          )}
          {modo === "reservas" && tabReservas === "porConfirmar" && (
            <div className="reserva-card">Esperando confirmación para Cancha 3</div>
          )}

          {modo === "modificar" && tabModificar === "activas" && (
            <div className="reserva-card">Modificar Cancha 1, 10 de mayo, 10:30 a 11:30</div>
          )}
          {modo === "modificar" && tabModificar === "canceladas" && (
            <div className="reserva-card">Reserva cancelada para Cancha 2, 9 de mayo</div>
          )}
        </div>

        <button className="nueva-reserva-btn" onClick={() => setShowModal(true)}>Nueva reserva</button>
      </div>
      
      {showModal && <ReservaModal onClose={() => setShowModal(false)} />}

      <BottomNav isAdmin={isAdmin}/>
    </>
  );
};

export default ReservasPage;