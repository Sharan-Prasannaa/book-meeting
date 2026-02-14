import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);
  
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);


  // Login function to authenticate user
  const login = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/profile"); // redirect after login
    } catch (error) {
      throw error; // ensures frontend catch works
    }
  };

  // Signup function to register new user
  const signup = async (data) => {
    return await api.post("/auth/signup", data);
  };

  // Logout function to logout user
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // no manual headers needed as axios handles it
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
