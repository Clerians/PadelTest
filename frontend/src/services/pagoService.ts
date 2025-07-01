const API_URL = "http://localhost:3000"; // ajusta según tu entorno

export const buscarReservasPorPagar = async (rut: string) => {
  const res = await fetch(`${API_URL}/booking/pendientes/${rut}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
};
