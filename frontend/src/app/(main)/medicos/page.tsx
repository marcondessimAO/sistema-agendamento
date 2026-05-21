"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle = {
  border: "1.5px solid var(--ic-border)",
  backgroundColor: "var(--ic-surface-2)",
  color: "var(--ic-text)",
  borderRadius: "0.75rem",
  padding: "0.625rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "100%",
};

const focusOn  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "var(--ic-blue)");
const focusOff = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "var(--ic-border)");

export default function MedicosPage() {
  const [medicos, setMedicos]     = useState<any[]>([]);
  const [showForm, setShowForm]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState("");
  const [formError, setFormError] = useState("");

  // form fields
  const [nome, setNome]       = useState("");
  const [email, setEmail]     = useState("");
  const [senha, setSenha]     = useState("");
  const [crm, setCrm]         = useState("");

  const router = useRouter();

  const getToken = () => {
    const t = localStorage.getItem("token");
    if (!t) { router.push("/login"); return ""; }
    return t;
  };

  const fetchMedicos = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8082/api/medicos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMedicos(await res.json());
      else if (res.status === 401) router.push("/login");
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchMedicos(); }, [router]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8082/api/medicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, senha, crm, perfil: "MEDICO" }),
      });

      if (res.ok) {
        setSuccess("Médico cadastrado com sucesso!");
        setNome(""); setEmail(""); setSenha(""); setCrm("");
        setShowForm(false);
        setFormError("");
        await fetchMedicos();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        try {
          const body = await res.json();
          setFormError(body.mensagem ?? body.erro ?? "Erro ao cadastrar médico. Verifique os dados.");
        } catch {
          setFormError("Erro ao cadastrar médico. Verifique os dados.");
        }
      }
    } catch {
      setFormError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Avatar initials helper
  const initials = (nome: string) =>
    nome ? nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "M";

  return (
    <main className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--ic-text-muted)" }}>Cadastros</p>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--ic-text)" }}>Médicos</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: "rgba(34,114,204,0.08)", color: "var(--ic-blue)" }}>
            {medicos.length} registros
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
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
            {showForm ? "Cancelar" : "Cadastrar Médico"}
          </button>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-6 px-5 py-4 rounded-2xl flex items-center gap-3"
          style={{ backgroundColor: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)" }}>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: "#008060" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold" style={{ color: "#008060" }}>{success}</p>
        </div>
      )}

      {/* Cadastro Form */}
      {showForm && (
        <div className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: "var(--ic-surface)", border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <h2 className="text-base font-bold mb-4" style={{ color: "var(--ic-text)" }}>Novo Médico</h2>

          {/* Inline error */}
          {formError && (
            <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium"
              style={{ backgroundColor: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.2)", color: "var(--ic-danger)" }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formError}
            </div>
          )}
          <form onSubmit={handleCadastrar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--ic-text)" }}>
                  Nome completo <span style={{ color: "var(--ic-danger)" }}>*</span>
                </label>
                <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
                  placeholder="Dr. João Silva" style={inputStyle}
                  onFocus={focusOn} onBlur={focusOff} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--ic-text)" }}>
                  CRM <span style={{ color: "var(--ic-danger)" }}>*</span>
                </label>
                <input type="text" required value={crm} onChange={(e) => setCrm(e.target.value)}
                  placeholder="Ex: CRM/SP 123456" style={inputStyle}
                  onFocus={focusOn} onBlur={focusOff} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--ic-text)" }}>
                  E-mail <span style={{ color: "var(--ic-danger)" }}>*</span>
                </label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="medico@clinica.com" style={inputStyle}
                  onFocus={focusOn} onBlur={focusOff} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--ic-text)" }}>
                  Senha de acesso <span style={{ color: "var(--ic-danger)" }}>*</span>
                </label>
                <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres" style={inputStyle}
                  onFocus={focusOn} onBlur={focusOff} />
              </div>
            </div>
            <div className="flex justify-end gap-3" style={{ borderTop: "1px solid var(--ic-border)", paddingTop: "1rem" }}>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ color: "var(--ic-text-muted)", backgroundColor: "var(--ic-surface-2)" }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-60 min-w-[140px]"
                style={{ background: "linear-gradient(135deg, var(--ic-blue-light) 0%, var(--ic-blue) 100%)" }}>
                {loading ? "Salvando..." : "Cadastrar Médico"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--ic-surface)", border: "1px solid var(--ic-border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--ic-border)" }}>
              {["#", "Médico", "E-mail", "CRM"].map((h) => (
                <th key={h} className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--ic-text-muted)", backgroundColor: "var(--ic-surface-2)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: "rgba(34,114,204,0.08)" }}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        style={{ color: "var(--ic-blue)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--ic-text)" }}>Nenhum médico cadastrado</p>
                      <p className="text-xs mt-1" style={{ color: "var(--ic-text-muted)" }}>
                        Clique em &quot;Cadastrar Médico&quot; para adicionar o primeiro.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              medicos.map((m) => (
                <tr key={m.id} className="hover:bg-[#F4F7FB] transition-colors"
                  style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td className="px-6 py-4 font-semibold text-sm w-16" style={{ color: "var(--ic-blue)" }}>
                    #{m.id}
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--ic-text)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                        style={{ background: "linear-gradient(135deg, #4AA4F2, #2272CC)" }}>
                        {initials(m.nome ?? "")}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--ic-text)" }}>
                          {m.nome ?? <span style={{ color: "var(--ic-text-muted)", fontStyle: "italic" }}>Sem nome</span>}
                        </p>
                        <p className="text-xs" style={{ color: "var(--ic-text-muted)" }}>Médico</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--ic-text-muted)" }}>
                    {m.email ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    {m.crm ? (
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: "rgba(34,114,204,0.08)", color: "var(--ic-blue)" }}>
                        {m.crm}
                      </span>
                    ) : (
                      <span style={{ color: "var(--ic-text-muted)" }}>—</span>
                    )}
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
