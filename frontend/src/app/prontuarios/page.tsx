"use client";

import { useState, useEffect } from "react";

export default function ProntuariosPage() {
  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [atendimentoId, setAtendimentoId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [medicacao, setMedicacao] = useState("");

  const fetchProntuarios = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/prontuarios");
      if (res.ok) {
        const data = await res.json();
        setProntuarios(data);
      }
    } catch (e) {
      console.error("Erro ao carregar prontuários");
    }
  };

  useEffect(() => {
    fetchProntuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8082/api/prontuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          atendimento: { id: parseInt(atendimentoId) },
          observacoes_clinicas: observacoes,
          medicacao_prescrita: medicacao
        })
      });
      
      if (response.ok) {
        alert("Prontuário gerado com sucesso!");
        fetchProntuarios(); // refresh list
        setShowForm(false);
        setAtendimentoId("");
        setObservacoes("");
        setMedicacao("");
      } else {
        alert("Falha ao salvar prontuário na API.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor local.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-7xl mx-auto w-full flex-1">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Prontuários</h1>
          <p className="text-gray-500 text-sm">Gestão de prontuários médicos e observações clínicas.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          {showForm ? "Cancelar" : "Gerar Prontuário"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Novo Prontuário</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Atendimento (ID)</label>
              <input type="number" required value={atendimentoId} onChange={(e) => setAtendimentoId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" placeholder="Ex: 1" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Observações Clínicas</label>
              <textarea required rows={3} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medicação Prescrita</label>
              <textarea required rows={2} value={medicacao} onChange={(e) => setMedicacao(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"></textarea>
            </div>
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={loading} className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center min-w-[200px]">
                {loading ? "Salvando na API..." : "Guardar Prontuário"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Observações</th>
              <th className="px-6 py-4">Medicação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {prontuarios.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">Nenhum prontuário encontrado.</td>
              </tr>
            ) : (
              prontuarios.map((p: any) => (
                <tr key={p.id} className="hover:bg-blue-50/30">
                  <td className="px-6 py-4 font-medium">#{p.id}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{p.observacoes_clinicas || p.observacoes}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{p.medicacao_prescrita || p.medicacao}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
