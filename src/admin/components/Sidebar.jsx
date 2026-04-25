import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SITE_NAME = import.meta.env.VITE_SITE_NAME || "Meu Site";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "⊞", exact: true },
  { section: "Analytics" },
  { to: "/admin/analytics", label: "Google Analytics", icon: "↗" },
  { to: "/admin/seo", label: "Search Console", icon: "◎" },
  { section: "Conteúdo" },
  { to: "/admin/posts", label: "Posts do Blog", icon: "≡" },
  { to: "/admin/posts/new", label: "Novo Post", icon: "✏" },
  { to: "/admin/media", label: "Mídia", icon: "⊡" },
  { section: "Admin" },
  { to: "/admin/users", label: "Usuários", icon: "◉" },
  { to: "/admin/settings", label: "Configurações", icon: "⚙" },
];

const linkStyle = (isActive) => ({
  display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
  margin: "1px 8px", borderRadius: 7, fontSize: 13, textDecoration: "none",
  cursor: "pointer", border: "none", background: isActive ? "#eef4ff" : "none",
  color: isActive ? "#2563eb" : "#555", fontWeight: isActive ? 500 : 400,
  width: "calc(100% - 16px)", fontFamily: "inherit", transition: "background .15s",
});

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() || "AD";

  return (
    <aside style={{
      width: 220, background: "#fff", borderRight: "0.5px solid #e8e8e4",
      display: "flex", flexDirection: "column", position: "fixed",
      top: 0, left: 0, height: "100vh", zIndex: 10,
    }}>
      <div style={{ padding: "20px 16px 16px", borderBottom: "0.5px solid #e8e8e4" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>{SITE_NAME}</div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Painel de controle</div>
      </div>
      <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
        {navItems.map((item, i) => {
          if (item.section) return (
            <div key={i} style={{
              padding: "12px 20px 4px", fontSize: 10, fontWeight: 600,
              color: "#bbb", textTransform: "uppercase", letterSpacing: ".08em"
            }}>
              {item.section}
            </div>
          );
          return (
            <NavLink
              key={item.to} to={item.to} end={item.exact}
              style={({ isActive }) => linkStyle(isActive)}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div style={{
        padding: "12px 16px", borderTop: "0.5px solid #e8e8e4",
        display: "flex", alignItems: "center", gap: 10
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%", background: "#eef4ff",
          color: "#2563eb", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.email}
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>Admin</div>
        </div>
        <button onClick={handleLogout} title="Sair" style={{
          background: "none", border: "none", cursor: "pointer", fontSize: 14,
          color: "#bbb", padding: 4, borderRadius: 4
        }}>⏻</button>
      </div>
    </aside>
  );
}