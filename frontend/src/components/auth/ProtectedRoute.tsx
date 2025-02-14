import { useState, useEffect, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { BASE_URL } from '../../Config';
import axios from "axios";
import Loading from "../frontend_util/Loading";

interface ProtectedRouteProps {
  element: ReactElement;
}

function ProtectedRoute({ element: Component }: ProtectedRouteProps): ReactElement {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/verify-token`, {
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
    return <Loading />;
  }

  return isValid ? Component : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
