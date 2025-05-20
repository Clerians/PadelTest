// src/components/BottomNav.tsx
import { FaHome, FaCalendarCheck, FaUser, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/BottomNav.css";

interface BottomNavProps {
  isAdmin?: boolean;
}

const BottomNav = ({ isAdmin = false }: BottomNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      <div onClick={() => navigate("/home")} className="nav-item">
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
