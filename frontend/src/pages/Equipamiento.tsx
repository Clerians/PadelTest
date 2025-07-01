import { useEffect, useState } from "react";
import {Equipment,fetchEquipment,createEquipment,updateEquipment,deleteEquipment} from "../services/equipmentService";
import BottomNav from "../components/BottomNav";
import "../styles/Equipamiento.css";

export const Equipamiento = () => {
  const [equipos, setEquipos] = useState<Equipment[]>([]);
  const [nuevo, setNuevo] = useState<Equipment>({ name: "", stock: 0, type: "", cost: 0 });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarEquipamiento = async () => {
    try {
      const data = await fetchEquipment();
      setEquipos(data);
    } catch (e) {
      setError("No se pudo cargar el equipamiento");
    }
  };

  useEffect(() => {
    cargarEquipamiento();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevo({
      ...nuevo,
      [name]: ["stock", "cost"].includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nuevo.name || !nuevo.type || nuevo.stock <= 0 || nuevo.cost < 0) {
      setError("Todos los campos son obligatorios y deben ser válidos");
      return;
    }

    try {
      const result = nuevo.id
        ? await updateEquipment(nuevo)
        : await createEquipment(nuevo);

      setMensaje(result.message);
      setNuevo({ name: "", stock: 0, type: "", cost: 0 });
      cargarEquipamiento();
    } catch (e) {
      setError("Error al guardar equipamiento");
    }
  };

  const handleEdit = (item: Equipment) => {
    setNuevo(item); // Carga datos actuales en el formulario
    setMensaje("");
    setError("");
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      const result = await deleteEquipment(id);
      setMensaje(result.message);
      cargarEquipamiento();
    } catch (e) {
      setError("Error al eliminar el equipamiento");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="titulo">Equipamiento</h2>

        <form onSubmit={handleSubmit} className="form-equipamiento">
          <div className="fila-formulario">
            <label>Nombre:</label>
            <input name="name" value={nuevo.name} onChange={handleChange} required />
          </div>

          <div className="fila-formulario">
            <label>Stock:</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={nuevo.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="fila-formulario">
            <label>Tipo:</label>
            <input name="type" value={nuevo.type} onChange={handleChange} required />
          </div>

          <div className="fila-formulario">
            <label>Costo:</label>
            <input
              name="cost"
              type="number"
              value={nuevo.cost}
              onChange={handleChange}
              onWheel={(e) => e.currentTarget.blur()}
              required
            />
          </div>

          <button type="submit">
            {nuevo.id ? "Actualizar" : "Añadir"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {mensaje && <p className="mensaje">{mensaje}</p>}

        <h3>Lista de Equipamiento</h3>
        <ul className="lista-equipamiento">
          {equipos.map((e) => (
            <li key={e.id ?? e.name}>
              <strong>{e.name}</strong> - {e.type} | Stock: {e.stock} | Costo: ${e.cost}
              {" "}
              {e.id && (
                <>
                  <button onClick={() => handleEdit(e)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => handleDelete(e.id)}>
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <BottomNav />
    </>
  );
};

export default Equipamiento;
