// src/pages/Canchas.tsx
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/Canchas.css";
import {
  createCourt,
  deleteCourt,
  getCourts
} from "../services/courtService";

interface Court {
  id?: number;
  number: number;
  cost: number;
  max_players: number;
}

export const Canchas = () => {
  const [canchas, setCanchas] = useState<Court[]>([]);
  const [nueva, setNueva] = useState<Court>({ number: 0, cost: 0, max_players: 2 });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const rut = JSON.parse(localStorage.getItem("userInfo") || "{}").rut;

  const cargarCanchas = async () => {
    try {
      const result = await getCourts(rut);
      if (result.message) {
        setError(result.message);
      } else if (result.courts) {
        setCanchas(result.courts);
      }
    } catch (e) {
      setError("No se pudo cargar la lista de canchas");
    }
  };

  useEffect(() => {
    cargarCanchas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNueva({
      ...nueva,
      [name]: name === "number" || name === "cost" || name === "max_players" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nueva.number || nueva.cost < 0 || ![2, 4].includes(nueva.max_players)) {
      setError("Todos los campos son obligatorios y deben ser válidos");
      return;
    }

    try {
      const result = await createCourt(rut, nueva.number, nueva.cost, nueva.max_players);
      setMensaje(result.message);
      setNueva({ number: 0, cost: 0, max_players: 2 });
      cargarCanchas();
    } catch (e) {
      setError("Error al crear la cancha");
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    setMensaje("");
    try {
      const result = await deleteCourt(rut, id);
      setMensaje(result.message);
      cargarCanchas();
    } catch (e) {
      setError("Error al eliminar la cancha");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">Canchas</h2>

        <form onSubmit={handleSubmit} className="form-canchas">
          <div className="fila-formulario">
            <label>N° de Cancha:</label>
            <input
              name="number"
              type="number"
              min="1"
              value={nueva.number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="fila-formulario">
            <label>Costo:</label>
            <input
              name="cost"
              type="number"
              min="0"
              value={nueva.cost}
              onChange={handleChange}
              required
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="fila-formulario">
            <label>Máx. Jugadores:</label>
            <select
              name="max_players"
              value={nueva.max_players}
              onChange={handleChange}
              required
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          <button type="submit">Añadir</button>
        </form>

        {error && <p className="error">{error}</p>}
        {mensaje && <p className="mensaje">{mensaje}</p>}

        <h3>Lista de Canchas</h3>
        <ul className="lista-canchas">
          {canchas
            .filter((c) => typeof c.id === "number")
            .map((c) => (
              <li key={c.id}>
                <strong>Cancha #{c.number}</strong> - Costo: ${c.cost} | Máx Jugadores: {c.max_players}
                <button className="btn-eliminar" onClick={() => handleDelete(c.id!)}>
                  Eliminar
                </button>
              </li>
          ))}
        </ul>
      </div>

      <BottomNav/>
    </>
  );
};

export default Canchas;



