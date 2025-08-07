import { DashboardLayout } from "./DashboardLayout";
import { KPICards } from "./KPICards";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { BreakdownCharts } from "./BreakdownCharts";
import { BrandsTable, CitationsTable } from "./DataTable";

export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-[1240px] mx-auto px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <KPICards />

        {/* Time Series Chart */}
        <TimeSeriesChart />

        {/* Breakdown Charts */}
        <BreakdownCharts />

        {/* Data Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <BrandsTable />
          <CitationsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
