import { Routes, Route, Navigate } from "react-router-dom";
import Home_admin from "./pages/Home_admin";
import Produtos_Catalogo from "./pages/Produtos_Catalogo";
import UsuariosGestao from "./pages/UsuariosGestao";
import LogEventos from "./pages/LogEventos";
import { EdicaoImagens } from "./pages/Edicao_Imagens";
import Pedidos_Listagem from "./pages/Pedidos_Listagem";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Rota pública de login */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* Redirecionamento da raiz */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Rotas protegidas: só entram com token no localStorage */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Home_admin />} />
        <Route path="/admin/produtos" element={<Produtos_Catalogo />} />
        <Route path="/admin/pedidos" element={<Pedidos_Listagem />} />
        <Route path="/admin/usuarios" element={<UsuariosGestao />} />
        <Route path="/admin/imagens" element={<EdicaoImagens />} />
        <Route path="/admin/logs" element={<LogEventos />} />
      </Route>

      {/* Fallback para páginas não encontradas */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-800">
            <p className="text-lg font-medium">
              Página não encontrada ou em desenvolvimento.
            </p>
          </div>
        }
      />
    </Routes>
  );
}