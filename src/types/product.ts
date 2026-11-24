export interface Product {
  id: string | number;
  name: string;
  productType: string;
  terrainType?: string;
  brand: string;
  model: string;
  price: number | string;
  costPrice?: number | string;
  stock: number | string;
  sizes: string;
  grade?: Array<{ size: number; stock: number }>;
  color: string;
  active: 'Ativo' | 'Inativo' | string;
  description?: string;
  image?: string;
  images?: string[];
}
