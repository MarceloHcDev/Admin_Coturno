// src/components/organisms/ChartsSection.tsx
import React, { useState } from "react";

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

export function ChartsSection({
  vendasMensais,
  categorias,
}: ChartsSectionProps): React.JSX.Element {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    mes: string;
    vendas: number;
    pedidos: number;
  } | null>(null);

  // Configurações dimensionais do gráfico de vendas
  const largura = 600;
  const altura = 240;
  const margemEsquerda = 50;
  const margemDireita = 45; // Espaço para a legenda do eixo Y direito (pedidos)
  const margemSuperior = 20;
  const margemInferior = 35;

  const areaLargura = largura - margemEsquerda - margemDireita;
  const areaAltura = altura - margemSuperior - margemInferior;

  // 1. Escala de Vendas (Eixo Y Esquerdo - R$)
  const maiorVenda = Math.max(...vendasMensais.map((item) => item.vendas), 0);
  const maxValorYVendas = Math.max(Math.ceil((maiorVenda || 1000) / 1000) * 1000, 1000);

  // 2. Escala de Pedidos (Eixo Y Direito - Unidades)
  const maiorPedido = Math.max(...vendasMensais.map((item) => item.pedidos), 0);
  const maxValorYPedidos = Math.max(Math.ceil((maiorPedido || 10) / 5) * 5, 5);

  const obterCoordenadas = (
    valor: number,
    indice: number,
    maxValor: number
  ): { x: number; y: number } => {
    const totalPontos = vendasMensais.length;
    const x =
      margemEsquerda +
      (totalPontos <= 1 ? areaLargura / 2 : (indice / (totalPontos - 1)) * areaLargura);

    const proporcao = maxValor > 0 ? valor / maxValor : 0;
    const y = margemSuperior + areaAltura - proporcao * areaAltura;

    return { x, y };
  };

  // Coordenadas calculadas de forma independente com suas respectivas escalas
  const pontosVendas = vendasMensais
    .map((item, indice) => {
      const ponto = obterCoordenadas(item.vendas, indice, maxValorYVendas);
      return `${ponto.x},${ponto.y}`;
    })
    .join(" ");

  const pontosPedidos = vendasMensais
    .map((item, indice) => {
      const ponto = obterCoordenadas(item.pedidos, indice, maxValorYPedidos);
      return `${ponto.x},${ponto.y}`;
    })
    .join(" ");

  // Configurações do gráfico de categorias
  const totalCategorias = categorias.reduce(
    (total, categoria) => total + categoria.quantidade,
    0
  );

  const PALETA_FALLBACK = [
    "#142952", // Azul marinho
    "#4a5c3a", // Verde oliva
    "#D4AF37", // Dourado
    "#334155", // Slate
    "#e11d48", // Rose
    "#0284c7", // Sky
  ];

  // Garante que a fatia da pizza e a legenda utilizem exatamente as mesmas cores
  const categoriasNormalizadas = categorias.map((cat, idx) => ({
    ...cat,
    corFinal: cat.cor || PALETA_FALLBACK[idx % PALETA_FALLBACK.length],
    percentualCalculado:
      totalCategorias > 0 ? (cat.quantidade / totalCategorias) * 100 : cat.porcentagem || 0,
  }));

  const gerarGraficoPizza = () => {
    if (categoriasNormalizadas.length === 0 || totalCategorias === 0) {
      return "conic-gradient(#E2E8F0 0% 100%)";
    }

    let acumulado = 0;
    const partes = categoriasNormalizadas.map((cat) => {
      const inicio = acumulado;
      acumulado += cat.percentualCalculado;
      return `${cat.corFinal} ${inicio}% ${acumulado}%`;
    });

    return `conic-gradient(${partes.join(", ")})`;
  };

  const formatarEixoYVendas = (valor: number): string => {
    if (valor >= 1000) return `${Math.round(valor / 1000)}k`;
    return String(valor);
  };

  const niveisDivisoes = [4, 3, 2, 1, 0];

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Vendas e Pedidos Mensais */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Visão geral de vendas</h2>
            <p className="text-xs text-slate-400 mt-1">
              Acompanhamento mensal de receita (R$) e pedidos
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
              <span className="text-xs text-slate-500 font-medium">Receita (R$)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="text-xs text-slate-500 font-medium">Pedidos</span>
            </div>
          </div>
        </div>

        {vendasMensais.length > 0 ? (
          <div className="w-full overflow-x-auto relative">
            <svg
              viewBox={`0 0 ${largura} ${altura}`}
              className="w-full min-w-[480px]"
              role="img"
              aria-label="Gráfico mensal de vendas e pedidos"
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Linhas de grade e eixos Y (Esquerdo para R$, Direito para Pedidos) */}
              {niveisDivisoes.map((fator, idx) => {
                const y = margemSuperior + (idx / 4) * areaAltura;
                const valorVenda = (maxValorYVendas / 4) * fator;
                const valorPedido = Math.round((maxValorYPedidos / 4) * fator);

                return (
                  <g key={idx}>
                    <line
                      x1={margemEsquerda}
                      y1={y}
                      x2={largura - margemDireita}
                      y2={y}
                      stroke="#F1F5F9"
                      strokeDasharray="3 3"
                    />

                    {/* Eixo Esquerdo: Vendas em R$ */}
                    <text
                      x={margemEsquerda - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94A3B8"
                    >
                      {formatarEixoYVendas(valorVenda)}
                    </text>

                    {/* Eixo Direito: Quantidade de Pedidos */}
                    <text
                      x={largura - margemDireita + 8}
                      y={y + 4}
                      textAnchor="start"
                      fontSize="10"
                      fill="#64748B"
                    >
                      {valorPedido}
                    </text>
                  </g>
                );
              })}

              {/* Linha de Vendas (Amarela/Dourada) */}
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

              {/* Linha de Pedidos (Escura) */}
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

              {/* Pontos clicáveis / hover */}
              {vendasMensais.map((item, indice) => {
                const pontoVenda = obterCoordenadas(item.vendas, indice, maxValorYVendas);
                const pontoPedido = obterCoordenadas(item.pedidos, indice, maxValorYPedidos);

                return (
                  <g
                    key={`${item.mes}-${indice}`}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setTooltip({
                        x: pontoVenda.x,
                        y: pontoVenda.y,
                        mes: item.mes,
                        vendas: item.vendas,
                        pedidos: item.pedidos,
                      })
                    }
                  >
                    {/* Ponto Venda */}
                    <circle
                      cx={pontoVenda.x}
                      cy={pontoVenda.y}
                      r="4"
                      fill="#D4AF37"
                      className="transition-transform hover:scale-125"
                    />

                    {/* Ponto Pedido */}
                    <circle
                      cx={pontoPedido.x}
                      cy={pontoPedido.y}
                      r="4"
                      fill="#334155"
                      className="transition-transform hover:scale-125"
                    />

                    {/* Rótulo do Mês no Eixo X */}
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

            {/* Tooltip ao passar o mouse sobre o ponto */}
            {tooltip && (
              <div
                className="absolute pointer-events-none bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-lg z-10 -translate-x-1/2 -translate-y-full mb-2"
                style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
              >
                <p className="font-bold text-amber-400">{tooltip.mes}</p>
                <p>
                  Receita:{" "}
                  {tooltip.vendas.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>Pedidos: {tooltip.pedidos}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-16">
            Nenhum dado de vendas disponível.
          </p>
        )}
      </div>

      {/* Gráfico de Categorias */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-800">Vendas por categoria</h2>
          <p className="text-xs text-slate-400 mt-1">Distribuição dos pedidos por categoria</p>
        </div>

        {categoriasNormalizadas.length > 0 && totalCategorias > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
            {/* Gráfico Donut */}
            <div
              className="w-44 h-44 rounded-full shrink-0 transition-transform duration-300"
              style={{ background: gerarGraficoPizza() }}
              role="img"
              aria-label="Distribuição percentual dos pedidos por categoria"
            >
              <div className="w-24 h-24 bg-white rounded-full m-auto relative top-10 flex flex-col items-center justify-center shadow-inner">
                <span className="text-xl font-bold text-slate-800">
                  {totalCategorias.toLocaleString("pt-BR")}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Pedidos</span>
              </div>
            </div>

            {/* Legenda com Cores Perfeitamente Sincronizadas */}
            <div className="flex flex-col gap-3.5 w-full max-w-[240px]">
              {categoriasNormalizadas.map((categoria, indice) => (
                <div
                  key={`${categoria.nome}-${indice}`}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shrink-0 shadow-xs"
                      style={{ backgroundColor: categoria.corFinal }}
                    />
                    <span className="text-slate-600 truncate font-medium">
                      {categoria.nome}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-800 whitespace-nowrap">
                    <span className="text-slate-400 text-[11px]">
                      ({categoria.quantidade} {categoria.quantidade === 1 ? 'pedido' : 'pedidos'})
                    </span>
                    <span className="font-bold">
                      {categoria.percentualCalculado.toFixed(1)}%
                    </span>
                  </div>
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
