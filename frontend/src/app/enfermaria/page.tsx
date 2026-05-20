"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";

export default function EnfermariaPage() {
  const [leitos, setLeitos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [leitoId, setLeitoId] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [status, setStatus] = useState("EM_OBSERVACAO");
  const [loading, setLoading] = useState(false);

  const fetchLeitos = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/enfermarias");
      if (res.ok) {
        const data = await res.json();
        setLeitos(data);
      }
    } catch (e) {
      console.error("Erro ao carregar enfermarias/leitos", e);
    }
  };

  useEffect(() => {
    fetchLeitos();
  }, []);

  const handleRegistar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // POST no RegistroEnfermaria controller (presumivelmente /api/registros-enfermaria)
      const res = await fetch("http://localhost:8082/api/registros-enfermaria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enfermaria: { id: parseInt(leitoId) },
          paciente: { id: parseInt(pacienteId) },
          status: status
        })
      });

      if (res.ok) {
        alert("Entrada registada com sucesso!");
        setShowForm(false);
        setLeitoId("");
        setPacienteId("");
        fetchLeitos(); // reload data
      } else {
        alert("Erro ao registar entrada na enfermaria.");
      }
    } catch (error) {
      alert("Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Se a API falhar ou estiver vazia, mostramos mocks para que a tela não fique em branco no MVP
  const displayLeitos = leitos.length > 0 ? leitos : [
    { id: 1, numeroLeito: "101A", setor: "Cardiologia", status: "OCUPADO" },
    { id: 2, numeroLeito: "101B", setor: "Cardiologia", status: "LIVRE" },
    { id: 3, numeroLeito: "205", setor: "Pediatria", status: "LIVRE" }
  ];

  const ocupados = displayLeitos.filter(l => l.status === "OCUPADO").length;
  const livres = displayLeitos.filter(l => l.status === "LIVRE" || !l.status).length;

  return (
    <main className="p-8 max-w-7xl mx-auto w-full flex-1">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Enfermaria e Leitos</h1>
          <p className="text-gray-500 text-sm">Dashboard de ocupação e entradas de pacientes.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          {showForm ? "Cancelar" : "Registar Entrada"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard 
          title="Leitos Ocupados" 
          value={ocupados} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard 
          title="Leitos Livres" 
          value={livres} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Registar Entrada de Paciente</h2>
          <form onSubmit={handleRegistar} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID do Paciente</label>
              <input type="number" required value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Leito</label>
              <select required value={leitoId} onChange={(e) => setLeitoId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30">
                <option value="">Selecione um leito livre...</option>
                {displayLeitos.filter(l => l.status === "LIVRE" || !l.status).map(l => (
                  <option key={l.id} value={l.id}>{l.numeroLeito} - {l.setor}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status Inicial</label>
              <select required value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30">
                <option value="EM_OBSERVACAO">Em Observação</option>
                <option value="INTERNADO">Internado</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full md:w-auto bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-emerald-700 h-[42px] transition-all disabled:opacity-70">
              Confirmar
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayLeitos.map(leito => {
          const ocupado = leito.status === "OCUPADO";
          return (
            <div key={leito.id} className={`p-5 rounded-xl border ${ocupado ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg text-gray-900">{leito.numeroLeito}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${ocupado ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {ocupado ? 'Ocupado' : 'Livre'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">{leito.setor}</p>
            </div>
          )
        })}
      </div>
    </main>
  );
}
