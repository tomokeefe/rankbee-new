import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useFilters } from "../contexts/FilterContext";
import { getFilteredData } from "../services/dataService";
import { format } from "date-fns";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.dataKey === "ranking" ? "th" : "%"}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function TimeSeriesChart() {
  const { filters } = useFilters();
  const filteredData = getFilteredData(filters);

  // Transform data for chart display
  const data = filteredData.timeSeriesData.map((item: any) => ({
    date: format(new Date(item.date), "MMM d"),
    ranking: item.position,
    coverage: item.coverage,
  }));

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Brand Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                interval="preserveStartEnd"
                type="category"
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                type="number"
                domain={["dataMin", "dataMax"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="ranking"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
                name="Average Ranking"
              />
              <Line
                type="monotone"
                dataKey="coverage"
                stroke="hsl(var(--primary) / 0.6)"
                strokeWidth={2}
                dot={{
                  fill: "hsl(var(--primary) / 0.6)",
                  strokeWidth: 0,
                  r: 3,
                }}
                activeDot={{ r: 5 }}
                name="Coverage"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
