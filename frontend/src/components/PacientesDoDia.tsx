"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Atendimento {
  id: number;
  dataHora: string;
  status: string;
  paciente?: { nome?: string };
}

const statusDot: Record<string, string> = {
  EM_ESPERA:      "#F59E0B",
  EM_ATENDIMENTO: "#2272CC",
  CONCLUIDO:      "#10B981",
  FINALIZADO:     "#10B981",
  CANCELADO:      "#EF4444",
};

function timeOnly(iso: string) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }
  catch { return ""; }
}

function isToday(iso: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const n = new Date();
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}

export default function PacientesDoDia() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:8082/api/atendimentos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Atendimento[]) =>
        setAtendimentos(data.filter((a) => a.dataHora && isToday(a.dataHora)).slice(0, 10))
      )
      .catch(() => {});
  }, []);

  return (
    <aside
      className="w-44 flex-shrink-0 flex flex-col h-full overflow-y-auto"
      style={{ borderRight: "1px solid var(--ic-border)", backgroundColor: "var(--ic-surface)" }}
    >
      <div className="px-3 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--ic-border-light)" }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ic-text-muted)" }}>
          Pacientes do dia
        </p>
      </div>

      <div className="flex-1 py-2">
        {atendimentos.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-xs" style={{ color: "#B0BEC5" }}>Nenhum paciente agendado hoje</p>
          </div>
        ) : (
          atendimentos.map((a) => (
            <div
              key={a.id}
              className="px-3 py-2 hover:bg-[#F8FAFC] transition-colors cursor-pointer border-b"
              style={{ borderColor: "#F1F5F9" }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold" style={{ color: "#546E7A" }}>
                  {timeOnly(a.dataHora)}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusDot[a.status] ?? "#B0BEC5" }}
                />
              </div>
              <p
                className="text-xs font-medium truncate"
                style={{ color: "#263238", maxWidth: "120px" }}
              >
                {a.paciente?.nome ?? `Paciente #${a.id}`}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Promo footer */}
      <div
        className="p-3 flex-shrink-0 text-center"
        style={{ borderTop: "1px solid var(--ic-border-light)", backgroundColor: "var(--ic-surface-2)" }}
      >
        <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4AA4F2, #2272CC)" }}>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-[10px] font-semibold mb-2" style={{ color: "#546E7A" }}>
          Gerencie os prontuários dos seus pacientes
        </p>
        <Link
          href="/prontuarios"
          className="text-[10px] font-bold px-2 py-1 rounded-lg inline-block"
          style={{ backgroundColor: "rgba(34,114,204,0.1)", color: "#2272CC" }}
        >
          Ver Prontuários
        </Link>
      </div>
    </aside>
  );
}
