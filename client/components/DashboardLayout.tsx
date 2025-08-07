import { ReactNode } from "react";
import { Header } from "./Header";
import { FilterBar } from "./FilterBar";
import { SidebarNavigation } from "./SidebarNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FilterBar />
      <div className="flex">
        <SidebarNavigation />
        <main className="flex-1 min-h-[calc(100vh-140px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
