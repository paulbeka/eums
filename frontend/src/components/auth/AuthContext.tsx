import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../Config";

interface AuthContextType {
  isAuthenticated: boolean | null;
  isAdmin: boolean;
  userId: string | null;
  setAuthStatus: (status: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    const decoded: { roles?: string[], sub?: string } = jwtDecode(token);
    
    setIsAuthenticated(true);
    setIsAdmin(decoded.roles?.includes("admin") ?? false);
    setUserId(decoded.sub ?? null);
  };

  // Function to check if token is about to expire (within 2 minutes)
  const isTokenExpiringSoon = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      return decoded.exp * 1000 - Date.now() < 2 * 60 * 1000; // Less than 2 mins remaining
    } catch {
      return true; // Treat invalid tokens as expired
    }
  };

  // Function to refresh the token
  const refreshAuthToken = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/refresh-token`, {}, { withCredentials: true });
  
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        return response.data.access_token;
      } 
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null);
  };

  // Function to check token and refresh if needed
  const verifyToken = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      logout();
      return;
    }

    if (isTokenExpiringSoon(token)) {
      const newToken = await refreshAuthToken();
      if (!newToken) return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      if (response.data.status === "valid") {
        const decoded: { roles?: string[]; sub?: string } = jwtDecode(localStorage.getItem("access_token")!);
        setIsAuthenticated(true);
        setIsAdmin(decoded.roles?.includes("admin") ?? false);
        setUserId(decoded.sub ?? null);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    }
  };

  // Effect to check and refresh token periodically
  useEffect(() => {
    verifyToken();
    const interval = setInterval(verifyToken, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Effect to refresh token when user refocuses the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        verifyToken();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId, setAuthStatus: setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export type { AuthContextType };
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
