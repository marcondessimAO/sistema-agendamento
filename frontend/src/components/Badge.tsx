import React from 'react';

export default function Badge({ status }: { status: string }) {
  let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
  let label = status;

  if (status === 'EM_ESPERA') {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200/60';
    label = 'Em Espera';
  } else if (status === 'CONCLUIDO' || status === 'FINALIZADO') {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    label = 'Concluído';
  } else if (status === 'CANCELADO') {
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200/60';
    label = 'Cancelado';
  } else if (status === 'EM_ATENDIMENTO') {
    colorClass = 'bg-blue-50 text-blue-700 border-blue-200/60';
    label = 'Em Atendimento';
  }

  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${colorClass}`}>
      <span className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${colorClass.split(' ')[1].replace('text-', 'bg-')}`}></span>
        {label}
      </span>
    </span>
  );
}
