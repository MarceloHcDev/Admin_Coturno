// src/components/organisms/ChartsSection.tsx
import React, { useState } from 'react';
import { ChartHeader } from '../molecules/Chartheader';

// Interface para os dados brutos de entrada do JSON
export interface ProdutoCategoria {
  nome: string;
  quantidade: number;
}

export interface DadosCategoriasJSON {
  produtos: ProdutoCategoria[];
}

// Interfaces para os estados e tipos calculados do gráfico
export interface VendaMensal {
  mes: string;
  vendas: number;
  pedidos: number;
}

export interface CategoriaGrafico {
  nome: string;
  porcentagem: number;
  cor: string;
  classesTexto: string;
}

export interface Coordenada {
  x: number;
  y: number;
}

// 1) Arquivo JSON simulado contendo a quantidade de cada categoria
const DADOS_CATEGORIAS_JSON: DadosCategoriasJSON = {
  produtos: [
    { nome: "Coturno", quantidade: 35 },
    { nome: "Sapato social", quantidade: 20 },
    { nome: "Borzeguim", quantidade: 21 }
  ]
};

// 2) Soma dinamicamente os produtos para garantir que o total represente 100%
const calcularPorcentagens = (dadosJson: DadosCategoriasJSON): { nome: string; porcentagem: number }[] => {
  const totalGeral = dadosJson.produtos.reduce((acc, item) => acc + item.quantidade, 0) || 1;
  
  return dadosJson.produtos.map(item => {
    const calculoPct = (item.quantidade / totalGeral) * 100;
    return {
      nome: item.nome,
      porcentagem: Math.round(calculoPct)
    };
  });
};

// 3) Armazena esses valores calculados em uma variável de escopo
const porcentagensCalculadas = calcularPorcentagens(DADOS_CATEGORIAS_JSON);

const obterPctPorNome = (nome: string): number => {
  const categoriaEncontrada = porcentagensCalculadas.find(c => c.nome === nome);
  return categoriaEncontrada ? categoriaEncontrada.porcentagem : 0;
};

const DADOS_INICIAIS: { vendasMensais: VendaMensal[]; categorias: CategoriaGrafico[] } = {
  vendasMensais: [
    { mes: 'Jan', vendas: 2000, pedidos: 1000 },
    { mes: 'Fev', vendas: 3900, pedidos: 234 },
    { mes: 'Mar', vendas: 3100, pedidos: 234 },
    { mes: 'Abr', vendas: 5400, pedidos: 234 },
    { mes: 'Mai', vendas: 6500, pedidos: 234 },
    { mes: 'Jun', vendas: 6000, pedidos: 8000 },
    { mes: 'Jul', vendas: 2000, pedidos: 1000 },
    { mes: 'Ago', vendas: 3900, pedidos: 234 },
    { mes: 'Set', vendas: 3100, pedidos: 234 },
    { mes: 'Out', vendas: 5400, pedidos: 234 },
    { mes: 'Nov', vendas: 6500, pedidos: 234 },
    { mes: 'Dez', vendas: 6000, pedidos: 8000 },
  ],
  categorias: [
    { nome: 'Coturno', porcentagem: obterPctPorNome('Coturno'), cor: '#142952', classesTexto: 'text-azul' },
    { nome: 'Sapato social', porcentagem: obterPctPorNome('Sapato social'), cor: '#000000', classesTexto: 'text-preto' },
    { nome: 'Borzeguim', porcentagem: obterPctPorNome('Borzeguim'), cor: '#4a5c3a', classesTexto: 'text-army' }
  ]
};

export const ChartsSection: React.FC = () => {
  const [dadosDashboard] = useState(DADOS_INICIAIS);
  const { vendasMensais, categorias } = dadosDashboard;

  // --- CONFIGURAÇÕES DO GRÁFICO DE LINHAS (SVG) ---
  const svgWidth = 500;
  const svgHeight = 100;
  const maxValorY = 8000; 
  const totalPontos = vendasMensais.length;

  const obterCoordenadas = (index: number, valor: number): Coordenada => {
    const valorNumerico = Number(valor) || 0;
    const x = 15 + (index / (totalPontos - 1)) * (svgWidth - 30);
    const y = svgHeight - (valorNumerico / maxValorY) * svgHeight;
    return { x, y };
  };

  const pointsVendas = vendasMensais.map((d, i) => obterCoordenadas(i, d.vendas));
  const pointsPedidos = vendasMensais.map((d, i) => obterCoordenadas(i, d.pedidos));

  const gerarCaminhoSuave = (pontos: Coordenada[]): string => {
    if (pontos.length === 0) return '';
    let d = `M ${pontos[0].x} ${pontos[0].y}`;
    for (let i = 0; i < pontos.length - 1; i++) {
      const p0 = pontos[i];
      const p1 = pontos[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathVendas = gerarCaminhoSuave(pointsVendas);
  const pathPedidos = gerarCaminhoSuave(pointsPedidos);

  // --- CONFIGURAÇÕES AUXILIARES DO GRÁFICO DE PIZZA (PATH REAL) ---
  const centroX = 16;
  const centroY = 16;
  const raio = 16;

  const obterCoordenadasCirculo = (porcentagem: number): Coordenada => {
    const anguloRadianos = ((porcentagem / 100) * 360 - 90) * (Math.PI / 180);
    return {
      x: centroX + raio * Math.cos(anguloRadianos),
      y: centroY + raio * Math.sin(anguloRadianos)
    };
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full items-start">
      
      {/* Bloco 1: Vendas Mensais */}
      <div className="bg-white pt-6 pe-8 ps-6 pb-5 rounded-xl border border-slate-300 shadow-sm lg:col-span-3 h-70 flex flex-col justify-between">
        <ChartHeader title="Vendas Mensais" />
        
        <div className="w-full flex justify-left items-left gap-4 text-xs font-semibold mt-1">
          <div className="flex items-center gap-1 text-blue-400">
            <span className="font-bold">∘–</span>
            <span>Vendas (R$)</span>
          </div>
          <div className="flex items-center gap-1 text-red">
            <span className="font-bold text-blue">∘–</span>
            <span>Pedidos</span>
          </div>
        </div>

        <div className="w-full flex-1 relative mt-4 flex flex-col justify-between">
          <div className="absolute inset-0 bottom-8 flex flex-col justify-between text-[11px] text-slate-600 font-medium">
            <div className="w-full border-b border-dashed border-slate-600 flex justify-between"><span>8000</span></div>
            <div className="w-full border-b border-dashed border-slate-600 flex justify-between"><span>6000</span></div>
            <div className="w-full border-b border-dashed border-slate-600 flex justify-between"><span>4000</span></div>
            <div className="w-full border-b border-dashed border-slate-600 flex justify-between"><span>2000</span></div>
            <div className="w-full border-b border-dashed border-slate-600 flex justify-between"><span>0</span></div>
          </div>

          <div className="w-full h-[75%] mt-2 px-5 relative z-10">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              <path d={pathPedidos} fill="none" stroke="#142952" strokeWidth="2" />
              {pointsPedidos.map((p, idx) => (
                <circle key={`ped-node-${idx}`} cx={p.x} cy={p.y} r="3" fill="white" stroke="#121212" strokeWidth="2" />
              ))}

              <path d={pathVendas} fill="none" stroke="#1E90FF" strokeWidth="2.5" />
              {pointsVendas.map((p, idx) => (
                <circle key={`ven-node-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#121212" strokeWidth="2" />
              ))}
            </svg>

            <div className="w-full flex justify-between px-1 text-[10px] text-slate-600 font-medium z-10 mt-3 max-h-1">
              {vendasMensais.map((d, idx) => (
                <span key={`mes-${idx}`}>{d.mes}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 2: Vendas por Categoria */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm lg:col-span-2 flex flex-col h-70 p-5">
        <ChartHeader title="Vendas por Categoria" />
        
        <div className="flex-1 flex items-center justify-center relative mt-4 w-full h-full min-h-0">
          <div className="w-40 h-40 flex items-center justify-center relative">
            
            <div className="w-full h-full">
              <svg className="w-full h-full block overflow-visible" viewBox="0 0 32 32">
                {(() => {
                  let porcentagemAcumulada = 0;
                  
                  return categorias.map((cat, idx) => {
                    const pct = Number(cat.porcentagem) || 0;
                    if (pct <= 0) return null;

                    const inicio = obterCoordenadasCirculo(porcentagemAcumulada);
                    porcentagemAcumulada += pct;
                    const fim = obterCoordenadasCirculo(porcentagemAcumulada);

                    const grandeArcoFlag = pct > 50 ? 1 : 0;

                    const d = `
                      M ${centroX} ${centroY}
                      L ${inicio.x} ${inicio.y}
                      A ${raio} ${raio} 0 ${grandeArcoFlag} 1 ${fim.x} ${fim.y}
                      Z
                    `.trim();

                    return (
                      <path
                        key={`pie-segment-${idx}`}
                        d={d}
                        fill={cat.cor}
                      />
                    );
                  });
                })()}
              </svg>
            </div>

            {/* ETIQUETAS DINÂMICAS */}
            {(() => {
              let faixaInicio = 0;
              return categorias.map((cat, idx) => {
                const pct = Number(cat.porcentagem) || 0;
                if (pct <= 0) return null;
                
                const pontoMedioPct = faixaInicio + (pct / 2);
                faixaInicio += pct;

                const anguloRadianos = ((pontoMedioPct / 100) * 360 - 90) * (Math.PI / 180);
                const raioProjecao = 55; 
                
                const x = 50 + raioProjecao * Math.cos(anguloRadianos);
                const y = 50 + raioProjecao * Math.sin(anguloRadianos);

                return (
                  <span 
                    key={`lbl-dinamica-${idx}`} 
                    className={`absolute text-[10px] sm:text-xs font-semibold ${cat.classesTexto} bg-white/95 px-1.5 py-0.5 rounded shadow-sm border border-slate-100 z-10 whitespace-nowrap transition-all duration-300`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {cat.nome}: {pct}%
                  </span>
                );
              });
            })()}

          </div>
        </div>
      </div>

    </section>
  );
};

export default ChartsSection;