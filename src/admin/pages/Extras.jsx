export function Analytics() {
  const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: "0 0 8px" }}>Google Analytics</h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Dados de tráfego do seu site</p>
      {GA_ID ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 24 }}>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>Conectado ao GA4: <strong>{GA_ID}</strong></p>
          <a href={`https://analytics.google.com`} target="_blank" rel="noreferrer"
            style={{ display: "inline-block", padding: "8px 16px", background: "#111", color: "#fff", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
            Abrir Google Analytics →
          </a>
        </div>
      ) : (
        <div style={{ background: "#fffbeb", border: "0.5px solid #fde68a", borderRadius: 12, padding: 24 }}>
          <p style={{ fontSize: 14, color: "#92400e" }}>Configure <strong>VITE_GA_MEASUREMENT_ID</strong> no arquivo <code>.env</code></p>
        </div>
      )}
    </div>
  );
}

export function SEO() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: "0 0 8px" }}>Search Console</h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Desempenho no Google Search</p>
      <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 24 }}>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>Acesse diretamente o Search Console para ver seus dados de SEO.</p>
        <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer"
          style={{ display: "inline-block", padding: "8px 16px", background: "#111", color: "#fff", borderRadius: 8, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
          Abrir Search Console →
        </a>
      </div>
    </div>
  );
}

export function Media() {
  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: "0 0 8px" }}>Biblioteca de Mídia</h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Imagens e arquivos do site</p>
      <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e8e8e4", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
        <p style={{ fontSize: 14, color: "#555" }}>Upload de arquivos disponível no editor de posts.</p>
      </div>
    </div>
  );
}