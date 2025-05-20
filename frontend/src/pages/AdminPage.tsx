// src/pages/AdminPage.tsx
import "../styles/AdminPage.css";
import BottomNav from "../components/BottomNav";

export const AdminPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const nombre = userInfo.name || "Administrador";

  return (
    <>
      <div className="admin-container">
        <h2 className="admin-welcome">
          Hola <span className="admin-name">{nombre}</span>
        </h2>

        <div className="admin-grid">
          <button className="admin-card deportes">Pagos</button>
          <button className="admin-card clubes">Canchas</button>
          <button className="admin-card escuelas">Reservas</button>
          <button className="admin-card match">Equipamiento</button>
        </div>
      </div>

      <BottomNav isAdmin={true} />
    </>
  );
};
