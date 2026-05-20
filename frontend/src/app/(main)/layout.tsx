import TopNavbar from "@/components/TopNavbar";
import PacientesDoDia from "@/components/PacientesDoDia";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <TopNavbar />
      {/* Below navbar */}
      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: "56px" }}>
        <PacientesDoDia />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "var(--ic-bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
