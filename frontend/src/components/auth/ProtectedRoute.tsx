import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../frontend_util/Loading";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  element: ReactElement;
  adminOnly?: boolean;
}

function ProtectedRoute({ element: Component, adminOnly }: ProtectedRouteProps): ReactElement {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated === null) {
    return <Loading />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return isAuthenticated ? Component : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
