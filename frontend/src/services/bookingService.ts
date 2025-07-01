const API_BASE_URL = "http://localhost:3000/booking"; // Confirmamos prefijo correcto

export interface Booking {
  rut: string;
  date: string;
  start_time: string;
  id?: number;
  court_number?: number;
  finish_time?: string;
  total_cost?: number;
  usuario?: string;
}

// 🏗 Crear reserva
export const createBooking = async (
  booking: Booking
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(booking),
  });

  return await response.json();
};

// 📜 Obtener historial completo (solo para admin)
export const getAllBookings = async (
  rut: string
): Promise<{ history?: Booking[]; message?: string }> => {
  const response = await fetch(`${API_BASE_URL}/getAllBookings`, {
    method: "POST", // ← cambiamos a POST para enviar rut de forma válida
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rut }),
  });

  return await response.json();
};

// 🧾 Obtener reservas del usuario
export const getMyBookings = async (
  rut: string
): Promise<{ bookings?: Booking[]; message?: string }> => {
  const response = await fetch(`${API_BASE_URL}/myBookings`, {
    method: "POST", // también se recomienda POST para mantener coherencia
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rut }),
  });

  return await response.json();
};

// ❌ Cancelar reserva
export const deleteBooking = async (
  id: number,
  rut: string
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/deleteBooking/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rut }),
  });

  return await response.json();
};



