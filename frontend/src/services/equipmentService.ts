// src/services/equipmentService.ts
const API_BASE_URL = "http://localhost:3000/equipament"; 

export interface Equipment {
  id?: number;
  name: string;
  stock: number;
  type: string;
  cost: number;
}

// Obtener listado de equipamiento
export const fetchEquipment = async (): Promise<Equipment[]> => {
  const response = await fetch(`${API_BASE_URL}/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Error al obtener el equipamiento");
  }

  return await response.json(); 
};

// Crear nuevo equipamiento
export const createEquipment = async (equipment: Equipment): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(equipment)
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al crear equipamiento");
  }

  return await response.json();
};

// Actualizar equipamiento existente
export const updateEquipment = async (equipment: Equipment): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(equipment)
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al actualizar equipamiento");
  }

  return await response.json();
};

// Eliminar equipamiento
export const deleteEquipment = async (id: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al eliminar equipamiento");
  }

  return await response.json();
};