"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AgendarPage() {
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8082/atendimentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paciente: { id: parseInt(pacienteId) },
          medico: { id: parseInt(medicoId) },
        }),
      });

      if (res.ok) {
        alert("Agendado com sucesso!");
        router.push("/");
      } else {
        alert("Erro ao agendar.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-lg mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Novo Agendamento</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg flex flex-col gap-4 text-gray-800">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID do Paciente
          </label>
          <input
            type="number"
            required
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID do Médico
          </label>
          <input
            type="number"
            required
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "A agendar..." : "Agendar"}
        </button>
      </form>
    </main>
  );
}
