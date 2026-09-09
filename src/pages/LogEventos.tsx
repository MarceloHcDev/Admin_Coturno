import React from 'react';
import Sidebar from '../components/organisms/Sidebar';
import EventTable from '../components/organisms/LogEventsTable';

export default function LogEventos(): React.JSX.Element {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="logs" />
      <main className="flex-1 p-8 ml-64">
        <h1 className="text-2xl font-bold text-slate-900">Log de Eventos</h1>
        <p className="text-slate-600">Área destinada ao monitoramento e auditoria de ações do sistema.</p>
        <EventTable />  
      </main>
    </div>
  );
}