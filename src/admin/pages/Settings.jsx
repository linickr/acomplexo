import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: "", siteUrl: "", siteDescription: "",
    gaId: "", gscVerification: "", fbPixel: "",
    metaTitle: "", metaDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "config", "settings")).then(snap => {
      if (snap.exists()) setSettings(prev => ({ ...prev, ...snap.data() }));
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await setDoc(doc(db, "config", "settings"), settings, { merge: true });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputStyle = { width: "100%", padding: "8px 10px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "#fff", boxSizing: "border-box", outline: "none" };
  const labelStyle = { fontSize: 12, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 };

  const Section = ({ title, children }) => (
    <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 20, marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );

  const Field = ({ label, valueKey, placeholder, type = "text" }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {type === "textarea" ? (
        <textarea value={settings[valueKey]} onChange={e => setSettings(p => ({ ...p, [valueKey]: e.target.value }))}
          placeholder={placeholder} style={{ ...inputStyle, resize: "vertical", minHeight: 70 }} />
      ) : (
        <input type={type} value={settings[valueKey]} onChange={e => setSettings(p => ({ ...p, [valueKey]: e.target.value }))}
          placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: 0 }}>Configurações</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Configurações globais do site</p>
      </div>
      <form onSubmit={handleSave} style={{ maxWidth: 580 }}>
        <Section title="Informações gerais">
          <Field label="Nome do site" valueKey="siteName" placeholder="Ex: Acomplexo" />
          <Field label="URL do site" valueKey="siteUrl" placeholder="https://seusite.com.br" />
          <Field label="Descrição" valueKey="siteDescription" placeholder="Breve descrição..." type="textarea" />
        </Section>
        <Section title="Integrações Google">
          <Field label="Google Analytics 4 — ID" valueKey="gaId" placeholder="G-XXXXXXXXXX" />
          <Field label="Search Console — Verificação" valueKey="gscVerification" placeholder="Código de verificação" />
          <Field label="Facebook Pixel ID" valueKey="fbPixel" placeholder="000000000000000" />
        </Section>
        <Section title="SEO global">
          <Field label="Meta título padrão" valueKey="metaTitle" placeholder="Nome do Site | Slogan" />
          <Field label="Meta descrição padrão" valueKey="metaDescription" placeholder="Descrição padrão..." type="textarea" />
          <div style={{ fontSize: 11, color: settings.metaDescription.length > 160 ? "#c00" : "#bbb" }}>
            {settings.metaDescription.length}/160 caracteres
          </div>
        </Section>
        <button type="submit" disabled={saving} style={{ padding: "10px 24px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}