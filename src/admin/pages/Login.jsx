import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Meu Site";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f5f5f3", fontFamily: "system-ui",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, border: "0.5px solid #e0e0db",
        padding: "40px 36px", width: 360,
      }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#111" }}>{SITE_NAME}</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Painel administrativo</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com"
              style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #ccc", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #ccc", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          {error && (
            <div style={{ background: "#fff0f0", border: "0.5px solid #fcc", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#c00", marginBottom: 14 }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "inherit" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}