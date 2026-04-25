import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    await deleteDoc(doc(db, "posts", id));
    load();
  }

  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);
  const statusColor = (s) =>
    s === "published" ? { bg: "#f0fdf4", color: "#16a34a" }
    : s === "draft" ? { bg: "#fffbeb", color: "#d97706" }
    : { bg: "#eff6ff", color: "#2563eb" };
  const statusLabel = (s) =>
    s === "published" ? "Publicado" : s === "draft" ? "Rascunho" : "Agendado";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Posts do Blog</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{posts.length} posts no total</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: "7px 12px", border: "0.5px solid #ccc", borderRadius: 8, fontSize: 13, background: "#fff", fontFamily: "inherit" }}>
            <option value="all">Todos</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="scheduled">Agendados</option>
          </select>
          <button onClick={() => navigate("/admin/posts/new")}
            style={{ padding: "7px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            + Novo post
          </button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4" }}>
        {loading ? (
          <div style={{ padding: 24, fontSize: 13, color: "#aaa" }}>Carregando posts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 24, fontSize: 13, color: "#aaa" }}>Nenhum post encontrado.</div>
        ) : filtered.map((post, i) => {
          const sc = statusColor(post.status);
          return (
            <div key={post.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < filtered.length - 1 ? "0.5px solid #f0f0ec" : "none" }}>
              <div style={{ width: 48, height: 36, background: "#f5f5f3", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{post.category || "Sem categoria"} · {post.createdAt?.toDate?.().toLocaleDateString("pt-BR") || "—"}</div>
              </div>
              <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 20, flexShrink: 0 }}>{statusLabel(post.status)}</span>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => navigate(`/admin/posts/${post.id}`)}
                  style={{ padding: "5px 12px", border: "0.5px solid #ddd", borderRadius: 7, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Editar</button>
                <button onClick={() => handleDelete(post.id)}
                  style={{ padding: "5px 12px", border: "0.5px solid #fcc", borderRadius: 7, background: "#fff", fontSize: 12, color: "#c00", cursor: "pointer", fontFamily: "inherit" }}>Excluir</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}