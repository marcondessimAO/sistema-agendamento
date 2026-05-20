import React from "react";
import Badge from "./Badge";

export default function AtendimentoTable({ atendimentos }: { atendimentos: any[] }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--ic-border)" }}>
              {["Protocolo", "Data e Hora", "Paciente", "Médico", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--ic-text-muted)", backgroundColor: "#F8FAFC" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {atendimentos.map((a) => (
              <tr
                key={a.id}
                className="group transition-colors hover:bg-[#F4F7FB]"
                style={{ borderBottom: "1px solid #F1F5F9" }}
              >
                <td className="px-6 py-4 font-semibold text-sm" style={{ color: "var(--ic-blue)" }}>
                  #{String(a.id).padStart(4, "0")}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "var(--ic-text-muted)" }}>
                  {a.dataHora
                    ? new Date(a.dataHora).toLocaleString("pt-BR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-6 py-4 font-medium text-sm" style={{ color: "var(--ic-text)" }}>
                  {a.paciente?.nome ?? "—"}
                </td>
                <td className="px-6 py-4 text-sm" style={{ color: "var(--ic-text-muted)" }}>
                  {a.medico?.nome ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <Badge status={a.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all px-3 py-1.5 rounded-lg"
                    style={{ color: "var(--ic-blue)", backgroundColor: "rgba(34,114,204,0.08)" }}
                  >
                    Detalhes →
                  </button>
                </td>
              </tr>
            ))}
            {atendimentos.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      style={{ color: "var(--ic-border)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: "var(--ic-text-muted)" }}>
                      Nenhum atendimento registado
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
