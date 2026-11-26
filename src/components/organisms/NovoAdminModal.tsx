import React, { useState } from "react";
import { X, ShieldCheck, Key, Eye, EyeOff } from "lucide-react";

export interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
}

export interface NovoAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdminData) => Promise<void> | void;
  loading?: boolean;
}

function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (let t = 9; t < 11; t++) {
    let sum = 0;
    for (let c = 0; c < t; c++) {
      sum += Number(cpf[c]) * (t + 1 - c);
    }
    const digit = ((10 * sum) % 11) % 10;
    if (Number(cpf[t]) !== digit) return false;
  }
  return true;
}

function isValidStrongPassword(password: string): string | null {
  if (password.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
  if (password.length > 128) return "A senha não pode ter mais de 128 caracteres.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return "A senha deve conter letras maiúsculas e minúsculas.";
  }
  if (!/[^a-zA-Z0-9\s]/.test(password)) {
    return "A senha deve conter pelo menos um símbolo (ex: !@#$%&*).";
  }
  return null;
}

export const NovoAdminModal: React.FC<NovoAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateAdminData>({
    firstName: "",
    lastName: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const gerarSenhaAutomatica = () => {
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const nums = "23456789";
    const symbols = "!@#$%&*";
    const all = lower + upper + nums + symbols;

    // Garante pelo menos 1 de cada categoria exigida pela regra forte
    const chars = [
      lower[Math.floor(Math.random() * lower.length)],
      upper[Math.floor(Math.random() * upper.length)],
      nums[Math.floor(Math.random() * nums.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    for (let i = chars.length; i < 12; i++) {
      chars.push(all[Math.floor(Math.random() * all.length)]);
    }

    // Embaralha os caracteres
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    setFormData((prev) => ({ ...prev, password: chars.join("") }));
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg("Informe o nome e o sobrenome.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Informe um e-mail válido.");
      return;
    }

    if (!formData.cpf.trim()) {
      setErrorMsg("O CPF é obrigatório.");
      return;
    }

    if (!isValidCpf(formData.cpf)) {
      setErrorMsg("Informe um CPF válido (11 dígitos e dígitos verificadores válidos).");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits || (phoneDigits.length !== 10 && phoneDigits.length !== 11)) {
      setErrorMsg("Informe um telefone válido com DDD (ex: (11) 98765-4321).");
      return;
    }

    const passwordError = isValidStrongPassword(formData.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return;
    }

    onSubmit({
      ...formData,
      email: formData.email.trim().toLowerCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Novo Administrador</h3>
              <p className="text-xs text-slate-500">Cadastre um usuário com acesso ao painel de gestão</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nome *</label>
              <input
                type="text"
                required
                maxLength={60}
                placeholder="Ex: Carlos"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Sobrenome *</label>
              <input
                type="text"
                required
                maxLength={60}
                placeholder="Ex: Souza"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">E-mail de Login *</label>
            <input
              type="email"
              required
              maxLength={191}
              placeholder="exemplo@coturnosecia.com.br"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">CPF *</label>
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCpf(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Telefone *</label>
              <input
                type="text"
                required
                placeholder="(11) 90000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Senha de Acesso *</label>
              <button
                type="button"
                onClick={gerarSenhaAutomatica}
                className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" /> Gerar senha automática
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Mín. 8 caracteres (Aa + símbolo)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Mínimo 8 caracteres, com letra maiúscula, minúscula e símbolo.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Cadastrando..." : "Cadastrar Administrador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoAdminModal;
