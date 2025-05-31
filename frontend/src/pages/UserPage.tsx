// src/pages/UserPage.tsx
//import { useAuth } from "../context/AuthContext";

import "../styles/UserPage.css";
import BottomNav from "../components/BottomNav";

export const UserPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const nombre = userInfo.name || "Usuario";

  return (
    <>
      <div className="user-container">
        <h2 className="user-welcome">
          Hola <span className="user-name">{nombre}</span>
        </h2>
      </div>

      <BottomNav isAdmin={false} />
    </>
  );
};

