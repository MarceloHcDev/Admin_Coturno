import React, { useState, ChangeEvent, FormEvent } from 'react';
import Sidebar from '../components/organisms/Sidebar.jsx';
import PageHeader from '../components/molecules/PageHeader.js';
import SearchInput from '../components/atoms/SearchInput.jsx';
import ProductTable from '../components/organisms/ProductTable.jsx';

export interface Product {
  id: number;
  name: string;
  productType: string;
  model: string;
  brand: string;
  description: string;
  active: 'Ativo' | 'Inativo';
  price: number | string;
  stock: number | string;
  sizes: string;
  color: string;
  image: string;
}

export interface ProductFormData {
  name: string;
  productType: string;
  model: string;
  brand: string;
  description: string;
  active: 'Ativo' | 'Inativo';
  price: number | string;
  stock: number | string;
  sizes: string;
  color: string;
  image: string;
}

type FormMode = 'create' | 'edit' | null;

export default function Produtos_Catalogo(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formMode, setFormMode] = useState<FormMode>(null); 
  const [editingId, setEditingId] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Atalaia Combat', productType: 'Coturno', model: 'Combat X', brand: 'Atalaia', description: 'Coturno tático de alta resistência.', active: 'Ativo', price: 599.90, stock: 45, sizes: '38-44', color: 'Preto/Branco', image: '/product1.jpg' },
    { id: 2, name: 'Atalaia Montanha', productType: 'Coturno', model: 'Montanha Pro', brand: 'Atalaia', description: 'Ideal para terrenos acidentados.', active: 'Ativo', price: 799.90, stock: 32, sizes: '36-42', color: 'Azul', image: '/product2.jpg' },
    { id: 3, name: 'Acero Adventure', productType: 'Borzeguim', model: 'Adventure Classic', brand: 'Acero', description: 'Borzeguim confortável para trilhas.', active: 'Ativo', price: 299.90, stock: 28, sizes: '38-44', color: 'Marrom', image: '/product3.jpg' },
    { id: 4, name: 'Acero Adventure', productType: 'Borzeguim', model: 'Adventure Light', brand: 'Acero', description: 'Versão leve para o dia a dia.', active: 'Inativo', price: 249.90, stock: 56, sizes: '36-42', color: 'Bege', image: '/product4.jpg' },
  ]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '', productType: '', model: '', brand: '', description: '', active: 'Ativo', price: '', stock: '', sizes: '', color: '', image: ''
  });

  const handleEdit = (id: number): void => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData(product);
      setEditingId(id);
      setFormMode('edit');
    }
  };
  
  const handleOpenCreate = (): void => {
    setFormData({ name: '', productType: '', model: '', brand: '', description: '', active: 'Ativo', price: '', stock: '', sizes: '', color: '', image: '' });
    setFormMode('create');
  };
  
  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
  };

  // Lida com a seleção do arquivo 
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, image: `/${file.name}`});
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.productType && product.productType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (formMode === 'edit' && editingId !== null) {
      setProducts(products.map(p => p.id === editingId ? { 
        ...formData, 
        price: typeof formData.price === 'number' ? formData.price : parseFloat(formData.price) || 0,
        stock: typeof formData.stock === 'number' ? formData.stock : parseInt(formData.stock, 10) || 0,
        id: editingId 
      } : p));
    } else {
      setProducts([...products, { 
        ...formData, 
        price: typeof formData.price === 'number' ? formData.price : parseFloat(formData.price) || 0,
        stock: typeof formData.stock === 'number' ? formData.stock : parseInt(formData.stock, 10) || 0,
        id: Date.now() 
      }]);
    }
    handleCloseForm();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 pt-10 pe-5">
      <Sidebar activePage="produtos" />
      <main className="pl-72 flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <PageHeader 
            title="Gerenciamento de Produtos" 
            subtitle="Gerencie o catálogo de calçados da sua loja" 
            onActionClick={handleOpenCreate} 
            hideButton={formMode !== null}
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm flex items-center shadow-sm"
          />

          {formMode !== null ? (
            <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                {formMode === 'edit' ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Nome do Produto */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Nome do Produto</label>
                    <input 
                      type="text"
                      placeholder="Ex: Nike Air Max 2024"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  {/* Tipo do Produto */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Tipo do produto</label>
                    <select 
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
                      value={formData.productType}
                      onChange={(e) => setFormData({...formData, productType: e.target.value})}
                      required
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="Coturno">Coturno</option>
                      <option value="Borzeguim">Borzeguim</option>
                      <option value="Tênis Esportivo">Tênis Esportivo</option>
                      <option value="Sapatos Sociais">Sapatos Sociais</option>
                      <option value="Sandálias">Sandálias</option>
                    </select>
                  </div>

                  {/* Modelo */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Modelo</label>
                    <input 
                      type="text"
                      placeholder="Ex: Combat X"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                    />
                  </div>

                  {/* Marca */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Marca</label>
                    <select 
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      required
                    >
                      <option value="">Selecione uma marca</option>
                      <option value="Atalaia">Atalaia</option>
                      <option value="Acero">Acero</option>
                      <option value="Bull Terrier">Bull Terrier</option>
                      <option value="Oakley">Oakley</option>
                      <option value="Macboot">Macboot</option>
                    </select>
                  </div>

                  {/* Preço */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Preço</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="R$ 0,00"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  {/* Quantidade em Estoque */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Quantidade em Estoque</label>
                    <input 
                      type="number"
                      placeholder="0"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                    />
                  </div>

                  {/* Tamanhos Disponíveis */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Tamanhos Disponíveis</label>
                    <input 
                      type="text"
                      placeholder="Ex: 38-44"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.sizes}
                      onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                      required
                    />
                  </div>

                  {/* Cor */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Cor</label>
                    <input 
                      type="text"
                      placeholder="Ex: Preto/Branco"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      required
                    />
                  </div>

                </div>

                {/* Descrição */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">Descrição</label>
                  <textarea 
                    rows={3}
                    placeholder="Digite os detalhes e especificações do produto..."
                    className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Ativo (Botão de seleção Ativo ou Inativo) */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">Status do Produto</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, active: 'Ativo'})}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        formData.active === 'Ativo'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Ativo
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, active: 'Inativo'})}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        formData.active === 'Inativo'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Inativo
                    </button>
                  </div>
                </div>

                {/* Imagem do Produto (Botão de Anexo Customizado) */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">Imagem do Produto</label>
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center">
                      <span>Anexar Imagem</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <span className="text-sm text-slate-500 truncate max-w-xs">
                      {formData.image ? formData.image : 'Nenhum arquivo escolhido'}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação do Formulário */}
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {formMode === 'edit' ? 'Atualizar produto' : 'Cadastrar Produto'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="w-full bg-white rounded-xl mb-5 mt-7">
                <SearchInput 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Buscar produtos..." 
                />
              </div>

              <ProductTable 
                products={filteredProducts} 
                onEdit={(id) => handleEdit(Number(id))} 
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}