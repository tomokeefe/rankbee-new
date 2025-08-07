import { DashboardLayout } from "../components/DashboardLayout";
import { Summary } from "../components/Summary";
import { KPICards } from "../components/KPICards";
import { TimeSeriesChart } from "../components/TimeSeriesChart";
import { BreakdownCharts } from "../components/BreakdownCharts";
import { Top10Brands } from "../components/Top10Brands";
import { CitationsTable } from "../components/DataTable";
import { AIDashboard } from "../components/AIDashboard";

export default function Index() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <KPICards />

        {/* AI-Powered Dashboard */}
        <AIDashboard />

        {/* Summary below AI Dashboard */}
        <Summary />

        {/* Time Series Chart */}
        <TimeSeriesChart />

        {/* Breakdown Charts and Additional Components */}
        <BreakdownCharts />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Top10Brands />
          <CitationsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
