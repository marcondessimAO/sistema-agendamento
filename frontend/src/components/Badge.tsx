import React from "react";

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  EM_ESPERA:    { label: "Em Espera",    bg: "rgba(255,132,16,0.1)",  color: "#C96A00" },
  EM_ATENDIMENTO: { label: "Em Atend.", bg: "rgba(34,114,204,0.1)",  color: "#2272CC" },
  CONCLUIDO:    { label: "Concluído",    bg: "rgba(0,200,150,0.1)",   color: "#008060" },
  FINALIZADO:   { label: "Finalizado",   bg: "rgba(0,200,150,0.1)",   color: "#008060" },
  CANCELADO:    { label: "Cancelado",    bg: "rgba(229,62,62,0.1)",   color: "#C53030" },
};

export function Badge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, bg: "#f1f5f9", color: "#64748b" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export default Badge;
