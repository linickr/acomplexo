import { useState, useRef } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";

/* ─── shared styles ─── */
const card = { background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4" };
const label = { fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 };

/* ════════════════════════════════════════════════
   ANALYTICS
════════════════════════════════════════════════ */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const WEEKLY = [248, 312, 287, 356, 401, 378, 445];
const WEEK_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const SOURCES = [
  { label: "Orgânico", pct: 52, color: "#2563eb" },
  { label: "Direto",   pct: 28, color: "#16a34a" },
  { label: "Referência", pct: 12, color: "#d97706" },
  { label: "Social",   pct:  8, color: "#7c3aed" },
];
const TOP_PAGES_GA = [
  { page: "/",                                title: "Página inicial",            views: 1234, time: "1m 42s" },
  { page: "/blog/portao-automatico-vila-velha", title: "Portão automático VV",    views:  456, time: "3m 18s" },
  { page: "/servicos",                          title: "Serviços",                views:  389, time: "2m 05s" },
  { page: "/contato",                           title: "Contato",                 views:  321, time: "0m 58s" },
  { page: "/blog/grades-de-protecao",           title: "Grades de proteção",      views:  287, time: "2m 47s" },
];

export function Analytics() {
  const maxW = Math.max(...WEEKLY);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Google Analytics</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Últimos 30 dias · dados demonstrativos</p>
        </div>
        {GA_ID && (
          <a href="https://analytics.google.com" target="_blank" rel="noreferrer"
            style={{ padding: "7px 16px", background: "#111", color: "#fff", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
            Abrir GA4 →
          </a>
        )}
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Sessões",       value: "2 427",  delta: "+14%",  up: true  },
          { label: "Usuários",      value: "1 893",  delta: "+9%",   up: true  },
          { label: "Pageviews",     value: "6 712",  delta: "+21%",  up: true  },
          { label: "Taxa de rejeição", value: "48%", delta: "-3pp",  up: true  },
        ].map(m => (
          <div key={m.label} style={{ ...card, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#111", lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: m.up ? "#16a34a" : "#dc2626", marginTop: 6, fontWeight: 500 }}>{m.delta} vs mês anterior</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 16, marginBottom: 16 }}>
        {/* Bar chart */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 16 }}>Sessões — últimos 7 dias</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {WEEKLY.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, color: "#bbb" }}>{v}</div>
                <div style={{ width: "100%", background: "#2563eb", borderRadius: "4px 4px 0 0", height: `${(v / maxW) * 90}px`, transition: "height .3s" }} />
                <div style={{ fontSize: 10, color: "#aaa" }}>{WEEK_LABELS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 16 }}>Fontes de tráfego</div>
          {SOURCES.map(s => (
            <div key={s.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#555" }}>{s.label}</span>
                <span style={{ fontWeight: 600, color: "#111" }}>{s.pct}%</span>
              </div>
              <div style={{ background: "#f0f0ec", borderRadius: 99, height: 6 }}>
                <div style={{ background: s.color, borderRadius: 99, height: 6, width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top pages */}
      <div style={{ ...card }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #f0f0ec", fontSize: 13, fontWeight: 600, color: "#111" }}>Páginas mais visitadas</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>{["Página", "Visualizações", "Tempo médio"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 20px", fontSize: 11, fontWeight: 600, color: "#bbb", textTransform: "uppercase", borderBottom: "0.5px solid #f0f0ec" }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {TOP_PAGES_GA.map(p => (
              <tr key={p.page}>
                <td style={{ padding: "10px 20px", borderBottom: "0.5px solid #f8f8f6" }}>
                  <div style={{ fontWeight: 500, color: "#111" }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{p.page}</div>
                </td>
                <td style={{ padding: "10px 20px", borderBottom: "0.5px solid #f8f8f6", color: "#555" }}>{p.views.toLocaleString("pt-BR")}</td>
                <td style={{ padding: "10px 20px", borderBottom: "0.5px solid #f8f8f6", color: "#555" }}>{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!GA_ID && (
        <div style={{ background: "#fffbeb", border: "0.5px solid #fde68a", borderRadius: 12, padding: 16, marginTop: 16, fontSize: 13, color: "#92400e" }}>
          Configure <code style={{ background: "#fef3c7", padding: "1px 5px", borderRadius: 4 }}>VITE_GA_MEASUREMENT_ID</code> no <code>.env</code> para conectar ao GA4 real.
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   SEO / SEARCH CONSOLE
════════════════════════════════════════════════ */
const PERF_30D = [12,18,14,22,31,28,35,42,38,45,51,48,60,55,58,62,70,67,73,68,75,80,77,84,90,86,93,88,96,102];
const TOP_QUERIES = [
  { query: "portão automático Vila Velha",       pos: 4.2, clicks: 312, impr: 2840, ctr: "11.0%" },
  { query: "serralheria Vila Velha ES",           pos: 7.8, clicks: 189, impr: 3210, ctr: "5.9%"  },
  { query: "grades de proteção Vila Velha",       pos: 5.1, clicks: 143, impr: 1870, ctr: "7.6%"  },
  { query: "quanto custa portão automático",      pos: 9.4, clicks:  98, impr: 2150, ctr: "4.6%"  },
  { query: "serralheria Cobilândia",              pos: 3.1, clicks:  87, impr:  940, ctr: "9.3%"  },
  { query: "estrutura metálica Vila Velha",       pos:12.3, clicks:  54, impr: 1340, ctr: "4.0%"  },
  { query: "manutenção portão automático",        pos: 8.7, clicks:  48, impr: 1120, ctr: "4.3%"  },
];
const TOP_PAGES_GSC = [
  { url: "/",                                  clicks: 387, impr: 4210, pos: 6.1 },
  { url: "/blog/portao-automatico-vila-velha", clicks: 312, impr: 2840, pos: 4.2 },
  { url: "/servicos",                          clicks: 198, impr: 2130, pos: 7.4 },
  { url: "/blog/grades-de-protecao",           clicks: 143, impr: 1870, pos: 5.1 },
  { url: "/contato",                           clicks:  89, impr:  980, pos: 9.8 },
];

export function SEO() {
  const maxPerf = Math.max(...PERF_30D);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Search Console</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Últimos 30 dias · dados demonstrativos</p>
        </div>
        <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer"
          style={{ padding: "7px 16px", background: "#111", color: "#fff", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
          Abrir GSC →
        </a>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Cliques",          value: "847",   delta: "+18%",  up: true  },
          { label: "Impressões",       value: "12.450", delta: "+24%",  up: true  },
          { label: "CTR médio",        value: "6.8%",  delta: "+0.4pp", up: true },
          { label: "Posição média",    value: "11.4",  delta: "-1.2",  up: true  },
        ].map(m => (
          <div key={m.label} style={{ ...card, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: "#111", lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 12, color: "#16a34a", marginTop: 6, fontWeight: 500 }}>{m.delta} vs período anterior</div>
          </div>
        ))}
      </div>

      {/* Perf chart */}
      <div style={{ ...card, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 16 }}>Cliques — últimos 30 dias</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
          {PERF_30D.map((v, i) => (
            <div key={i} title={`Dia ${i+1}: ${v} cliques`}
              style={{ flex: 1, background: "#2563eb", borderRadius: "2px 2px 0 0", height: `${(v / maxPerf) * 76}px`, opacity: .75 + (i / PERF_30D.length) * .25, cursor: "default" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#bbb", marginTop: 6 }}>
          <span>1 abr</span><span>15 abr</span><span>30 abr</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Top queries */}
        <div style={{ ...card }}>
          <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f0f0ec", fontSize: 13, fontWeight: 600, color: "#111" }}>Principais consultas</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{["Consulta","Posição","Cliques","Impr."].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "7px 14px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", borderBottom: "0.5px solid #f0f0ec" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {TOP_QUERIES.map(q => (
                <tr key={q.query}>
                  <td style={{ padding: "9px 14px", borderBottom: "0.5px solid #f8f8f6", color: "#111", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.query}</td>
                  <td style={{ padding: "9px 14px", borderBottom: "0.5px solid #f8f8f6" }}>
                    <span style={{ background: q.pos <= 5 ? "#f0fdf4" : q.pos <= 10 ? "#fffbeb" : "#fff5f5", color: q.pos <= 5 ? "#16a34a" : q.pos <= 10 ? "#d97706" : "#dc2626", padding: "2px 7px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{q.pos}</span>
                  </td>
                  <td style={{ padding: "9px 14px", borderBottom: "0.5px solid #f8f8f6", color: "#555" }}>{q.clicks}</td>
                  <td style={{ padding: "9px 14px", borderBottom: "0.5px solid #f8f8f6", color: "#aaa" }}>{q.impr.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top pages */}
        <div style={{ ...card }}>
          <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f0f0ec", fontSize: 13, fontWeight: 600, color: "#111" }}>Páginas com mais cliques</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>{["URL","Cliques","Posição"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "7px 14px", fontSize: 10, fontWeight: 600, color: "#bbb", textTransform: "uppercase", borderBottom: "0.5px solid #f0f0ec" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {TOP_PAGES_GSC.map(p => (
                <tr key={p.url}>
                  <td style={{ padding: "9px 14px", borderBottom: "0.5px solid #f8f8f6", color: "#2563eb", fontSize: 11, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.url}</td>
                  <td style={{ padding: "9px 14px", borderBottom: "0.5px solid #f8f8f6", color: "#555" }}>{p.clicks}</td>
                  <td style={{ padding: "9px 14px", borderBottom: "0.5px solid #f8f8f6" }}>
                    <span style={{ background: p.pos <= 5 ? "#f0fdf4" : "#fffbeb", color: p.pos <= 5 ? "#16a34a" : "#d97706", padding: "2px 7px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{p.pos}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recomendações */}
      <div style={{ ...card, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 14 }}>Recomendações SEO</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { ok: true,  text: "sitemap.xml enviado e indexado" },
            { ok: true,  text: "robots.txt configurado corretamente" },
            { ok: true,  text: "3 posts publicados com schema Article" },
            { ok: false, text: "Melhorar CTR: adicionar datas e números nos títulos" },
            { ok: false, text: "Subir posição de 'estrutura metálica Vila Velha' (pos. 12.3) — adicionar conteúdo mais longo" },
            { ok: false, text: "Criar post sobre 'manutenção portão automático' para palavra-chave agendada" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: r.ok ? "#555" : "#7c2d12" }}>
              <span style={{ flexShrink: 0, fontSize: 14 }}>{r.ok ? "✓" : "○"}</span>
              <span style={{ color: r.ok ? "#555" : "#111" }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MÍDIA
════════════════════════════════════════════════ */
const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function Media() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);
  const [drag, setDrag]         = useState(false);
  const inputRef = useRef();

  async function loadMedia() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "media"));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadMedia(); }, []);

  async function uploadFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      let url = "";
      if (CLOUD_NAME && UPLOAD_PRESET) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
        const data = await res.json();
        url = data.secure_url;
      } else {
        url = URL.createObjectURL(file);
      }
      await addDoc(collection(db, "media"), {
        name: file.name, url, size: file.size,
        type: file.type, createdAt: serverTimestamp(),
      });
      await loadMedia();
    } catch (e) { console.error(e); }
    finally { setUploading(false); }
  }

  async function handleDelete(item) {
    if (!confirm(`Remover "${item.name}"?`)) return;
    await deleteDoc(doc(db, "media", item.id));
    if (selected?.id === item.id) setSelected(null);
    await loadMedia();
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url).then(() => alert("URL copiada!"));
  }

  function onDrop(e) {
    e.preventDefault(); setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  const fmt = (bytes) => bytes < 1024*1024 ? `${(bytes/1024).toFixed(0)} KB` : `${(bytes/1024/1024).toFixed(1)} MB`;
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const totalSize = items.reduce((acc, i) => acc + (i.size || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Biblioteca de Mídia</h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{items.length} arquivos · {fmt(totalSize)} total</p>
        </div>
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          style={{ padding: "7px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", opacity: uploading ? .6 : 1 }}>
          {uploading ? "Enviando..." : "+ Upload"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => uploadFile(e.target.files[0])} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${drag ? "#2563eb" : "#ddd"}`,
          borderRadius: 12, padding: "28px 20px", textAlign: "center",
          cursor: "pointer", marginBottom: 20,
          background: drag ? "#eff6ff" : "#fafafa",
          transition: "all .2s",
        }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>📁</div>
        <div style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>Arraste imagens aqui ou clique para selecionar</div>
        <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>PNG, JPG, WEBP, GIF · máx. 10 MB</div>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar por nome..."
        style={{ width: "100%", padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box", outline: "none" }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 13 }}>Carregando...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 13 }}>
          {items.length === 0 ? "Nenhum arquivo ainda. Faça o primeiro upload acima." : "Nenhum resultado para esta busca."}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {filtered.map(item => (
            <div key={item.id}
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
              style={{
                ...card, overflow: "hidden", cursor: "pointer",
                outline: selected?.id === item.id ? "2px solid #2563eb" : "none",
                transition: "outline .15s",
              }}>
              <div style={{ height: 110, background: "#f5f5f3", overflow: "hidden" }}>
                <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 2 }}>{item.size ? fmt(item.size) : "—"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side panel */}
      {selected && (
        <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 280, background: "#fff", borderLeft: "0.5px solid #e8e8e4", padding: 20, zIndex: 20, overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Detalhes</div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#aaa", padding: 0 }}>×</button>
          </div>
          <img src={selected.url} alt={selected.name} style={{ width: "100%", borderRadius: 8, marginBottom: 14, border: "0.5px solid #e8e8e4" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
            {[
              { l: "Nome",    v: selected.name },
              { l: "Tamanho", v: selected.size ? fmt(selected.size) : "—" },
              { l: "Tipo",    v: selected.type || "—" },
              { l: "Data",    v: selected.createdAt?.toDate?.().toLocaleDateString("pt-BR") || "—" },
            ].map(r => (
              <div key={r.l}>
                <div style={{ color: "#aaa", marginBottom: 2 }}>{r.l}</div>
                <div style={{ color: "#111", wordBreak: "break-all" }}>{r.v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, background: "#f5f5f3", borderRadius: 8, padding: 10, fontSize: 11, color: "#555", wordBreak: "break-all", userSelect: "all" }}>{selected.url}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => copyUrl(selected.url)}
              style={{ flex: 1, padding: "8px", border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Copiar URL</button>
            <button onClick={() => handleDelete(selected)}
              style={{ padding: "8px 12px", border: "0.5px solid #fcc", borderRadius: 8, background: "#fff", fontSize: 12, color: "#c00", cursor: "pointer", fontFamily: "inherit" }}>Excluir</button>
          </div>
        </div>
      )}
    </div>
  );
}
