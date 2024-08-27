"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Function to check if user is authenticated
  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/checkSession");
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    // Implement login logic
    const response = await axios.post("/api/auth/login", credentials);
    if (response.data.user) {
      setUser(response.data.user);
      router.push("/dashboard"); // Redirect to a protected route
    }
  };

  const logout = async () => {
    // Implement logout logic
    await axios.post("/api/auth/logout");
    setUser(null);
    router.push("/login"); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
