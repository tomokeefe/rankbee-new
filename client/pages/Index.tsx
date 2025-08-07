import { DashboardLayout } from "../components/DashboardLayout";
import { Summary } from "../components/Summary";
import { KPICards } from "../components/KPICards";
import { TimeSeriesChart } from "../components/TimeSeriesChart";
import { BreakdownCharts } from "../components/BreakdownCharts";
import { Top10Brands } from "../components/Top10Brands";
import { CitationsTable } from "../components/DataTable";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useFilters } from "../contexts/FilterContext";

export default function Index() {
  const { filters, brands } = useFilters();

  // Get brand display name
  const selectedBrand = brands.find(brand => brand.value === filters.brand);
  const brandName = selectedBrand?.label || "Your Brand";

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#9369F6]">Snapshot</h1>
            <p className="text-gray-600">Overview and performance metrics for {brandName}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <ErrorBoundary>
          <KPICards />
        </ErrorBoundary>

        {/* Summary */}
        <ErrorBoundary>
          <Summary />
        </ErrorBoundary>

        {/* Top Brands Globally and Citation Analysis - moved above Time Series Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ErrorBoundary>
            <Top10Brands />
          </ErrorBoundary>
          <ErrorBoundary>
            <CitationsTable />
          </ErrorBoundary>
        </div>

        {/* Brand Performance Over Time Chart */}
        <ErrorBoundary>
          <TimeSeriesChart />
        </ErrorBoundary>

        {/* Breakdown Charts and Additional Components */}
        <ErrorBoundary>
          <BreakdownCharts />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
}
