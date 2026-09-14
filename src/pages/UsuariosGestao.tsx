// src/pages/Usuarios_Gestao.tsx
import React, { useState } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader_usuario from '../components/molecules/PageHeader_usuario';
import SearchInput from '../components/atoms/SearchInput';
import UserTable from '../components/organisms/UserTable';

export interface UserItem {
  id?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cpf?: string;
  cep?: string;
  type?: string;
  role?: string;
  provider?: string;
  status?: string;
  createdAt?: string;
}

type FormMode = 'create' | 'edit' | null;

const initialUsers: UserItem[] = [
  { id: 1, firstName: 'João', lastName: 'Silva', email: 'joao.silva@email.com', phone: '(11) 98765-4321', cpf: '123.456.789-00', type: 'Cliente', provider: 'Google', status: 'Ativo', createdAt: '15/03/2026' },
  { id: 2, firstName: 'Maria', lastName: 'Santos', email: 'maria.santos@email.com', phone: '(21) 91234-5678', cpf: '987.654.321-00', type: 'Cliente', provider: 'Email/Senha', status: 'Ativo', createdAt: '10/02/2026' },
  { id: 3, firstName: 'Pedro', lastName: 'Oliveira', email: 'pedro.oliveira@email.com', phone: '(31) 99999-8888', cpf: '456.789.123-00', type: 'Administrador', provider: 'Google', status: 'Ativo', createdAt: '05/01/2026' },
  { id: 4, firstName: 'Ana', lastName: 'Costa', email: 'ana.costa@email.com', phone: '(41) 97777-6666', cpf: '789.123.456-00', type: 'Cliente', provider: 'Email/Senha', status: 'Inativo', createdAt: '28/04/2026' },
];

export default function UsuariosGestao(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formMode, setFormMode] = useState<FormMode>(null); 
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);

  const [formData, setFormData] = useState<UserItem>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    type: 'Cliente',
    provider: 'Email/Senha',
    status: 'Ativo',
    createdAt: ''
  });

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8); // só números, máximo 8
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11); // só números, máximo 11

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11); // só números, máximo 11

    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEdit = (id: number | string): void => {
    const user = users.find(u => u.id === id);
    if (user) {
      setFormData(user);
      setEditingId(id);
      setFormMode('edit');
    }
  };
  
  const handleNovoUsuario = (): void => {
    const today = new Date().toLocaleDateString('pt-BR');
    setFormData({ 
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '', 
      cpf: '',
      cep: '', 
      type: 'Cliente', 
      provider: 'Email/Senha', 
      status: 'Ativo', 
      createdAt: today 
    });
    setFormMode('create');
  };
  
  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.cpf && user.cpf.includes(searchTerm))
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (formMode === 'edit') {
      setUsers(users.map(u => u.id === editingId ? { ...formData, id: editingId } : u));
    } else {
      setUsers([...users, { ...formData, id: Date.now() }]);
    }
    handleCloseForm();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased pt-10 pe-5">
      <Sidebar activePage="usuarios" />

      <main className= "pl-72 flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <PageHeader_usuario
            title="Gestão de Usuários" 
            subtitle="Gerencie as permissões e cadastros dos usuários e clientes" 
            buttonText="Novo Usuário"
            onButtonClick={handleNovoUsuario}
            showButton={formMode === null}
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm flex items-center shadow-sm"
          />

          {formMode !== null ? (
            <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                {formMode === 'edit' ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
              </h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Nome</label>
                    <input type="text" className="p-2 border border-slate-200 rounded-lg" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Sobrenome</label>
                    <input type="text" className="p-2 border border-slate-200 rounded-lg" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">E-mail</label>
                    <input
                      type="email"
                      className={`p-2 border rounded-lg ${
                        formData.email && !isValidEmail(formData.email)
                          ? 'border-red-400'
                          : 'border-slate-200'
                      }`}
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value.trim().toLowerCase() })}
                      placeholder="seuemail@exemplo.com"
                      required
                    />
                    {formData.email && !isValidEmail(formData.email) && (
                      <span className="text-xs text-red-500">Digite um e-mail válido</span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Telefone</label>
                    <input
                      type="text"
                      className="p-2 border border-slate-200 rounded-lg"
                      value={formData.phone || ''}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setFormData({ ...formData, phone: formatted });
                      }}
                      maxLength={15} // (xx) xxxxx-xxxx
                      inputMode="numeric"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">CPF</label>
                    <input
                      type="text"
                      className="p-2 border border-slate-200 rounded-lg"
                      value={formData.cpf || ''}
                      onChange={(e) => {
                        const formatted = formatCpf(e.target.value);
                        setFormData({ ...formData, cpf: formatted });
                      }}
                      maxLength={14} // 11 números + 2 pontos + 1 hífen
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-slate-600">CEP</label>
                      <input
                        type="text"
                        className="p-2 border border-slate-200 rounded-lg"
                        value={formData.cep || ''}
                        onChange={(e) => {
                          const formatted = formatCep(e.target.value);
                          setFormData({ ...formData, cep: formatted });
                        }}
                        maxLength={9} // 8 números + 1 hífen
                        inputMode="numeric"
                        placeholder="00000-000"
                      />
                    </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Tipo de Usuário</label>
                    <select className="p-2 border border-slate-200 rounded-lg bg-white" value={formData.type || 'Cliente'} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="Cliente">Cliente</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Provedor</label>
                    <select className="p-2 border border-slate-200 rounded-lg bg-white" value={formData.provider || 'Email/Senha'} onChange={(e) => setFormData({...formData, provider: e.target.value})}>
                      <option value="Email/Senha">Email/Senha</option>
                      <option value="Google">Google</option>
                      <option value="Apple">Apple</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Status</label>
                    <select className="p-2 border border-slate-200 rounded-lg bg-white" value={formData.status || 'Ativo'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Data de Criação</label>
                    <input type="text" className="p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" value={formData.createdAt || ''} readOnly />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    {formMode === 'edit' ? 'Atualizar usuário' : 'Salvar Usuário'}
                  </button>
                  <button type="button" onClick={handleCloseForm} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="w-full bg-white rounded-xl mb-5 mt-7">
                <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar usuários..." />
              </div>
              <UserTable users={filteredUsers as any} onEdit={handleEdit} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}