import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, MoveRight, AlertCircle, Clock } from "lucide-react";
import axios from "axios";
import { api } from "../services/api";

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSessionExpired = searchParams.get("session_expired") === "1";

  // Se o usuário já tiver uma sessão válida salva, redireciona direto para o painel
  useEffect(() => {
    const existingToken = localStorage.getItem("admin_token");
    if (existingToken && !isSessionExpired) {
      api
        .get("/auth/me")
        .then(() => {
          navigate("/admin/produtos", { replace: true });
        })
        .catch(() => {
          // Token salvo era inválido/expirado, limpa do storage
          localStorage.removeItem("admin_token");
        });
    }
  }, [navigate, isSessionExpired]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Por favor, informe e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Extrai o token e a data de expiração da resposta
      const token = response.data?.token || response.data?.data?.token;
      const expiresAt =
        response.data?.expires_at || response.data?.data?.expires_at;

      if (!token) {
        throw new Error("Token não retornado pelo servidor.");
      }

      // Salva no localStorage e segue para o painel
      localStorage.setItem("admin_token", token);
      if (expiresAt) {
        localStorage.setItem("admin_token_expires_at", expiresAt);
      }
      navigate("/admin/produtos", { replace: true });
    } catch (err: unknown) {
      console.error("Erro no login:", err);
      let apiMsg =
        "Credenciais inválidas. Verifique os dados e tente novamente.";
      if (axios.isAxiosError(err)) {
        apiMsg =
          err.response?.data?.message || err.response?.data?.error || apiMsg;
      } else if (err instanceof Error) {
        apiMsg = err.message;
      }
      setErrorMessage(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-black p-8 relative shadow-lg">
        {/* Detalhe de borda dupla no estilo da marca */}
        <div className="absolute top-1 left-1 -z-10 w-full h-full border border-black bg-white pointer-events-none" />

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
            Coturnos & Cia
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            Painel Administrativo
          </p>
        </div>

        {/* Aviso de Sessão Expirada por Inatividade */}
        {isSessionExpired && !errorMessage && (
          <div className="mb-6 p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2.5 rounded">
            <Clock size={18} className="shrink-0 text-amber-600" />
            <span>
              Sua sessão expirou por inatividade. Por favor, acesse novamente
              com suas credenciais.
            </span>
          </div>
        )}

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2 rounded">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dica com Credenciais de Teste */}
        <div className="mb-6 p-3 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded">
          <p className="font-bold text-slate-800 mb-1">
            Credenciais de Teste (Admin):
          </p>
          <p>
            E-mail:{" "}
            <code className="text-black font-semibold">
              admin@coturnosecia.com.br
            </code>
          </p>
          <p>
            Senha: <code className="text-black font-semibold">password</code>
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo E-mail */}
          <div className="flex flex-col gap-1">
            <label
              className="text-[12px] font-extrabold tracking-wide uppercase text-slate-800"
              htmlFor="email"
            >
              E-mail <span className="text-amber-600 font-extrabold">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@coturnosecia.com.br"
              className="border border-gray-400 focus:border-black h-11 px-3 w-full outline-none transition-colors text-sm text-slate-900 bg-white"
            />
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col gap-1">
            <label
              className="text-[12px] font-extrabold tracking-wide uppercase text-slate-800"
              htmlFor="password"
            >
              Senha <span className="text-amber-600 font-extrabold">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-gray-400 focus:border-black h-11 px-3 w-full outline-none transition-colors text-sm text-slate-900 bg-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Botão de Envio no estilo Borda Dupla */}
          <div className="pt-2 relative">
            <div className="absolute top-1 left-1 w-full h-full border border-black pointer-events-none" />
            <button
              type="submit"
              disabled={loading}
              className="relative z-10 w-full font-bold uppercase text-xs sm:text-sm py-3.5 px-5 flex justify-between items-center border border-black bg-black text-white hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Acessando..." : "Entrar no Sistema"}</span>
              <MoveRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
