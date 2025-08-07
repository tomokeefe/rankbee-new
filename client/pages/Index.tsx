import { DashboardLayout } from "../components/DashboardLayout";
import { Summary } from "../components/Summary";
import { KPICards } from "../components/KPICards";
import { TimeSeriesChart } from "../components/TimeSeriesChart";
import { BreakdownCharts } from "../components/BreakdownCharts";
import { Top10Brands } from "../components/Top10Brands";
import { CitationsTable } from "../components/DataTable";

export default function Index() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <KPICards />

        {/* Summary */}
        <Summary />

        {/* Top Brands Globally and Citation Analysis - moved above Time Series Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Top10Brands />
          <CitationsTable />
        </div>

        {/* Brand Performance Over Time Chart */}
        <TimeSeriesChart />

        {/* Breakdown Charts and Additional Components */}
        <BreakdownCharts />
      </div>
    </DashboardLayout>
  );
}
