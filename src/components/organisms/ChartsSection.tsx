
import React from "react";

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

interface ChartsSectionProps {
  vendasMensais: VendaMensal[];
  categorias: CategoriaDashboard[];
}

const CORES_CATEGORIAS = [
  "#D4AF37",
  "#334155",
  "#64748B",
  "#94A3B8",
  "#CBD5E1",
];

export function ChartsSection({
  vendasMensais,
  categorias,
}: ChartsSectionProps): React.JSX.Element {
  // Configurações do gráfico de vendas
  const largura = 600;
  const altura = 220;
  const margemEsquerda = 45;
  const margemDireita = 15;
  const margemSuperior = 15;
  const margemInferior = 35;

  const areaLargura = largura - margemEsquerda - margemDireita;
  const areaAltura = altura - margemSuperior - margemInferior;

  const maiorVenda = Math.max(
    ...vendasMensais.map((item) => item.vendas),
    0,
  );

  const maiorValor = Math.max(maiorVenda, 1000);
  const maxValorY = Math.ceil(maiorValor / 1000) * 1000;

  const obterCoordenadas = (
    valor: number,
    indice: number,
  ): { x: number; y: number } => {
    const totalPontos = vendasMensais.length;

    const x =
      margemEsquerda +
      (totalPontos <= 1
        ? areaLargura / 2
        : (indice / (totalPontos - 1)) * areaLargura);

    const y =
      margemSuperior + areaAltura - (valor / maxValorY) * areaAltura;

    return { x, y };
  };

  const pontosVendas = vendasMensais
    .map((item, indice) => {
      const ponto = obterCoordenadas(item.vendas, indice);
      return `${ponto.x},${ponto.y}`;
    })
    .join(" ");

  const pontosPedidos = vendasMensais
    .map((item, indice) => {
      const ponto = obterCoordenadas(item.pedidos, indice);
      return `${ponto.x},${ponto.y}`;
    })
    .join(" ");

  // Configurações do gráfico de categorias
  const totalCategorias = categorias.reduce(
    (total, categoria) => total + categoria.quantidade,
    0,
  );

  let acumulado = 0;

  const categoriasComPercentual = categorias.map((categoria, indice) => {
    const percentual =
      totalCategorias > 0
        ? (categoria.quantidade / totalCategorias) * 100
        : 0;

    const inicio = acumulado;
    acumulado += percentual;

    return {
      ...categoria,
      percentual,
      inicio,
      cor: CORES_CATEGORIAS[indice % CORES_CATEGORIAS.length],
    };
  });

  const gerarGraficoPizza = () => {
    if (categorias.length === 0) {
      return "conic-gradient(#E2E8F0 0% 100%)";
    }

    let acumulado = 0;

    const partes = categorias.map((categoria) => {
      const inicio = acumulado;
      acumulado += categoria.porcentagem;

      return `${categoria.cor} ${inicio}% ${acumulado}%`;
    });

    return `conic-gradient(${partes.join(", ")})`;
  };

  const formatarMoeda = (valor: number): string =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });

  const formatarEixoY = (valor: number): string => {
    if (valor >= 1000) {
      return `${valor / 1000} mil`;
    }

    return String(valor);
  };

  const niveisEixoY = Array.from(
    { length: 5 },
    (_, indice) => (maxValorY / 4) * (4 - indice),
  );

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de vendas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-800">
            Visão geral de vendas
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Acompanhamento mensal de vendas e pedidos
          </p>
        </div>

        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
            <span className="text-xs text-slate-500">Vendas</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="text-xs text-slate-500">Pedidos</span>
          </div>
        </div>

        {vendasMensais.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${largura} ${altura}`}
              className="w-full min-w-[450px]"
              role="img"
              aria-label="Gráfico mensal de vendas e pedidos"
            >
              {/* Linhas e valores do eixo Y */}
              {niveisEixoY.map((valor, indice) => {
                const y =
                  margemSuperior + (indice / 4) * areaAltura;

                return (
                  <g key={indice}>
                    <line
                      x1={margemEsquerda}
                      y1={y}
                      x2={largura - margemDireita}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />

                    <text
                      x={margemEsquerda - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94A3B8"
                    >
                      {formatarEixoY(valor)}
                    </text>
                  </g>
                );
              })}

              {/* Linha de vendas */}
              {vendasMensais.length > 1 && (
                <polyline
                  points={pontosVendas}
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Linha de pedidos */}
              {vendasMensais.length > 1 && (
                <polyline
                  points={pontosPedidos}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Pontos e meses */}
              {vendasMensais.map((item, indice) => {
                const pontoVenda = obterCoordenadas(
                  item.vendas,
                  indice,
                );

                const pontoPedido = obterCoordenadas(
                  item.pedidos,
                  indice,
                );

                return (
                  <g key={`${item.mes}-${indice}`}>
                    <circle
                      cx={pontoVenda.x}
                      cy={pontoVenda.y}
                      r="4"
                      fill="#D4AF37"
                    />

                    <circle
                      cx={pontoPedido.x}
                      cy={pontoPedido.y}
                      r="4"
                      fill="#334155"
                    />

                    <text
                      x={pontoVenda.x}
                      y={altura - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#94A3B8"
                    >
                      {item.mes}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">
            Nenhum dado de vendas disponível.
          </p>
        )}
      </div>

      {/* Gráfico de categorias */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-800">
            Vendas por categoria
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Distribuição dos produtos vendidos
          </p>
        </div>

        {categorias.length > 0 && totalCategorias > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
            {/* Pizza */}
            <div
              className="w-44 h-44 rounded-full shrink-0"
              style={{ background: gerarGraficoPizza() }}
              role="img"
              aria-label="Distribuição percentual das vendas por categoria"
            >
              <div className="w-24 h-24 bg-white rounded-full m-auto relative top-10 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-800">
                  {totalCategorias.toLocaleString("pt-BR")}
                </span>

                <span className="text-[10px] text-slate-400">
                  Vendidos
                </span>
              </div>
            </div>

            {/* Legenda */}
            <div className="flex flex-col gap-4 w-full max-w-[220px]">
              {categoriasComPercentual.map((categoria, indice) => (
                <div
                  key={`${categoria.nome}-${indice}`}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: categoria.cor }}
                    />

                    <span className="text-xs text-slate-600 truncate">
                      {categoria.nome}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                    {categoria.percentual.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">
            Nenhum dado de categoria disponível.
          </p>
        )}
      </div>
    </section>
  );
}
