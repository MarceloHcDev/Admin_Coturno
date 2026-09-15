// src/components/organisms/UserTable.tsx
import React from 'react';
import { UserIcon, EditButton } from '../atoms/Icons';


export interface UserItem {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  sreet: string; // rua
  sreet_number: string; //número da rua
  block: string; //bairro
  city: string; //cidade
  state: string; //estado
  type: string;
  role: string;
  provider: string;
  status: string;
  createdAt: string;
}

export interface UserTableProps {
  /** Lista de usuários a serem exibidos na tabela */
  users?: UserItem[];
  /** Callback acionado ao clicar no botão de edição de um usuário */
  onEdit: (id: string | number) => void;
  /** Callback opcional acionado ao clicar no botão de exclusão */
  onDelete?: (id: string | number) => void;
}

interface BadgeProps {
  tipo?: string;
  status?: string;
}

// Badge colorido baseado no tipo e status do usuário
const TypeBadge: React.FC<BadgeProps> = ({ tipo }) => {
  const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-full";
  
  if (tipo === 'Administrador') {
    return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Administrador</span>;
  }
  return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Cliente</span>;
};

const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-full";
  
  if (status === 'Ativo') {
    return <span className={`${baseClasses} bg-emerald-100 text-emerald-800`}>Ativo</span>;
  }
  return <span className={`${baseClasses} bg-rose-100 text-rose-800`}>Inativo</span>;
};

export const UserTable: React.FC<UserTableProps> = ({ 
  users = [], 
  onEdit 
}) => {
  return (
    <div className="w-full min-w-0 overflow-x-auto bg-white border border-slate-300 rounded-xl shadow-sm">
      <table className="w-full border-collapse align-middle">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-left">
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Usuário</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Contato</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">CPF</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">CEP</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Rua</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Número</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Bairro</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Cidade</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Estado</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Tipo</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Provedor</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Status</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans whitespace-nowrap">Cadastrado Em</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans text-center whitespace-nowrap">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                {/* Nome + Sobrenome + Avatar */}
                <td className="py-3 px-4 flex items-center gap-3 whitespace-nowrap">
                  <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-900">{`${user.firstName} ${user.lastName}`}</span>
                </td>
                
                {/* Contato (E-mail e Telefone em bloco) */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-slate-700">{user.email}</span>
                    <span className="text-xs text-slate-400">{user.phone}</span>
                  </div>
                </td>
                
                {/* CPF */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.cpf}</td>
                
                {/* CEP */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.cep}</td>
                {/* Rua */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.sreet}</td>
                {/* Número da rua */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.sreet_number}</td>
                {/* Bairro */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.block}</td>
                {/* Cidade */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.city}</td>
                {/* Estado */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.state}</td>
                
                {/* Tipo de Usuário (Badge) */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <TypeBadge tipo={user.type} />
                </td>

                {/* Provedor */}
                <td className="py-3 px-4 text-slate-600 font-medium text-xs whitespace-nowrap">{user.provider}</td>

                {/* Status (Badge) */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                
                {/* Data de Cadastro */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{user.createdAt}</td>
                
                {/* Ações */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <EditButton onClick={() => onEdit(user.id)} className="text-blue-600 hover:text-blue-800" />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={14} className="py-8 px-6 text-center text-sm text-slate-400">
                Nenhum usuário encontrado para o termo buscado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;