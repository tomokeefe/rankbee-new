import { MoreHorizontal, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useFilters } from "../contexts/FilterContext";
import { getFilteredData } from "../services/dataService";

export function Top10Brands() {
  const { filters } = useFilters();
  const data = getFilteredData(filters);

  // Convert filtered brands data to display format
  const brandsData = data.brands.slice(0, 10).map((brand: any) => ({
    name:
      brand.name.length > 12 ? brand.name.substring(0, 12) + "..." : brand.name,
    coverage: `${brand.coverage}%`,
    avgRank: brand.rank.toFixed(2),
    logo: brand.logo,
  }));
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Top 10 Brands</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
            <div className="col-span-5">Brand</div>
            <div className="col-span-3 text-center">Coverage</div>
            <div className="col-span-4 text-right flex items-center justify-end gap-1">
              AVG Rank
              <ArrowUp className="h-3 w-3" />
            </div>
          </div>

          {/* Brand rows */}
          <div className="space-y-1">
            {brandsData.map((brand, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 py-2 hover:bg-muted/30 rounded-sm transition-colors"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                    {brand.logo}
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">
                    {brand.name}
                  </span>
                </div>
                <div className="col-span-3 text-center">
                  <span className="text-sm font-medium">{brand.coverage}</span>
                </div>
                <div className="col-span-4 text-right">
                  <span className="text-sm font-medium">{brand.avgRank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
