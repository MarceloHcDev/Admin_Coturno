export type ProductStatus = 'Em Estoque' | 'Baixo Estoque' | 'Esgotado';

export interface Product {
  id: string | number;
  name: string;
  category: string;
  terrainType?: string;
  model: string;
  color: string;
  price: number;
  costPrice?: number;
  stock: number;
  status: ProductStatus;
}