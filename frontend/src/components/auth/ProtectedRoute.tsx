import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../frontend_util/Loading";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  element: ReactElement;
}

function ProtectedRoute({ element: Component }: ProtectedRouteProps): ReactElement {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return isAuthenticated ? Component : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
