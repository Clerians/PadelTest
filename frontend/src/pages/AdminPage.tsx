// src/pages/AdminPage.tsx
import "../styles/AdminPage.css";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const nombre = userInfo.name || "Administrador";

  return (
    <>
      <div className="admin-container">
        <h2 className="admin-welcome">
          Hola <span className="admin-name">{nombre}</span>
        </h2>

        <div className="admin-grid">
          <button className="admin-card deportes" onClick={() => navigate("/pagos")}>
            Pagos
          </button>

          <button className="admin-card clubes" onClick={() => navigate("/canchas")}>
            Canchas
          </button>

          <button className="admin-card escuelas" onClick={() => navigate("/reservasAdmin")}>
            Reservas
          </button>

          <button className="admin-card match" onClick={() => navigate("/equipamiento")}>
            Equipamiento
          </button>
        </div>
      </div>
      <BottomNav/>
    </>
  );
};