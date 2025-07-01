// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { UserPage } from "./pages/UserPage";
import { Pagos } from "./pages/Pagos";
import { ReservasAdmin } from "./pages/ReservasAdmin";
import Equipamiento from "./pages/Equipamiento";
import Canchas from "./pages/Canchas";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import ReservasPage from "./pages/ReservasPage";
import PerfilPage from "./pages/PerfilPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/reservas" element={<ReservasPage />} />
        <Route path="/perfil" element={<PerfilPage />}/>
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/reservasAdmin" element={<ReservasAdmin/>}/>
        <Route path="/equipamiento" element={<Equipamiento />} />
        <Route path="/canchas" element={<Canchas />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
