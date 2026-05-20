"use client";

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <>
      {!isLogin && <Sidebar />}
      <div className={!isLogin ? "md:ml-64 min-h-screen flex flex-col" : "min-h-screen flex flex-col"}>
        {children}
      </div>
    </>
  );
}
