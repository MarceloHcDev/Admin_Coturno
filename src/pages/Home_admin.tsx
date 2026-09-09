import React from "react";
import Sidebar from "../components/organisms/Sidebar";
import { MetricsGrid } from "../components/organisms/MetricsGrid";
import { ChartsSection } from "../components/organisms/ChartsSection";
import { TopProductsSection } from "../components/organisms/TopProductsSection";


/* variável que provavelmente não estava sendo usada

const categoryData: CategoryData[] = [
    { name: "Coturno", value: 35, color: "#3b82f6" },
    { name: "Sapato social", value: 25, color: "#8b5cf6" },
    { name: "Borzeguim", value: 8, color: "#ef4444" },
  ];*/

export default function Home_admin(): React.JSX.Element {
  

  return (
    <div className="flex min-h-screen w-full pe-10 pt-10 bg-slate-50 text-slate-900 antialiased">
      <Sidebar />
      <main className="pl-72 flex-1 overflow-y-auto">
        <header className="mb-2">
          <h1 className="text-2xl font-barlow font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Bem-vindo ao painel administrativo da sua loja de calçados
          </p>
        </header>

        <MetricsGrid />
        <ChartsSection />
        <TopProductsSection />
      </main>
    </div>
  );
}