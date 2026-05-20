import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediSchedule | Sistema de Agendamento",
  description: "Sistema profissional de agendamento médico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-[#f8fafc] text-gray-900 min-h-screen">
        <Sidebar />
        <div className="md:ml-64 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
