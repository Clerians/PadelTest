const API_BASE_URL = "http://localhost:3000/user"; // asegúrate de que el backend tenga este prefijo

export interface User {
  rut: string;
  password: string;
  email: string;
  name: string;
}

// Registro de nuevo usuario
export const registerUser = async (
  user: User
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(user),
  });

  return await response.json();
};

// Actualización de saldo
export const updateBalance = async (
  rut: string,
  balance: number
): Promise<{ message: string; balance?: number }> => {
  const response = await fetch(`${API_BASE_URL}/updateBalance`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rut, balance }),
  });

  return await response.json();
};



