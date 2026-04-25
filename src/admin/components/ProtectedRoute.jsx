import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "system-ui", color: "#888"
      }}>
        Carregando...
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}