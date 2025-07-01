//authService.ts sin back, mock 
// src/services/authService.ts

type LoginResponse = {
  id: string;
  role: "admin" | "user";
  email: string;
  name: string;
};

// Tipo interno para simular usuarios con contraseña
type MockUser = LoginResponse & { password: string };

// Simulamos una base de datos en memoria (solo durante ejecución)
const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "admin@ucenin.cl",
    password: "admin123",
    name: "Pepe",
    role: "admin"
  },
  {
    id: "2",
    email: "user@ucenin.cl",
    password: "user123",
    name: "Juan",
    role: "user"
  }
];

const login = async (email: string, password: string): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simula latencia

  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const { password: _, ...userData } = user;
  return userData;
};

const register = async (
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simula latencia

  const emailExists = mockUsers.some((u) => u.email === email);
  if (emailExists) {
    throw new Error("El correo ya está registrado");
  }

  const newUser: MockUser = {
    id: (mockUsers.length + 1).toString(),
    name,
    email,
    password,
    role: "user"
  };

  mockUsers.push(newUser);
  const { password: _, ...userData } = newUser;
  return userData;
};

export const authService = {
  login,
  register
};
