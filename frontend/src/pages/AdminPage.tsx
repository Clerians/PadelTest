//import { useAuth } from "../context/AuthContext";

export const AdminPage = () => {
  //const { usuario, logout } = useAuth();
  const { email } =  JSON.parse( localStorage.getItem('userInfo')||'');

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {email}</p>
      <button onClick={undefined}>Cerrar sesión</button>
    </div>
  );
};
