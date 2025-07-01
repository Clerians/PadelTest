// src/components/BottomNav.tsx
import { FaHome, FaCalendarCheck, FaUser, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/BottomNav.css";

const BottomNav = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isAdmin = userInfo?.role === "admin";

  return (
    <div className="bottom-nav">
      <div onClick={() => navigate("/")} className="nav-item">
        <FaHome />
        <span>Inicio</span>
      </div>

      <div onClick={() => navigate("/reservas")} className="nav-item">
        <FaCalendarCheck />
        <span>Reservas</span>
      </div>

      <div onClick={() => navigate("/perfil")} className="nav-item">
        <FaUser />
        <span>Perfil</span>
      </div>

      {isAdmin && (
        <div onClick={() => navigate("/admin")} className="nav-item">
          <FaTools />
          <span>Admin</span>
        </div>
      )}
    </div>
  );
};

export default BottomNav;


