import { ReactNode } from "react";
import { Header } from "./Header";
import { SidebarNavigation } from "./SidebarNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <SidebarNavigation />
        <main className="flex-1 min-h-[calc(100vh-90px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
