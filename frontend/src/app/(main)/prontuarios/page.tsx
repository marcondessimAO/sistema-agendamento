"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProntuariosPage() {
  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [atendimentoId, setAtendimentoId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [medicacao, setMedicacao] = useState("");
  const router = useRouter();

  const fetchProntuarios = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch("http://localhost:8082/api/prontuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProntuarios(await res.json());
      else if (res.status === 401) router.push("/login");
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProntuarios(); }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch("http://localhost:8082/api/prontuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          atendimento: { id: parseInt(atendimentoId) },
          observacoes_clinicas: observacoes,
          medicacao_prescrita: medicacao,
        }),
      });
      if (res.ok) {
        await fetchProntuarios();
        setShowForm(false);
        setAtendimentoId("");
        setObservacoes("");
        setMedicacao("");
      } else {
        alert("Falha ao salvar prontuário.");
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    border: "1.5px solid #E0E7EF", backgroundColor: "#F8FAFC", color: "#263238",
    borderRadius: "0.75rem", padding: "0.6rem 1rem", fontSize: "0.875rem",
    outline: "none", width: "100%",
  };

  return (
    <main className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--ic-text-muted)" }}>
            Gestão Clínica
          </p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ic-text)" }}>
            Prontuários
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 self-start md:self-auto"
          style={{
            background: showForm
              ? "#E53E3E"
              : "linear-gradient(135deg, var(--ic-blue-light) 0%, var(--ic-blue) 100%)",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showForm ? "Cancelar" : "Gerar Prontuário"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-8"
          style={{ border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 className="text-base font-bold mb-5" style={{ color: "var(--ic-text)" }}>
            Novo Prontuário
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                ID do Atendimento
              </label>
              <input type="number" required value={atendimentoId}
                onChange={(e) => setAtendimentoId(e.target.value)}
                style={inputStyle} placeholder="Ex: 1" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                Observações Clínicas
              </label>
              <textarea
                required rows={3} value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Descreva as observações clínicas do paciente..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                Medicação Prescrita
              </label>
              <textarea
                required rows={2} value={medicacao}
                onChange={(e) => setMedicacao(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Ex: Paracetamol 500mg, 8/8h..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit" disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-60 min-w-[180px]"
                style={{ background: "linear-gradient(135deg, var(--ic-blue-light) 0%, var(--ic-blue) 100%)" }}>
                {loading ? "Salvando..." : "Guardar Prontuário"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: "var(--ic-text)" }}>
          Registros
        </h2>
        <span className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(34,114,204,0.08)", color: "var(--ic-blue)" }}>
          {prontuarios.length} registros
        </span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--ic-border)" }}>
              {["#", "Observações Clínicas", "Medicação Prescrita"].map((h) => (
                <th key={h}
                  className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--ic-text-muted)", backgroundColor: "#F8FAFC" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prontuarios.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      style={{ color: "var(--ic-border)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: "var(--ic-text-muted)" }}>
                      Nenhum prontuário encontrado
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              prontuarios.map((p: any) => (
                <tr key={p.id} className="hover:bg-[#F4F7FB] transition-colors"
                  style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td className="px-6 py-4 font-semibold text-sm" style={{ color: "var(--ic-blue)" }}>
                    #{p.id}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs" style={{ color: "var(--ic-text)" }}>
                    <p className="truncate">{p.observacoes_clinicas || p.observacoes || "—"}</p>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs" style={{ color: "var(--ic-text-muted)" }}>
                    <p className="truncate">{p.medicacao_prescrita || p.medicacao || "—"}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
