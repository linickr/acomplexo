import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allSnap = await getDocs(collection(db, "posts"));
        setPostsTotal(allSnap.size);
        const recentQ = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(5));
        const recentSnap = await getDocs(recentQ);
        setPosts(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusColor = (s) =>
    s === "published" ? { bg: "#f0fdf4", color: "#16a34a" }
    : s === "draft" ? { bg: "#fffbeb", color: "#d97706" }
    : { bg: "#eff6ff", color: "#2563eb" };

  const statusLabel = (s) =>
    s === "published" ? "Publicado" : s === "draft" ? "Rascunho" : "Agendado";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Visão geral do site</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Posts publicados", value: postsTotal },
          { label: "Sessões (30d)", value: "—" },
          { label: "Usuários únicos", value: "—" },
          { label: "Posição média", value: "—" },
        ].map(m => (
          <div key={m.label} style={{ background: "#f0f0ec", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#111", lineHeight: 1 }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#111", marginBottom: 14 }}>Posts recentes</div>
        {loading ? (
          <div style={{ fontSize: 13, color: "#aaa" }}>Carregando...</div>
        ) : posts.length === 0 ? (
          <div style={{ fontSize: 13, color: "#aaa" }}>Nenhum post ainda.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>{["Título","Categoria","Data","Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 10px", fontSize: 11, fontWeight: 600, color: "#bbb", borderBottom: "0.5px solid #e8e8e4", textTransform: "uppercase" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {posts.map(post => {
                const sc = statusColor(post.status);
                return (
                  <tr key={post.id}>
                    <td style={{ padding: "10px", borderBottom: "0.5px solid #f0f0ec", fontWeight: 500 }}>{post.title}</td>
                    <td style={{ padding: "10px", borderBottom: "0.5px solid #f0f0ec", color: "#888" }}>{post.category || "—"}</td>
                    <td style={{ padding: "10px", borderBottom: "0.5px solid #f0f0ec", color: "#888" }}>{post.createdAt?.toDate?.().toLocaleDateString("pt-BR") || "—"}</td>
                    <td style={{ padding: "10px", borderBottom: "0.5px solid #f0f0ec" }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20 }}>{statusLabel(post.status)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}