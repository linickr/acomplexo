import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase";

const ROLES = ["Administrador", "Editor", "Autor", "Assinante"];
const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Autor", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      await addDoc(collection(db, "users"), { name: form.name, email: form.email, role: form.role, createdAt: serverTimestamp() });
      setShowModal(false);
      setForm({ name: "", email: "", role: "Autor", password: "" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remover este usuário?")) return;
    await deleteDoc(doc(db, "users", id));
    load();
  }

  const initials = (name) => name ? name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "??";
  const colorFor = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Usuários</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{users.length} usuários cadastrados</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: "7px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          + Novo usuário
        </button>
      </div>
      {loading ? <div style={{ color: "#aaa", fontSize: 13 }}>Carregando...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {users.map(user => {
            const color = colorFor(user.name);
            return (
              <div key={user.id} style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: color + "18", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                    {initials(user.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 12 }}>
                  <span>Função: <strong style={{ color: "#111" }}>{user.role}</strong></span>
                  <span>{user.createdAt?.toDate?.().toLocaleDateString("pt-BR") || "—"}</span>
                </div>
                <div style={{ display: "flex", gap: 6, paddingTop: 12, borderTop: "0.5px solid #f0f0ec" }}>
                  <button style={{ flex: 1, padding: "5px", border: "0.5px solid #ddd", borderRadius: 7, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Editar</button>
                  <button onClick={() => handleDelete(user.id)} style={{ padding: "5px 12px", border: "0.5px solid #fcc", borderRadius: 7, background: "#fff", fontSize: 12, color: "#c00", cursor: "pointer", fontFamily: "inherit" }}>Remover</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 420, maxWidth: "calc(100vw - 40px)" }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Novo usuário</div>
            <form onSubmit={handleCreate}>
              {[
                { label: "Nome completo", key: "name", type: "text", placeholder: "Nome do usuário" },
                { label: "E-mail", key: "email", type: "email", placeholder: "email@exemplo.com" },
                { label: "Senha temporária", key: "password", type: "password", placeholder: "••••••••" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} required value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Função</label>
                <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              {error && <div style={{ background: "#fff0f0", border: "0.5px solid #fcc", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#c00", marginBottom: 12 }}>{error}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "8px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: "8px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{saving ? "Criando..." : "Criar usuário"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}