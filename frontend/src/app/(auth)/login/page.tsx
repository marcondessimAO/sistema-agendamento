"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8082/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError("E-mail ou senha inválidos. Tente novamente.");
      }
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter', Verdana, sans-serif" }}
    >
      {/* Left panel - decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(155deg, #1C2B4A 0%, #2272CC 100%)" }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-4h-2v-1l4-4v9z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">MediSchedule</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Gerencie sua<br />clínica com eficiência
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Agendamentos, prontuários e controle de enfermaria em uma única plataforma. Simples, rápido e seguro.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { v: "100%", l: "Seguro e criptografado" },
              { v: "24/7", l: "Disponível sempre" },
              { v: "Multi", l: "Perfis de acesso" },
              { v: "Real", l: "Dados em tempo real" },
            ].map((s) => (
              <div key={s.l} className="bg-white/8 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-white font-bold text-lg">{s.v}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* decorative circles */}
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4AA4F2, transparent)" }} />
        <div className="absolute top-32 -right-12 w-40 h-40 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />
      </div>

      {/* Right panel - form */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
        style={{ backgroundColor: "#F4F7FB" }}
      >
        <div
          className="w-full max-w-md bg-white rounded-2xl p-8"
          style={{ border: "1px solid #E0E7EF", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4AA4F2, #2272CC)" }}>
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-4h-2v-1l4-4v9z" />
              </svg>
            </div>
            <span className="font-bold text-base" style={{ color: "#1C2B4A" }}>MediSchedule</span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: "#263238" }}>
            Acesse sua conta
          </h1>
          <p className="text-sm mb-8" style={{ color: "#78909C" }}>
            Insira suas credenciais para continuar
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "rgba(229,62,62,0.08)", color: "#C53030", border: "1px solid rgba(229,62,62,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid #E0E7EF",
                  backgroundColor: "#F8FAFC",
                  color: "#263238",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2272CC")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E7EF")}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#263238" }}>
                Senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid #E0E7EF",
                  backgroundColor: "#F8FAFC",
                  color: "#263238",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2272CC")}
                onBlur={(e) => (e.target.style.borderColor = "#E0E7EF")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #4AA4F2 0%, #2272CC 100%)" }}
            >
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#78909C" }}>
            Não tem conta?{" "}
            <Link href="/cadastro" className="font-semibold hover:underline" style={{ color: "#2272CC" }}>
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
