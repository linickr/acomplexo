import { BrowserRouter } from "react-router-dom";
import AdminRouter from "./admin/AdminRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AdminRouter />
    </BrowserRouter>
  );
}