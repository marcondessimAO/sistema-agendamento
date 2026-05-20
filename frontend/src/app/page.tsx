import Link from "next/link";

export default async function Dashboard() {
  const res = await fetch("http://localhost:8082/atendimentos", {
    cache: "no-store",
  });
  
  const atendimentos = res.ok ? await res.json() : [];

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard de Atendimentos</h1>
        <Link 
          href="/agendar" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Novo Agendamento
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-left text-sm whitespace-nowrap text-gray-800">
          <thead className="uppercase tracking-wider border-b-2 bg-gray-50 text-gray-600">
            <tr>
              <th scope="col" className="px-6 py-4">ID</th>
              <th scope="col" className="px-6 py-4">Data/Hora</th>
              <th scope="col" className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {atendimentos.map((atendimento: any) => (
              <tr key={atendimento.id} className="border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium">{atendimento.id}</th>
                <td className="px-6 py-4">{atendimento.dataHora ? new Date(atendimento.dataHora).toLocaleString() : 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {atendimento.status}
                  </span>
                </td>
              </tr>
            ))}
            {atendimentos.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Nenhum atendimento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
