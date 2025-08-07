import { ReactNode } from "react";
import { Header } from "./Header";
import { FilterBar } from "./FilterBar";
import { BrandTitle } from "./BrandTitle";
import { TabNavigation } from "./TabNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BrandTitle />
      <FilterBar />
      <TabNavigation />
      <main className="min-h-[calc(100vh-14rem)]">{children}</main>
    </div>
  );
}
