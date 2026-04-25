import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7f5", fontFamily: "'DM Sans', system-ui" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: 28, minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}