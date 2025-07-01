// src/pages/PerfilPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../styles/PerfilPage.css";

const PerfilPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="perfil-info">
        <p><strong>Nombre:</strong> {userInfo.name}</p>
        <p><strong>Rol:</strong> {userInfo.role}</p>
        <p><strong>Correo:</strong> {userInfo.email}</p>
        {userInfo.role === "user" && (
          <p><strong>Saldo:</strong> $10.000</p> // reemplazar con datos reales despues
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>

      <BottomNav/>
    </div>
  );
};

export default PerfilPage;
