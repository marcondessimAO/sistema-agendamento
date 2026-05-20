"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle = {
  border: "1.5px solid #E0E7EF",
  backgroundColor: "#F8FAFC",
  color: "#263238",
  borderRadius: "0.75rem",
  padding: "0.625rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "100%",
};

const focusOn  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#2272CC");
const focusOff = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#E0E7EF");

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const router = useRouter();

  const getToken = () => {
    const t = localStorage.getItem("token");
    if (!t) { router.push("/login"); return ""; }
    return t;
  };

  const fetchPacientes = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8082/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPacientes(await res.json());
      else if (res.status === 401) router.push("/login");
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchPacientes(); }, [router]);

  const initials = (nome: string) =>
    nome ? nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "P";

  const formatDate = (d: string) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("pt-BR"); } catch { return d; }
  };

  return (
    <main className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--ic-text-muted)" }}>Cadastros</p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ic-text)" }}>Pacientes</h1>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full self-start md:self-auto"
          style={{ backgroundColor: "rgba(34,114,204,0.08)", color: "var(--ic-blue)" }}>
          {pacientes.length} registros
        </span>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--ic-border)" }}>
              {["#", "Paciente", "E-mail", "CPF", "Telefone", "Nascimento"].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--ic-text-muted)", backgroundColor: "#F8FAFC" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: "rgba(0,180,216,0.08)" }}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        style={{ color: "#00B4D8" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--ic-text)" }}>Nenhum paciente cadastrado</p>
                      <p className="text-xs mt-1" style={{ color: "var(--ic-text-muted)" }}>Os pacientes aparecerão aqui quando cadastrados.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              pacientes.map((p) => (
                <tr key={p.id} className="hover:bg-[#F4F7FB] transition-colors"
                  style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td className="px-6 py-4 font-semibold text-sm w-16" style={{ color: "var(--ic-blue)" }}>
                    #{p.id}
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--ic-text)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                        style={{ background: "linear-gradient(135deg, #00B4D8, #0077A8)" }}>
                        {initials(p.nome ?? "")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--ic-text)" }}>
                          {p.nome ?? <span style={{ color: "var(--ic-text-muted)", fontStyle: "italic" }}>Sem nome</span>}
                        </p>
                        <p className="text-xs" style={{ color: "var(--ic-text-muted)" }}>Paciente</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--ic-text-muted)" }}>
                    {p.email ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    {p.cpf ? (
                      <span className="font-mono text-xs px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: "#F4F7FB", color: "var(--ic-text)" }}>
                        {p.cpf}
                      </span>
                    ) : (
                      <span style={{ color: "var(--ic-text-muted)" }}>—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--ic-text-muted)" }}>
                    {p.telefone ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--ic-text-muted)" }}>
                    {formatDate(p.dataNascimento)}
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
