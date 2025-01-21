import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../lib/api";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored token and validate it
    const token = localStorage.getItem("token");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  async function validateToken(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.removeItem("token");
      console.error("Token validation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const { token, user: userData } = await response.json();
      localStorage.setItem("token", token);
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }

  async function register(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        throw new Error("Registration failed");
      }

      const { token, user: userData } = await response.json();
      localStorage.setItem("token", token);
      setUser(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
