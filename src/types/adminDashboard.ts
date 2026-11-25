
export interface DashboardMetric {
    id: "receita" | "pedidos" | "estoque" | "clientes";
    label: string;
    value: string;
    trend: number;
    bgColor: string;
}

export interface FaturamentoComparativo {
    mesAtual: number;
    mesAnterior: number;
    variacaoPercentual: number;
}

export interface PedidosPorStatus {
    pendente: number;
    pago: number;
    em_separacao: number;
    enviado: number;
    entregue: number;
    cancelado: number;
}

export interface EstoqueCriticoItem {
    produtoId: string;
    nome: string;
    tamanho: string | number;
    quantidade: number;
}

export interface EstoqueCritico {
    totalCriticos: number;
    itens: EstoqueCriticoItem[];
}

export interface VendaMensal {
    mes: string;
    vendas: number;
    pedidos: number;
}

export interface CategoriaDashboard {
    nome: string;
    quantidade: number;
    porcentagem: number;
    cor: string;
    classesTexto: string;
}

export interface TopProduto {
    id: string;
    name: string;
    sales: number;
    revenue: string;
    rating: number;
    foto: string;
    image: string;
}

export interface DashboardData {
    metrics: DashboardMetric[];
    faturamentoComparativo: FaturamentoComparativo;
    pedidosPorStatus: PedidosPorStatus;
    estoqueCritico: EstoqueCritico;
    vendasMensais: VendaMensal[];
    categorias: CategoriaDashboard[];
    topProdutos: TopProduto[];
}

export interface DashboardResponse {
    status: string;
    message?: string;
    data: DashboardData;
}