import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminRouter from "./admin/AdminRouter";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}