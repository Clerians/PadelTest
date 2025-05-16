import { Navigate } from "react-router-dom";
//import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
