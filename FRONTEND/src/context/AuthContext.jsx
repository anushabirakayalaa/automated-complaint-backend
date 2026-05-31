import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authService";

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
    const receivedRefreshToken = response.data.refreshToken;
    const decodedUser = decodeToken(receivedToken);

    if (!receivedToken || !decodedUser) {
      throw new Error("Login failed: invalid server response");
    }

    localStorage.setItem("token", receivedToken);
    if (receivedRefreshToken) {
      localStorage.setItem("refreshToken", receivedRefreshToken);
    }
    setToken(receivedToken);
    setUser(decodedUser);
    return decodedUser;
  };

  const register = async (formData) => {
    const response = await registerUser(formData);
    return response.data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Server-side logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "ADMIN" || user?.role === "SUPPORT_AGENT",
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
