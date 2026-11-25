import React from 'react';
import { UserIcon } from '../atoms/Icons';
import { Power, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export interface UserItem {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cpf?: string;
  cep?: string;
  sreet?: string; // rua
  sreet_number?: string; // número da rua
  block?: string; // bairro
  city?: string; // cidade
  state?: string; // estado
  type?: string; // 'Administrador' | 'Cliente'
  role?: string;
  provider?: string;
  status?: string; // 'ativo' | 'inativo' | 'Ativo' | 'Inativo'
  createdAt?: string;
  isSuperAdmin?: boolean;
  is_super_admin?: boolean;
}

export interface UserTableProps {
  /** Lista de usuários a serem exibidos na tabela */
  users?: UserItem[];
  /** Indica se a tabela está exibindo Administradores ou Clientes */
  activeTab?: 'clientes' | 'administradores';
  /** Callback para alternar status (ativar/inativar) */
  onToggleStatus?: (id: string | number, currentStatus?: string) => void;
  /** Usuário logado é Super ADM? */
  isCurrentUserSuperAdmin?: boolean;
}

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const isAtivo = status?.toLowerCase() === 'ativo';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        isAtivo
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}
    >
      {isAtivo ? (
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
      ) : (
        <XCircle className="w-3 h-3 text-rose-500" />
      )}
      {isAtivo ? 'Ativo' : 'Inativo'}
    </span>
  );
};

export const UserTable: React.FC<UserTableProps> = ({
  users = [],
  activeTab = 'clientes',
  onToggleStatus,
  isCurrentUserSuperAdmin = false,
}) => {
  return (
    <div className="w-full min-w-0 overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
      <table className="w-full border-collapse align-middle">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 text-left">
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
              {activeTab === 'administradores' ? 'Administrador' : 'Cliente'}
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
              Contato
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
              CPF
            </th>
            {activeTab === 'clientes' && (
              <>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
                  Cidade / UF
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
                  Endereço
                </th>
              </>
            )}
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
              Provedor
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
              Status
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans whitespace-nowrap">
              Cadastrado Em
            </th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans text-center whitespace-nowrap">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
          {users.length > 0 ? (
            users.map((user) => {
              const isAtivo = user.status?.toLowerCase() === 'ativo';
              const isItemSuperAdmin = Boolean(user.isSuperAdmin || user.is_super_admin);

              return (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Nome + Avatar */}
                  <td className="py-3.5 px-4 flex items-center gap-3 whitespace-nowrap">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isItemSuperAdmin
                          ? 'bg-amber-100 text-amber-700'
                          : activeTab === 'administradores'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuário'}
                        </span>
                        {isItemSuperAdmin && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">ID: {user.id}</div>
                    </div>
                  </td>

                  {/* Contato (Email / Telefone) */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-medium text-xs sm:text-sm">
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="text-xs text-slate-400">{user.phone}</span>
                      )}
                    </div>
                  </td>

                  {/* CPF */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                    {user.cpf || '—'}
                  </td>

                  {/* Campos específicos de Cliente: Endereço */}
                  {activeTab === 'clientes' && (
                    <>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                        {user.city && user.state ? `${user.city} / ${user.state}` : user.city || user.state || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                        {user.sreet ? `${user.sreet}${user.sreet_number ? `, nº ${user.sreet_number}` : ''}` : '—'}
                      </td>
                    </>
                  )}

                  {/* Provedor */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium text-xs whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {user.provider || 'Local'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Data de Cadastro */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                    {user.createdAt || '—'}
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {isItemSuperAdmin ? (
                        <span
                          className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                          title="O Administrador Principal não pode ser inativado"
                        >
                          Imune
                        </span>
                      ) : (
                        onToggleStatus && (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(user.id, user.status)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                              isAtivo
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title={isAtivo ? 'Inativar acesso' : 'Reativar acesso'}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{isAtivo ? 'Inativar' : 'Reativar'}</span>
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={activeTab === 'clientes' ? 9 : 7}
                className="py-12 px-6 text-center text-sm text-slate-400"
              >
                Nenhum {activeTab === 'administradores' ? 'administrador' : 'cliente'} encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
