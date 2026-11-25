import React, { useState, useEffect } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import SearchInput from '../components/atoms/SearchInput';
import UserTable, { UserItem } from '../components/organisms/UserTable';
import NovoAdminModal, { CreateAdminData } from '../components/organisms/NovoAdminModal';
import { api } from '../services/api';
import { Toast, ToastType } from '../components/molecules/Toast';
import { Users, Shield, UserPlus, RefreshCw, Lock } from 'lucide-react';

export default function UsuariosGestao(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'clientes' | 'administradores'>('clientes');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [savingAdmin, setSavingAdmin] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Informações do administrador logado
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    isSuperAdmin: boolean;
  } | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  // Carrega informações do usuário logado via /auth/me
  const carregarSessao = async () => {
    try {
      const res = await api.get('/auth/me');
      const u = res.data?.data?.usuario || res.data?.data || res.data;
      const isSuper = Boolean(u?.is_super_admin || u?.isSuperAdmin);
      setCurrentUser({
        email: u?.email || '',
        isSuperAdmin: isSuper,
      });
    } catch (err) {
      console.warn('Não foi possível identificar sessão em /auth/me:', err);
    }
  };

  // Carrega lista de usuários da API real
  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/usuarios');
      const list = res.data?.data || [];
      setUsers(list);
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      showToast('Não foi possível carregar a lista de usuários da API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarSessao();
    carregarUsuarios();
  }, []);

  // Alterna status (Ativo/Inativo)
  const handleToggleStatus = async (id: string | number, currentStatus?: string) => {
    const isAtivo = currentStatus?.toLowerCase() === 'ativo';
    const acao = isAtivo ? 'inativar' : 'reativar';

    if (!window.confirm(`Tem certeza que deseja ${acao} este usuário?`)) {
      return;
    }

    try {
      await api.patch(`/admin/usuarios/${id}/toggle-status`);
      showToast(`Status do usuário atualizado com sucesso!`, 'success');
      // Atualiza estado local imediatamente
      setUsers((prev) =>
        prev.map((u) => {
          if (String(u.id) === String(id)) {
            const nextStatus = isAtivo ? 'inativo' : 'ativo';
            return { ...u, status: nextStatus };
          }
          return u;
        })
      );
    } catch (err: any) {
      console.error('Erro ao alterar status:', err);
      const msg = err.response?.data?.message || 'Falha ao alterar status do usuário.';
      showToast(msg, 'error');
    }
  };

  // Cadastro de Novo Administrador
  const handleCreateAdmin = async (data: CreateAdminData) => {
    try {
      setSavingAdmin(true);
      await api.post('/usuarios', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        password: data.password,
        role: 'admin',
        type: 'Administrador',
      });
      showToast('Novo Administrador cadastrado com sucesso!', 'success');
      setIsModalOpen(false);
      await carregarUsuarios();
    } catch (err: any) {
      console.error('Erro ao cadastrar administrador:', err);
      const msg = err.response?.data?.message || 'Falha ao cadastrar administrador.';
      showToast(msg, 'error');
    } finally {
      setSavingAdmin(false);
    }
  };

  // Separação em abas por tipo
  const clientesList = users.filter((u) => {
    const isAdm =
      u.type === 'Administrador' ||
      u.role === 'admin' ||
      u.role === 'Administrador';
    return !isAdm;
  });

  const administradoresList = users.filter((u) => {
    const isAdm =
      u.type === 'Administrador' ||
      u.role === 'admin' ||
      u.role === 'Administrador';
    return isAdm;
  });

  // Lista base da aba ativa
  const currentTabList = activeTab === 'clientes' ? clientesList : administradoresList;

  // Filtro por termo de busca
  const filteredUsers = currentTabList.filter((user) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const cpf = (user.cpf || '').toLowerCase();
    const city = (user.city || '').toLowerCase();
    return (
      fullName.includes(term) ||
      email.includes(term) ||
      cpf.includes(term) ||
      city.includes(term)
    );
  });

  const isSuperAdmin = Boolean(currentUser?.isSuperAdmin);

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      <Sidebar activePage="usuarios" />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header da Página */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
                {isSuperAdmin && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    Modo Super ADM
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                Gerencie clientes da loja e operadores administradores do sistema
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={carregarUsuarios}
                disabled={loading}
                className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                title="Recarregar dados"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {activeTab === 'administradores' && isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Novo Administrador</span>
                </button>
              )}
            </div>
          </div>

          {/* Abas Superiores [ ■ Clientes ] e [ ■■ Administradores ] */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-px">
            <button
              type="button"
              onClick={() => {
                setActiveTab('clientes');
                setSearchTerm('');
              }}
              className={`flex items-center gap-2.5 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'clientes'
                  ? 'border-blue-600 text-blue-600 bg-white/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'clientes'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {clientesList.length}
              </span>
            </button>

            {/* Aba Administradores visível para todos os admins, ou com badge de acesso restrito */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('administradores');
                setSearchTerm('');
              }}
              className={`flex items-center gap-2.5 px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'administradores'
                  ? 'border-purple-600 text-purple-600 bg-white/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Administradores</span>
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'administradores'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {administradoresList.length}
              </span>
            </button>
          </div>

          {/* Banner de permissão para operadores comuns na aba de Administradores */}
          {activeTab === 'administradores' && !isSuperAdmin && (
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2.5 text-xs text-purple-900">
              <Lock className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                Visualização em modo somente-leitura. Apenas o <strong>Administrador Principal (Super ADM)</strong> pode cadastrar novos administradores ou alterar permissões de acesso.
              </span>
            </div>
          )}

          {/* Barra de Busca */}
          <div className="w-full">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar em ${activeTab === 'clientes' ? 'clientes' : 'administradores'} por nome, email, CPF ou cidade...`}
            />
          </div>

          {/* Conteúdo Principal / Tabela */}
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Carregando usuários da API...</p>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              activeTab={activeTab}
              onToggleStatus={
                // Se for aba administradores e não for super admin, não passa ação de toggle
                activeTab === 'administradores' && !isSuperAdmin ? undefined : handleToggleStatus
              }
              isCurrentUserSuperAdmin={isSuperAdmin}
            />
          )}
        </div>
      </main>

      {/* Modal de Criação de Administrador */}
      <NovoAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAdmin}
        loading={savingAdmin}
      />
    </div>
  );
}
