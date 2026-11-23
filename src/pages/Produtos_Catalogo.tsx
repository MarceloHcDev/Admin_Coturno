import React, { useState, ChangeEvent, FormEvent } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader from '../components/molecules/PageHeader';
import SearchInput from '../components/atoms/SearchInput';
import ProductTable, { Product } from '../components/organisms/ProductTable';
import { api } from '../services/api';

// Base da URL (VITE_API_URL, já com /api), token e erros ficam centralizados em services/api

export interface ProductFormData {
  name: string;
  productType: string;
  model: string;
  brand: string;
  description: string;
  active: 'Ativo' | 'Inativo' | string;
  price: number | string;
  stock: number | string;
  sizes: string;
  color: string;
  image: string;
}

type FormMode = 'create' | 'edit' | null;

// Tipo de cada imagem: principal (vitrine), hover (ao passar o mouse) ou galeria
type ImageType = 'main' | 'hover' | 'gallery';

interface ImageSlot {
  file: File | null;
}

const IMAGE_SLOTS = 6;
// Imagem 1 (principal) e 2 (hover) são obrigatórias no cadastro; as demais são opcionais
const REQUIRED_SLOTS = 2;

// Tipo fixo por posição: Imagem 1 = principal, Imagem 2 = hover, demais = galeria
const getImageType = (slotIndex: number): ImageType => {
  if (slotIndex === 0) return 'main';
  if (slotIndex === 1) return 'hover';
  return 'gallery';
};

const IMAGE_TYPE_LABELS: Record<ImageType, string> = {
  main: 'Principal',
  hover: 'Hover',
  gallery: 'Galeria',
};

const createEmptySlots = (): ImageSlot[] =>
  Array.from({ length: IMAGE_SLOTS }, () => ({ file: null }));

export default function Produtos_Catalogo(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Imagens anexadas: 6 slots, cada um com arquivo e tipo
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(createEmptySlots);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Atalaia Combat', productType: 'Coturno', model: 'Combat X', brand: 'Atalaia', active: 'Ativo', price: 599.90, stock: 45, sizes: '38-44', color: 'Preto/Branco' },
    { id: 2, name: 'Atalaia Montanha', productType: 'Coturno', model: 'Montanha Pro', brand: 'Atalaia', active: 'Ativo', price: 799.90, stock: 32, sizes: '36-42', color: 'Azul' },
    { id: 3, name: 'Acero Adventure', productType: 'Borzeguim', model: 'Adventure Classic', brand: 'Acero', active: 'Ativo', price: 299.90, stock: 28, sizes: '38-44', color: 'Marrom' },
    { id: 4, name: 'Acero Adventure', productType: 'Borzeguim', model: 'Adventure Light', brand: 'Acero', active: 'Inativo', price: 249.90, stock: 56, sizes: '36-42', color: 'Bege' },
  ]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '', productType: '', model: '', brand: '', description: '', active: 'Ativo', price: '', stock: '', sizes: '', color: '', image: ''
  });


  const handleEdit = (id: string | number): void => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        name: product.name,
        productType: product.productType,
        model: product.model,
        brand: product.brand,
        description: (product as any).description || '',
        active: product.active,
        price: product.price,
        stock: product.stock,
        sizes: product.sizes,
        color: product.color,
        image: (product as any).image || ''
      });
      setEditingId(Number(id));
      setImageSlots(createEmptySlots());
      setFormMode('edit');
    }
  };

  const handleOpenCreate = (): void => {
    setFormData({ name: '', productType: '', model: '', brand: '', description: '', active: 'Ativo', price: '', stock: '', sizes: '', color: '', image: '' });
    setImageSlots(createEmptySlots());
    setFormMode('create');
  };

  const handleCloseForm = (): void => {
    setFormMode(null);
    setEditingId(null);
    setImageSlots(createEmptySlots());
  };

  const handleFileChange = (slotIndex: number) => (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    setImageSlots(prev => prev.map((slot, i) => (i === slotIndex ? { ...slot, file } : slot)));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.productType && product.productType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFeedback(null);

    // Cadastro exige as imagens 1 (principal) e 2 (hover).
    // Na edição só são enviadas as imagens novas, então a exigência não se aplica.
    if (formMode === 'create') {
      const faltando = imageSlots.slice(0, REQUIRED_SLOTS).some((slot) => slot.file === null);
      if (faltando) {
        setFeedback({ type: 'error', text: 'As imagens 1 (principal) e 2 (hover) são obrigatórias.' });
        return;
      }
    }

    const parsedPrice = typeof formData.price === 'number' ? formData.price : parseFloat(formData.price) || 0;
    const parsedStock = typeof formData.stock === 'number' ? formData.stock : parseInt(formData.stock, 10) || 0;

    // Cada slot vira images[i][file], images[i][type] e images[i][position]
    const appendImages = (fd: FormData): boolean => {
      let hasImages = false;
      imageSlots.forEach((slot, i) => {
        if (slot.file) {
          fd.append(`images[${i}][file]`, slot.file);
          fd.append(`images[${i}][type]`, getImageType(i));
          fd.append(`images[${i}][position]`, String(i));
          hasImages = true;
        }
      });
      return hasImages;
    };

    setSubmitting(true);

    try {
      if (formMode === 'edit' && editingId !== null) {
        // Edição: se houver imagens novas, envia só elas para o endpoint de imagens
        const fd = new FormData();
        if (appendImages(fd)) {
          const data = await api<{ success: boolean; message?: string }>(
            `/v1/admin/products/${editingId}/image`,
            { method: 'POST', body: fd },
          );
          // 207 (envio parcial) chega aqui como "ok", mas com success = false
          if (data.success === false) {
            throw new Error(data.message || 'Erro ao enviar as imagens do produto.');
          }
        }

        setProducts(products.map(p => p.id === editingId ? {
          ...p,
          name: formData.name,
          productType: formData.productType,
          model: formData.model,
          brand: formData.brand,
          active: formData.active,
          sizes: formData.sizes,
          color: formData.color,
          price: parsedPrice,
          stock: parsedStock,
          id: editingId
        } : p));
        setFeedback({ type: 'success', text: 'Produto atualizado com sucesso!' });
      } else {
        // Cadastro: envia os dados + imagens; o back-end cria o produto e usa o id para nomear as imagens
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('product_type', formData.productType);
        fd.append('brand', formData.brand);
        fd.append('description', formData.description);
        fd.append('base_price', String(parsedPrice));
        fd.append('active', formData.active === 'Ativo' ? '1' : '0');
        appendImages(fd);

        const data = await api<{
          data?: { id: number | string };
          id?: number | string;
          image_warning?: string;
        }>('/v1/admin/products', { method: 'POST', body: fd });

        // ProductResource normalmente devolve { data: { id, ... } }
        const newId = (data.data?.id ?? data.id) as number | string;

        setProducts([...products, {
          id: newId,
          name: formData.name,
          productType: formData.productType,
          model: formData.model,
          brand: formData.brand,
          active: formData.active,
          sizes: formData.sizes,
          color: formData.color,
          price: parsedPrice,
          stock: parsedStock,
        }]);

        setFeedback(
          data.image_warning
            ? { type: 'error', text: data.image_warning }
            : { type: 'success', text: 'Produto cadastrado com sucesso!' }
        );
      }

      handleCloseForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setFeedback({
        type: 'error',
        text: error instanceof Error ? error.message : 'Falha na comunicação com o servidor.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar activePage="produtos" />
      <main className="flex-1 min-w-0 pl-72 pt-8 pb-10 pr-4 lg:pr-8 xl:pr-12 2xl:pr-16">
        <div className="max-w-[1600px] mx-auto space-y-6 min-w-0">
          <PageHeader
            title="Gerenciamento de Produtos"
            subtitle="Gerencie o catálogo de calçados da sua loja"
            onActionClick={handleOpenCreate}
            hideButton={formMode !== null}
            buttonClassName="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors px-4 py-2 text-sm flex items-center shadow-sm"
          />

          {feedback && (
            <div
              role="alert"
              className={`rounded-lg px-4 py-3 text-sm font-medium border ${feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
                }`}
            >
              {feedback.text}
            </div>
          )}

          {formMode !== null ? (
            <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                {formMode === 'edit' ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Nome do Produto</label>
                    <input
                      type="text"
                      placeholder="Ex: Nike Air Max 2024"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Tipo do produto</label>
                    <select
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
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

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Modelo</label>
                    <input
                      type="text"
                      placeholder="Ex: Combat X"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Marca</label>
                    <select
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 bg-white"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Preço</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="R$ 0,00"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Quantidade em Estoque</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Tamanhos Disponíveis</label>
                    <input
                      type="text"
                      placeholder="Ex: 38-44"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Cor</label>
                    <input
                      type="text"
                      placeholder="Ex: Preto/Branco"
                      className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">Descrição</label>
                  <textarea
                    rows={3}
                    placeholder="Digite os detalhes e especificações do produto..."
                    className="p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-slate-600">Status do Produto</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, active: 'Ativo' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${formData.active === 'Ativo'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      Ativo
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, active: 'Inativo' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${formData.active === 'Inativo'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      Inativo
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Imagens do produto <span className="text-slate-400 font-normal">(imagens 1 e 2 são obrigatórias)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {imageSlots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="flex flex-col space-y-3 p-3 border border-slate-200 rounded-lg bg-slate-50/50"
                      >
                        <span className="text-sm font-semibold text-slate-700">
                          Imagem {slotIndex + 1}
                          {slotIndex < REQUIRED_SLOTS && <span className="text-rose-600"> *</span>}
                        </span>

                        <div className="flex items-center space-x-3">
                          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center shrink-0">
                            <span>Anexar Imagem</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={handleFileChange(slotIndex)}
                            />
                          </label>
                          <span className="text-sm text-slate-500 truncate min-w-0">
                            {slot.file?.name ?? 'Nenhum arquivo escolhido'}
                          </span>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-slate-500">Tipo da imagem</span>
                          <span className="p-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-700">
                            {IMAGE_TYPE_LABELS[getImageType(slotIndex)]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {submitting
                      ? 'Salvando...'
                      : formMode === 'edit' ? 'Atualizar produto' : 'Cadastrar Produto'}
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
                onEdit={handleEdit}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}