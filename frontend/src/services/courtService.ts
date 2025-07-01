// src/services/courtService.ts
const API_BASE_URL = "http://localhost:3000/court"; // Asegúrate que el backend tenga este prefijo

export interface Court {
  id?: number;
  number: number;
  cost: number;
  max_players: number;
}

// Crear nueva cancha (solo admin)
export const createCourt = async (
  rut: string,
  number: number,
  cost: number,
  max_players: number
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/createCourt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rut, number, cost, max_players }),
  });

  return await response.json();
};

// Obtener lista de canchas (solo admin)
export const getCourts = async (
  rut: string
): Promise<{ courts?: Court[]; message?: string }> => {
  const response = await fetch(`${API_BASE_URL}/getCourts`, {
    method: "POST", // ⚠️ Cambiado a POST para permitir body con rut de forma válida
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rut }),
  });

  return await response.json();
};

//Eliminar cancha (solo admin)
export const deleteCourt = async (
  rut: string,
  id: number
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/deleteCourt`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rut, id }),
  });

  return await response.json();
};


