import { useState, useEffect, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface ProtectedRouteProps {
  element: ReactElement;
}

function ProtectedRoute({ element: Component }: ProtectedRouteProps): ReactElement {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsValid(response.data.status === "valid");
      } catch (error) {
        setIsValid(false);
        console.error("Token verification failed:", error);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
    return <div>Loading...</div>;
  }

  return isValid ? Component : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
