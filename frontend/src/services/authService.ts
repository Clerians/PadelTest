//authService.ts sin back, mock
// src/services/authService.ts

type LoginResponse = {
  id: string;
  role: "admin" | "user";
  email: string;
  name: string;
};

// Creamos un tipo extendido solo para uso interno del mock
type MockUser = LoginResponse & { password: string };

const login = async (email: string, password: string): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simula latencia

  const mockUsers: MockUser[] = [
    {
      id: "1",
      email: "admin@ucenin.cl",
      password: "admin123",
      name: "Administrador",
      role: "admin"
    },
    {
      id: "2",
      email: "user@ucenin.cl",
      password: "user123",
      name: "Usuario",
      role: "user"
    }
  ];

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  // Retornamos solo los campos que están en LoginResponse
  const { password: _, ...userData } = user;
  return userData;
};

export const authService = {
  login
};