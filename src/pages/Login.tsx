import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { ApiError, authService, authStorage } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      authStorage.save(data);
      navigate('/admin');
    } catch (err) {
      if (err instanceof ApiError) {
        // 422 -> erros de validação / credenciais inválidas vindos do Laravel
        const firstFieldError = Object.values(err.errors)[0]?.[0];
        setError(firstFieldError ?? err.message);
      } else {
        setError('Não foi possível conectar ao servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0f172a]">
      {/* Lado Esquerdo - Branding / Identidade Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] flex-col justify-between p-12 text-white border-r border-zinc-800 relative overflow-hidden">
        {/* Efeito de iluminação sutil verde */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Coturnos & Cia
          </h1>
          <p className="text-emerald-500 text-sm font-medium tracking-wide mt-1">
            PAINEL ADMINISTRATIVO
          </p>
        </div>

        <div className="z-10 max-w-md space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-2 border border-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-100">
            Gestão integrada da sua loja de calçados.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Acesse o sistema para gerenciar produtos, pedidos, usuários e acompanhar todas as métricas em tempo real.
          </p>
        </div>

        <div className="z-10 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Coturnos & Cia. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80">
          {/* Cabeçalho mobile/form */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Acessar a conta
            </h2>
            <p className="text-sm text-slate-500">
              Informe suas credenciais para entrar no painel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mensagem de erro */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Campo de E-mail */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@coturnosecia.com.br"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  Senha
                </label>
                <a href="#recuperar" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors disabled:opacity-60"
                />
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}