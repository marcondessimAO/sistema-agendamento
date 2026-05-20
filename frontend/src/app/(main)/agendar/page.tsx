"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AgendarPage() {
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token") || "";
    try {
      const res = await fetch("http://localhost:8082/api/atendimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          paciente: { id: parseInt(pacienteId) },
          medico:   { id: parseInt(medicoId) },
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 1500);
      } else {
        alert("Erro ao agendar. Verifique os IDs informados.");
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
    <main className="p-8 max-w-2xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ic-text-muted)" }}>
        <Link href="/" className="hover:underline transition-colors" style={{ color: "var(--ic-blue)" }}>
          Dashboard
        </Link>
        <span>/</span>
        <span>Novo Agendamento</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ic-text)" }}>
          Novo Agendamento
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--ic-text-muted)" }}>
          Preencha os dados abaixo para agendar uma nova consulta.
        </p>
      </div>

      {success && (
        <div className="mb-6 px-5 py-4 rounded-2xl flex items-center gap-3"
          style={{ backgroundColor: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)" }}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: "#008060" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold" style={{ color: "#008060" }}>
            Agendamento criado! Redirecionando...
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8"
        style={{ border: "1px solid var(--ic-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Paciente */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
              ID do Paciente
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: "var(--ic-text-muted)", width: 18, height: 18 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="number" required min="1" placeholder="Ex: 1045"
                value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                onFocus={(e) => (e.target.style.borderColor = "#2272CC")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E7EF")}
              />
            </div>
          </div>

          {/* Médico */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
              ID do Médico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: "var(--ic-text-muted)", width: 18, height: 18 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="number" required min="1" placeholder="Ex: 213"
                value={medicoId} onChange={(e) => setMedicoId(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                onFocus={(e) => (e.target.style.borderColor = "#2272CC")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E7EF")}
              />
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--ic-border)", paddingTop: "1.5rem" }}
            className="flex justify-end gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: "var(--ic-text-muted)", backgroundColor: "#F4F7FB" }}
            >
              Cancelar
            </Link>
            <button
              type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--ic-blue-light) 0%, var(--ic-blue) 100%)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Agendando...
                </>
              ) : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
