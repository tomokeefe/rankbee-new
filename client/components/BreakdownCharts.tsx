import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/utils";
import { useFilters } from "../contexts/FilterContext";
import { getFilteredData } from "../services/dataService";

const categoryData = [
  { name: "Italian Restaurant", coverage: 49.0, avgRank: 1.2, change: 2.1 },
  { name: "Casual Dining", coverage: 45.5, avgRank: 1.8, change: -0.5 },
  { name: "Family Restaurant", coverage: 42.3, avgRank: 2.1, change: 1.2 },
  { name: "Chain Restaurant", coverage: 38.7, avgRank: 2.4, change: -1.1 },
];

const demographicData = [
  { name: "Women 55+", coverage: 45.0, avgRank: 1.1, change: 1.8 },
  { name: "Men 35-54", coverage: 42.3, avgRank: 1.4, change: 0.7 },
  { name: "Women 25-34", coverage: 38.9, avgRank: 1.9, change: -0.3 },
  { name: "Men 55+", coverage: 35.2, avgRank: 2.2, change: 0.9 },
];

const subcategoryData = [
  { name: "Olive Garden", value: 49, color: "hsl(var(--primary))" },
  { name: "No Coverage", value: 26, color: "hsl(var(--muted))" },
  { name: "Maggiano's", value: 15, color: "hsl(var(--primary) / 0.7)" },
  { name: "Other Brands", value: 10, color: "hsl(var(--primary) / 0.4)" },
];

interface HorizontalBarProps {
  data: typeof categoryData;
  title: string;
}

function HorizontalBar({ data, title }: HorizontalBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              {/* Top row with name and metrics */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground text-sm truncate pr-4">
                  {item.name}
                </span>
                <div className="flex items-center gap-4 text-xs shrink-0">
                  <span className="text-muted-foreground whitespace-nowrap">
                    Avg Rank: {item.avgRank}
                  </span>
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      item.change > 0 ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {item.change > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(item.change)}%</span>
                  </div>
                </div>
              </div>

              {/* Progress bar with percentage on separate line */}
              <div className="space-y-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.coverage}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {item.coverage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground">
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
}

function DonutChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Subcategory Coverage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subcategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {subcategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {subcategoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-medium ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BreakdownCharts() {
  const { filters } = useFilters();
  const filteredData = getFilteredData(filters);

  // Transform data for display
  const categoryData = filteredData.categoryBreakdown.map((item: any) => ({
    name: item.category,
    coverage: 49.0, // Base coverage for chart display
    avgRank: item.avgRank,
    change: item.change,
  }));

  const demographicData = filteredData.demographicBreakdown.map(
    (item: any) => ({
      name: item.demographic,
      coverage: 45.0, // Base coverage for chart display
      avgRank: item.avgRank,
      change: item.change,
    }),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <HorizontalBar data={categoryData} title="Category Breakdown" />
      <HorizontalBar data={demographicData} title="Demographic Breakdown" />
      <DonutChart />
    </div>
  );
}
