import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../Config";

interface AuthContextType {
  isAuthenticated: boolean | null;
  isAdmin: boolean;
  userId: string | null;
  setAuthStatus: (status: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true; 
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null);
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || isTokenExpired(token)) {
        logout();
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "valid") {
          setIsAuthenticated(true);
          try {
            const decoded: { roles?: string[]; sub?: string } = jwtDecode(token);
            setIsAdmin(decoded.roles?.includes("admin") ?? false);
            setUserId(decoded.sub ?? null); // Assuming `sub` is the user ID claim
          } catch {
            setIsAdmin(false);
            setUserId(null);
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        logout();
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId, setAuthStatus: setIsAuthenticated, logout }}>
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
