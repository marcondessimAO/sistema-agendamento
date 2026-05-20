"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { href: "/", label: "Painel" },
  { href: "/agendar", label: "Agenda" },
  { href: "/prontuarios", label: "Prontuários" },
  { href: "/medicos", label: "Médicos" },
  { href: "/pacientes", label: "Pacientes" },
  { href: "/enfermaria", label: "Enfermaria" },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="h-14 fixed top-0 left-0 right-0 z-50 flex items-center px-4"
      style={{
        backgroundColor: "var(--ic-surface)",
        borderBottom: "1px solid var(--ic-border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-6 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4AA4F2 0%, #2272CC 100%)" }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-4h-2v-1l4-4v9z" />
          </svg>
        </div>
        <div className="leading-none">
          <p className="text-[10px] font-medium" style={{ color: "#78909C" }}>Sistema</p>
          <p className="text-sm font-bold" style={{ color: "#1C2B4A" }}>MediSchedule</p>
        </div>
      </Link>

      {/* Nav Links – desktop */}
      <nav className="hidden md:flex items-center gap-1 flex-1">
        {navLinks.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: active ? "#2272CC" : "#546E7A",
                backgroundColor: active ? "rgba(34,114,204,0.08)" : "transparent",
                fontWeight: active ? 600 : 500,
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ color: "var(--ic-text-muted)" }}
        >
          <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Dark / Light toggle */}
        <button
          onClick={toggle}
          title={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100"
          style={{
            color: theme === "dark" ? "#F59E0B" : "var(--ic-text-muted)",
            backgroundColor: theme === "dark" ? "rgba(245,158,11,0.1)" : "transparent",
          }}
        >
          {theme === "dark" ? (
            /* Sun icon */
            <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            /* Moon icon */
            <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* User avatar + logout */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #4AA4F2, #2272CC)" }}
          >
            M
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-10 w-48 rounded-xl py-1 z-50"
              style={{
                backgroundColor: "var(--ic-surface)",
                border: "1px solid var(--ic-border)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F4F7FB] flex items-center gap-2"
                style={{ color: "#E53E3E" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair do sistema
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "#546E7A" }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
