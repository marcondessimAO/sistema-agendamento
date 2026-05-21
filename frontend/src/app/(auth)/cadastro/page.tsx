"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const perfis = [
  { value: "MEDICO", label: "Médico" },
  { value: "PACIENTE", label: "Paciente" },
];

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("MEDICO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8082/api/usuarios/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, perfil }),
      });

      if (response.ok) {
        router.push("/login?registered=1");
      } else {
        // Lê a mensagem específica que o backend envia (campo "mensagem")
        try {
          const body = await response.json();
          setError(body.mensagem ?? body.erro ?? "Erro ao criar conta. Verifique os dados.");
        } catch {
          setError("Erro ao criar conta. Verifique os dados e tente novamente.");
        }
      }
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    border: "1.5px solid #E0E7EF",
    backgroundColor: "#F8FAFC",
    color: "#263238",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#F4F7FB", fontFamily: "'Inter', Verdana, sans-serif" }}>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4AA4F2, #2272CC)" }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-4h-2v-1l4-4v9z" />
            </svg>
          </div>
          <span className="font-bold text-lg" style={{ color: "#1C2B4A" }}>MediSchedule</span>
        </div>

        <div className="bg-white rounded-2xl p-8"
          style={{ border: "1px solid #E0E7EF", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#263238" }}>Criar conta</h1>
          <p className="text-sm mb-7" style={{ color: "#78909C" }}>
            Preencha os dados abaixo para se cadastrar
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "rgba(229,62,62,0.08)", color: "#C53030", border: "1px solid rgba(229,62,62,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>Nome completo</label>
              <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
                placeholder="Dr. João Silva"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2272CC")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E7EF")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2272CC")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E7EF")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>Senha</label>
              <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2272CC")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E7EF")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>Perfil de acesso</label>
              <select value={perfil} onChange={(e) => setPerfil(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}>
                {perfis.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white mt-2 transition-all hover:brightness-110 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #4AA4F2 0%, #2272CC 100%)" }}>
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: "#78909C" }}>
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "#2272CC" }}>
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
