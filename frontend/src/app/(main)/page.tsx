"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";

// ─── helpers ───────────────────────────────────────────────────────────────
function todayLabel() {
  return new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

function buildAtendimentosPorDia(list: any[]) {
  const map: Record<string, number> = {};
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getDate()}/${d.getMonth() + 1}`;
    map[key] = 0;
  }
  list.forEach((a) => {
    if (!a.dataHora) return;
    const d = new Date(a.dataHora);
    const key = `${d.getDate()}/${d.getMonth() + 1}`;
    if (key in map) map[key] = (map[key] ?? 0) + 1;
  });
  return Object.entries(map).map(([date, total]) => ({ date, total }));
}

// ─── Mini Donut using SVG ──────────────────────────────────────────────────
function DonutChart({
  value, total, color, label, center,
}: {
  value: number; total: number; color: string; label: string; center?: string;
}) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? value / total : 0;
  const dash = pct * circ;
  const gap  = circ - dash;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold" style={{ color: "#546E7A" }}>{label}</p>
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#E0E7EF" strokeWidth="12" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold" style={{ color: "#263238" }}>{center ?? value}</span>
          <span className="text-[10px]" style={{ color: "#78909C" }}>
            {total > 0 ? `${Math.round(pct * 100)}%` : "0%"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── KPI top number ────────────────────────────────────────────────────────
function KpiNum({
  label, value, icon, color,
}: {
  label: string; value: number; icon: React.ReactNode; color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-4 flex-1 text-center">
      <span className="text-4xl font-bold leading-none" style={{ color: color ?? "#263238" }}>
        {value}
      </span>
      <span className="text-xs font-medium" style={{ color: "#78909C" }}>{label}</span>
      <span style={{ color: color ?? "#B0BEC5", marginTop: 2 }}>{icon}</span>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [medicos,      setMedicos]      = useState<any[]>([]);
  const [pacientes,    setPacientes]    = useState<any[]>([]);
  const [periodo,      setPeriodo]      = useState("Últimos 30 dias");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const h = { Authorization: `Bearer ${token}` };

    const load = async () => {
      try {
        const [ra, rm, rp] = await Promise.all([
          fetch("http://localhost:8082/api/atendimentos", { headers: h }),
          fetch("http://localhost:8082/api/medicos",      { headers: h }),
          fetch("http://localhost:8082/api/pacientes",    { headers: h }),
        ]);
        if (ra.ok) setAtendimentos(await ra.json());
        else if (ra.status === 401) { localStorage.clear(); router.push("/login"); }
        if (rm.ok) setMedicos(await rm.json());
        if (rp.ok) setPacientes(await rp.json());
      } catch (e) { console.error(e); }
    };
    load();
  }, [router]);

  // Derived metrics
  const agendados   = atendimentos.length;
  const confirmados = atendimentos.filter((a) => a.status === "EM_ATENDIMENTO").length;
  const atendidos   = atendimentos.filter((a) => ["CONCLUIDO","FINALIZADO"].includes(a.status)).length;
  const faltaram    = atendimentos.filter((a) => a.status === "CANCELADO").length;
  const emEspera    = atendimentos.filter((a) => a.status === "EM_ESPERA").length;
  const totalPac    = pacientes.length;

  // Chart data
  const atendPorDia  = buildAtendimentosPorDia(atendimentos);
  const last12       = atendPorDia.slice(-12); // show last 12 days in chart

  const pieStatus = [
    { name: "Concluídos", value: atendidos,   color: "#2272CC" },
    { name: "Em Espera",  value: emEspera,    color: "#F59E0B" },
    { name: "Outros",     value: Math.max(0, agendados - atendidos - emEspera), color: "#E0E7EF" },
  ].filter(d => d.value > 0);

  const piePacientes = [
    { name: "Atendidos", value: atendidos, color: "#2272CC" },
    { name: "Restantes", value: Math.max(0, agendados - atendidos), color: "#E0E7EF" },
  ].filter(d => d.value > 0);

  const pieMedicos = [
    { name: "Médicos",   value: medicos.length,   color: "#FF8410" },
    { name: "Pacientes", value: totalPac,          color: "#E0E7EF" },
  ].filter(d => d.value > 0);

  const barData = [
    { name: "Atend.",  value: atendidos },
    { name: "Espera",  value: emEspera },
    { name: "Cancel.", value: faltaram },
  ];

  const etariaData = [
    { faixa: "0-10",  v: 1 }, { faixa: "11-20", v: 2 }, { faixa: "21-30", v: 5 },
    { faixa: "31-40", v: 8 }, { faixa: "41-50", v: 12 }, { faixa: "51-60", v: 9 },
    { faixa: "61-70", v: 6 }, { faixa: "71+",   v: 3 },
  ];

  // ── Banner ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full">
      {/* Welcome banner */}
      <div
        className="flex items-center justify-between px-6 py-2.5 text-sm font-medium flex-shrink-0"
        style={{ backgroundColor: "#EBF5EB", borderBottom: "1px solid #C8E6C9" }}
      >
        <span style={{ color: "#2E7D32" }}>
          ✓ Sistema de Agendamento Médico — Período de avaliação MVP
        </span>
        <Link
          href="/agendar"
          className="px-4 py-1 rounded-lg text-sm font-bold text-white transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #4AA4F2, #2272CC)" }}
        >
          + Novo Agendamento
        </Link>
      </div>

      {/* Filters row */}
      <div
        className="flex items-center gap-6 px-6 py-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid #E0E7EF", backgroundColor: "#fff" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "#546E7A" }}>Período</span>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="text-xs font-semibold rounded-lg px-2 py-1 outline-none"
            style={{ border: "1px solid #E0E7EF", color: "#2272CC", backgroundColor: "#fff" }}
          >
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Este mês</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "#546E7A" }}>
            📅 {todayLabel()}
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-5">
        {/* ── KPI row ────────────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid #E0E7EF", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        >
          <div className="flex divide-x" style={{ divideColor: "#E0E7EF" }}>
            <KpiNum label="Pacientes agendados" value={agendados} icon={
              <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            } />
            <KpiNum label="Pacientes confirmados" value={confirmados} icon={
              <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } />
            <KpiNum label="Pacientes atendidos" value={atendidos} color="#2272CC" icon={
              <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2272CC" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            } />
            <KpiNum label="Pacientes que faltaram" value={faltaram} icon={
              <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } />
          </div>
        </div>

        {/* ── 4 Chart widgets ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Pacientes donut */}
          <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #E0E7EF" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "#2272CC" }}>Pacientes</p>
            <div className="flex justify-center mb-3">
              <DonutChart value={atendidos} total={Math.max(agendados,1)} color="#2272CC" label="" center={`${agendados}`} />
            </div>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-xs font-semibold" style={{ color: "#263238" }}>{Math.max(0, agendados - atendidos)}</p>
                <p className="text-[10px]" style={{ color: "#78909C" }}>● Novos</p>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#263238" }}>{atendidos}</p>
                <p className="text-[10px]" style={{ color: "#78909C" }}>● Retorno</p>
              </div>
            </div>
          </div>

          {/* Procedimentos donut */}
          <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #E0E7EF" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "#2272CC" }}>Procedimentos realizados</p>
            <div className="flex justify-center mb-3">
              <DonutChart value={atendidos} total={Math.max(agendados,1)} color="#FF8410" label="" center={`${atendidos}`} />
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-[10px] flex items-center gap-1" style={{ color: "#78909C" }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#FF8410" }} />
                  Retorno
                </p>
              </div>
            </div>
          </div>

          {/* Pacientes x Convênio donut */}
          <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #E0E7EF" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "#2272CC" }}>Pacientes x Convênio</p>
            <div className="flex justify-center mb-3">
              <DonutChart value={totalPac} total={Math.max(totalPac,1)} color="#4AA4F2" label="" center={`${totalPac}`} />
            </div>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-xs font-semibold" style={{ color: "#263238" }}>{totalPac}</p>
                <p className="text-[10px]" style={{ color: "#78909C" }}>● Particular</p>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "#263238" }}>0</p>
                <p className="text-[10px]" style={{ color: "#78909C" }}>● Convênio</p>
              </div>
            </div>
          </div>

          {/* Duração / Bar */}
          <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid #E0E7EF" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "#2272CC" }}>Duração do atendimento</p>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#78909C" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-2xl font-bold" style={{ color: "#263238" }}>30min</span>
            </div>
            <p className="text-xs font-semibold mb-2" style={{ color: "#78909C" }}>Tipo de atendimento</p>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={barData} barSize={18}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#78909C" }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#4AA4F2" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Atendimentos no período – Area chart ───────────────────────── */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E0E7EF" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "#2272CC" }}>Atendimentos no período</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={last12} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2272CC" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2272CC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#B0BEC5" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#B0BEC5" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E0E7EF", fontSize: 12 }}
                cursor={{ stroke: "#2272CC", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="total" stroke="#2272CC" strokeWidth={2}
                fill="url(#areaGrad)" dot={{ r: 3, fill: "#2272CC", strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Bottom row: Distribuição etária + Aniversariantes ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
          {/* Distribuição etária */}
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E0E7EF" }}>
            <p className="text-sm font-bold mb-4" style={{ color: "#2272CC" }}>Distribuição etária</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={etariaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="etariaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4AA4F2" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4AA4F2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="faixa" tick={{ fontSize: 10, fill: "#B0BEC5" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#B0BEC5" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E0E7EF", fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#4AA4F2" strokeWidth={2}
                  fill="url(#etariaGrad)" dot={{ r: 3, fill: "#4AA4F2", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Aniversariantes */}
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E0E7EF" }}>
            <p className="text-sm font-bold mb-4" style={{ color: "#2272CC" }}>Aniversariantes do dia</p>
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(34,114,204,0.06)" }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  style={{ color: "#B0BEC5" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M9 6l3-3 3 3M9 6H4M9 6c0 3.314 2.686 6 6 6s6-2.686 6-6" />
                </svg>
              </div>
              <p className="text-sm font-medium text-center" style={{ color: "#B0BEC5" }}>
                Nenhum aniversariante hoje
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
