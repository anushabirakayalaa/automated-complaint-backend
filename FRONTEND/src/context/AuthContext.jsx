import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const savedToken = localStorage.getItem("token");
  const [token, setToken] = useState(savedToken);
  const [user, setUser] = useState(savedToken ? decodeToken(savedToken) : null);

  const login = async (formData) => {
    const response = await loginUser(formData);
    const receivedToken = response.data.token;

    if (!receivedToken) {
      throw new Error(response.data.message || "Login failed");
    }

    localStorage.setItem("token", receivedToken);
    setToken(receivedToken);
    setUser(decodeToken(receivedToken));
  };

  const register = async (formData) => {
    const response = await registerUser(formData);

    if (response.data.message?.toLowerCase().includes("exists")) {
      throw new Error(response.data.message);
    }

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
