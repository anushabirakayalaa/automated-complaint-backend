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
    const responseData = response.data;
    const receivedToken = responseData?.token;
    const receivedRefreshToken = responseData?.refreshToken;
    const decodedUser = decodeToken(receivedToken);

    if (!receivedToken || !decodedUser) {
      const serverMessage =
        typeof responseData === "string"
          ? "API returned a web page instead of login data. Check VITE_API_BASE_URL."
          : responseData?.message;
      throw new Error(serverMessage || "Login failed: server did not return a valid token");
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
