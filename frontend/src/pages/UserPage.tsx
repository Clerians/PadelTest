//import { useAuth } from "../context/AuthContext";

export const UserPage = () => {
  //const { usuario, logout } = useAuth();
  const { email } =  JSON.parse( localStorage.getItem('userInfo')||'')

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido Socio</h1>
      <p>Correo: {email}</p>
      <button onClick={undefined}>Cerrar sesión</button>
    </div>
  );
};
