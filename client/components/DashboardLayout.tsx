import { ReactNode } from "react";
import { Header } from "./Header";
import { SidebarNavigation } from "./SidebarNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
  isFilterOpen?: boolean;
}

export function DashboardLayout({ children, isFilterOpen = false }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SidebarNavigation isFilterOpen={isFilterOpen} />
      <main className="lg:ml-64 min-h-[calc(100vh-90px)]">
        {children}
      </main>
    </div>
  );
}
