import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CATEGORIES = ["Geral", "Notícias", "Blog", "Serviços", "Dicas", "Sobre"];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Geral");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      getDoc(doc(db, "posts", id)).then(snap => {
        if (snap.exists()) {
          const d = snap.data();
          setTitle(d.title || ""); setContent(d.content || "");
          setCategory(d.category || "Geral"); setStatus(d.status || "draft");
          setTags(d.tags || []); setSeoDesc(d.seoDesc || ""); setCoverUrl(d.coverUrl || "");
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  async function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      setCoverUrl(data.secure_url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(overrideStatus) {
    setSaving(true);
    const data = { title, content, category, status: overrideStatus || status, tags, seoDesc, coverUrl, updatedAt: serverTimestamp() };
    try {
      if (isNew) {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, "posts"), data);
      } else {
        await setDoc(doc(db, "posts", id), data, { merge: true });
      }
      navigate("/admin/posts");
    } finally {
      setSaving(false);
    }
  }

  function addTag(e) {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  }

  const inputStyle = { width: "100%", padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "#fff", boxSizing: "border-box", outline: "none" };
  const labelStyle = { fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 };

  if (loading) return <div style={{ padding: 40, color: "#aaa" }}>Carregando...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>{isNew ? "Novo post" : "Editar post"}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handleSave("draft")} disabled={saving} style={{ padding: "7px 16px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Salvar rascunho</button>
          <button onClick={() => handleSave("published")} disabled={saving} style={{ padding: "7px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>{saving ? "Salvando..." : "Publicar"}</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título do post..."
            style={{ ...inputStyle, fontSize: 20, fontWeight: 600, padding: "12px 14px", borderRadius: 10 }} />
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 4, padding: "8px 12px", borderBottom: "0.5px solid #f0f0ec", flexWrap: "wrap" }}>
              {["N","It","S","H1","H2","Lista","Link","Imagem"].map(t => (
                <button key={t} style={{ padding: "3px 8px", fontSize: 12, border: "0.5px solid #e0e0e0", borderRadius: 5, background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
              ))}
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Escreva o conteúdo do post aqui..."
              style={{ width: "100%", minHeight: 340, padding: 16, border: "none", resize: "vertical", fontSize: 14, lineHeight: 1.7, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 14 }}>Publicação</div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="scheduled">Agendado</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 14 }}>Imagem de capa</div>
            {coverUrl ? (
              <div>
                <img src={coverUrl} alt="Capa" style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />
                <button onClick={() => setCoverUrl("")} style={{ width: "100%", padding: "6px", border: "0.5px solid #fcc", borderRadius: 7, color: "#c00", background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Remover</button>
              </div>
            ) : (
              <label style={{ display: "block", border: "1.5px dashed #ddd", borderRadius: 10, padding: "24px 12px", textAlign: "center", cursor: "pointer", fontSize: 13, color: "#aaa" }}>
                {uploading ? "Enviando..." : "📁 Clique para enviar"}
                <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} />
              </label>
            )}
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 14 }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, border: "0.5px solid #ddd", borderRadius: 8, padding: 8, minHeight: 40 }}>
              {tags.map(t => (
                <span key={t} style={{ background: "#f0f0ec", borderRadius: 5, padding: "2px 8px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  {t}<span onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ cursor: "pointer", opacity: .5 }}>×</span>
                </span>
              ))}
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Digite e pressione Enter"
                style={{ border: "none", outline: "none", fontSize: 12, fontFamily: "inherit", flex: 1, minWidth: 80 }} />
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 14 }}>SEO</div>
            <label style={labelStyle}>Meta descrição</label>
            <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} placeholder="Descrição para o Google..."
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} />
            <div style={{ fontSize: 11, color: seoDesc.length > 160 ? "#c00" : "#aaa", marginTop: 4 }}>{seoDesc.length}/160 caracteres</div>
          </div>
        </div>
      </div>
    </div>
  );
}