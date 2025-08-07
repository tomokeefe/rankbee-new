import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CircularProgress } from "./ui/circular-progress";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/utils";
import { useFilters } from "../contexts/FilterContext";
import { getFilteredData } from "../services/dataService";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  type?: "default" | "progress" | "rank";
  className?: string;
}

function KPICard({
  title,
  value,
  change,
  changeLabel,
  type = "default",
  className,
}: KPICardProps) {
  const hasPositiveChange = change && change > 0;
  const hasNegativeChange = change && change < 0;

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-shadow duration-200",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {type === "progress" ? (
              <CircularProgress
                value={
                  typeof value === "number"
                    ? value
                    : parseFloat(value.toString())
                }
                size={60}
                strokeWidth={6}
              />
            ) : (
              <div className="text-2xl font-bold text-foreground">{value}</div>
            )}
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                hasPositiveChange && "text-green-600",
                hasNegativeChange && "text-red-600",
              )}
            >
              {hasPositiveChange && <ArrowUp className="h-3 w-3" />}
              {hasNegativeChange && <ArrowDown className="h-3 w-3" />}
              <span>
                {Math.abs(change)}
                {changeLabel || "%"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const { filters } = useFilters();
  const data = getFilteredData(filters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Brand Coverage"
        value={data.kpiMetrics.brandCoverage.value}
        type="progress"
        change={data.kpiMetrics.brandCoverage.change}
        className="col-span-1"
      />
      <KPICard
        title="Total Prompts"
        value={data.kpiMetrics.totalPrompts.value}
        change={data.kpiMetrics.totalPrompts.change}
        className="col-span-1"
      />
      <KPICard
        title="Average Position"
        value={data.kpiMetrics.averagePosition.value}
        change={data.kpiMetrics.averagePosition.change}
        changeLabel=" pos"
        className="col-span-1"
      />
      <KPICard
        title="Category Rank"
        value={data.kpiMetrics.categoryRank.value}
        change={data.kpiMetrics.categoryRank.change}
        changeLabel=" rank"
        className="col-span-1"
      />
    </div>
  );
}
