import { ReactNode } from "react";
import { Header } from "./Header";
import { SidebarNavigation } from "./SidebarNavigation";
import { useFilterVisibility } from "../contexts/FilterVisibilityContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isFilterOpen } = useFilterVisibility();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SidebarNavigation />
      <main className={`lg:ml-64 min-h-[calc(100vh-90px)] transition-all duration-200 ${
        isFilterOpen ? 'pt-[75px]' : 'pt-0'
      }`}>
        {children}
      </main>
    </div>
  );
}
