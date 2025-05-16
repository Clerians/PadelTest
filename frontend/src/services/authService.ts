
const API_URL = "http://localhost:3000";

type LoginResponse = {
  id: string;
  role: "admin" | "user";
  email: string;
  name: string
};

const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    }),
    credentials: 'include'
  })

  
  const data = await response.json()

  if(response.ok) {
    return data
  }

  throw new Error(data.message)

}

export const authService = {
  login
}