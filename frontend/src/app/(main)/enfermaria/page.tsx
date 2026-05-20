"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/StatCard";

export default function EnfermariaPage() {
  const [leitos, setLeitos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [leitoId, setLeitoId] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [status, setStatus] = useState("EM_OBSERVACAO");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchLeitos = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch("http://localhost:8082/api/enfermarias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setLeitos(await res.json());
      else if (res.status === 401) router.push("/login");
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchLeitos(); }, [router]);

  const handleRegistar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch("http://localhost:8082/api/registros-enfermaria", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          enfermaria: { id: parseInt(leitoId) },
          paciente: { id: parseInt(pacienteId) },
          status,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setLeitoId("");
        setPacienteId("");
        fetchLeitos();
      } else {
        alert("Erro ao registar entrada.");
      }
    } catch {
      alert("Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const displayLeitos = leitos.length > 0 ? leitos : [
    { id: 1, numeroLeito: "101A", setor: "Cardiologia", status: "OCUPADO" },
    { id: 2, numeroLeito: "101B", setor: "Cardiologia", status: "LIVRE" },
    { id: 3, numeroLeito: "205",  setor: "Pediatria",   status: "LIVRE" },
    { id: 4, numeroLeito: "310",  setor: "Ortopedia",   status: "LIVRE" },
    { id: 5, numeroLeito: "311",  setor: "Ortopedia",   status: "OCUPADO" },
    { id: 6, numeroLeito: "401",  setor: "UTI",         status: "OCUPADO" },
  ];

  const ocupados = displayLeitos.filter((l) => l.status === "OCUPADO").length;
  const livres   = displayLeitos.filter((l) => l.status !== "OCUPADO").length;
  const total    = displayLeitos.length;
  const taxaOcup = total ? Math.round((ocupados / total) * 100) : 0;

  const inputStyle = {
    border: "1.5px solid #E0E7EF",
    backgroundColor: "#F8FAFC",
    color: "#263238",
    borderRadius: "0.75rem",
    padding: "0.6rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
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
            Enfermaria e Leitos
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 self-start md:self-auto"
          style={{ background: showForm ? "#E53E3E" : "linear-gradient(135deg, var(--ic-blue-light) 0%, var(--ic-blue) 100%)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showForm ? "Cancelar" : "Registar Entrada"}
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard title="Leitos Ocupados" value={ocupados} color="red"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard title="Leitos Livres" value={livres} color="green"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
        />
        <StatCard title="Taxa de Ocupação" value={`${taxaOcup}%`} color="orange"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-8"
          style={{ border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 className="text-base font-bold mb-5" style={{ color: "var(--ic-text)" }}>
            Registar Entrada de Paciente
          </h2>
          <form onSubmit={handleRegistar} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                ID do Paciente
              </label>
              <input type="number" required value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)} style={inputStyle} placeholder="Ex: 1" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                Leito
              </label>
              <select required value={leitoId} onChange={(e) => setLeitoId(e.target.value)} style={inputStyle}>
                <option value="">Selecione um leito livre...</option>
                {displayLeitos.filter((l) => l.status !== "OCUPADO").map((l) => (
                  <option key={l.id} value={l.id}>{l.numeroLeito} — {l.setor}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                Status Inicial
              </label>
              <select required value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                <option value="EM_OBSERVACAO">Em Observação</option>
                <option value="INTERNADO">Internado</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white h-[42px] transition-all hover:brightness-110 disabled:opacity-60 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #00C896, #008060)" }}>
              {loading ? "Registando..." : "Confirmar"}
            </button>
          </form>
        </div>
      )}

      {/* Bed Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: "var(--ic-text)" }}>Mapa de Leitos</h2>
        <span className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(34,114,204,0.08)", color: "var(--ic-blue)" }}>
          {total} leitos no total
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayLeitos.map((leito) => {
          const ocupado = leito.status === "OCUPADO";
          return (
            <div
              key={leito.id}
              className="rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-default"
              style={{
                backgroundColor: "white",
                border: `1.5px solid ${ocupado ? "rgba(229,62,62,0.25)" : "rgba(0,200,150,0.25)"}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Bed icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: ocupado ? "rgba(229,62,62,0.08)" : "rgba(0,200,150,0.08)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  style={{ color: ocupado ? "#C53030" : "#008060" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
              </div>
              <p className="font-bold text-base mb-0.5" style={{ color: "var(--ic-text)" }}>
                {leito.numeroLeito}
              </p>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--ic-text-muted)" }}>
                {leito.setor}
              </p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{
                  backgroundColor: ocupado ? "rgba(229,62,62,0.1)" : "rgba(0,200,150,0.1)",
                  color: ocupado ? "#C53030" : "#008060",
                }}
              >
                {ocupado ? "Ocupado" : "Livre"}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
