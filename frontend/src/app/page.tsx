import React from 'react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import AtendimentoTable from '@/components/AtendimentoTable';

export default async function Dashboard() {
  let atendimentos = [];
  try {
    const res = await fetch("http://localhost:8082/atendimentos", {
      cache: "no-store",
    });
    if (res.ok) {
      atendimentos = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch atendimentos:", error);
  }

  const total = atendimentos.length;
  const emEspera = atendimentos.filter((a: any) => a.status === 'EM_ESPERA').length;
  const concluidos = atendimentos.filter((a: any) => a.status === 'CONCLUIDO' || a.status === 'FINALIZADO').length;

  return (
    <main className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Visão Geral</h1>
          <p className="text-gray-500 text-sm">Resumo dos agendamentos e atividades de hoje.</p>
        </div>
        <Link 
          href="/agendar" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Novo Agendamento
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total de Atendimentos" 
          value={total} 
          trend="12%" 
          trendUp={true}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <StatCard 
          title="Fila de Espera" 
          value={emEspera} 
          trend="4%"
          trendUp={false}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          title="Concluídos Hoje" 
          value={concluidos} 
          trend="8%"
          trendUp={true}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Agendamentos Recentes</h2>
      </div>
      
      <AtendimentoTable atendimentos={atendimentos} />
    </main>
  );
}
