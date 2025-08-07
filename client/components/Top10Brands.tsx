import { useState } from "react";
import { MoreHorizontal, ArrowUp, ArrowDown, Filter, Crown, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFilters } from "../contexts/FilterContext";
import { getGlobalBrandsData } from "../services/dataService";

export function Top10Brands() {
  const { filters } = useFilters();
  const [sortBy, setSortBy] = useState<"rank" | "coverage" | "position">("rank");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  // Get global brands data
  const allBrands = getGlobalBrandsData(filters);
  
  // Apply additional filters
  let filteredBrands = [...allBrands];
  
  if (categoryFilter !== "All") {
    filteredBrands = filteredBrands.filter(brand => brand.category === categoryFilter);
  }
  
  // Sort data
  filteredBrands.sort((a, b) => {
    switch (sortBy) {
      case "coverage":
        return b.coverage - a.coverage;
      case "position":
        return a.avgPosition - b.avgPosition;
      default:
        return a.rank - b.rank;
    }
  });
  
  // Limit to top 10 unless showAll is true
  const displayBrands = showAll ? filteredBrands : filteredBrands.slice(0, 10);
  
  // Find selected brand position
  const selectedBrand = allBrands.find(brand => brand.isSelected);
  
  // Get unique categories for filter
  const categories = ["All", ...Array.from(new Set(allBrands.map(brand => brand.category)))];

  const formatChange = (change: number) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : change < 0 ? (
          <TrendingDown className="h-3 w-3" />
        ) : null}
        <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Top Brands Globally</CardTitle>
            {selectedBrand && (
              <Badge variant="outline" className="text-xs bg-[#9369F6]/10 text-[#9369F6] border-[#9369F6]/20">
                <Crown className="h-3 w-3 mr-1" />
                #{selectedBrand.rank} {selectedBrand.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-xs"
            >
              {showAll ? "Top 10" : "Show All"}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-xs">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: "rank" | "coverage" | "position") => setSortBy(value)}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank" className="text-xs">Rank</SelectItem>
                <SelectItem value="coverage" className="text-xs">Coverage</SelectItem>
                <SelectItem value="position" className="text-xs">Position</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-3 py-2 text-xs font-medium text-muted-foreground border-b">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Brand</div>
            <div className="col-span-2 text-center">Coverage</div>
            <div className="col-span-2 text-center">Avg Pos</div>
            <div className="col-span-2 text-center">Mentions</div>
            <div className="col-span-1 text-center">Trend</div>
          </div>

          {/* Brand rows */}
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {displayBrands.map((brand, index) => {
              const isSelected = brand.isSelected;
              const displayRank = sortBy === "rank" ? brand.rank : index + 1;
              
              return (
                <div
                  key={brand.name}
                  className={`grid grid-cols-12 gap-3 py-2.5 rounded-md transition-all duration-200 ${
                    isSelected 
                      ? "bg-[#9369F6]/10 border border-[#9369F6]/30 shadow-sm" 
                      : "hover:bg-muted/30"
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      displayRank <= 3 
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                        : isSelected
                          ? "bg-[#9369F6] text-white"
                          : "bg-gray-100 text-gray-600"
                    }`}>
                      {displayRank <= 3 && <Crown className="h-3 w-3" />}
                      {displayRank > 3 && displayRank}
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {brand.logo}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium truncate ${isSelected ? 'text-[#9369F6] font-semibold' : 'text-foreground'}`}>
                        {brand.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {brand.category}
                      </span>
                    </div>
                  </div>

                  {/* Coverage */}
                  <div className="col-span-2 flex flex-col items-center justify-center">
                    <span className="text-sm font-medium">{brand.coverage.toFixed(1)}%</span>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isSelected ? 'bg-[#9369F6]' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(brand.coverage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Average Position */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-medium">{brand.avgPosition.toFixed(2)}</span>
                  </div>

                  {/* Mentions */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-medium">{brand.mentions.toLocaleString()}</span>
                  </div>

                  {/* Trend */}
                  <div className="col-span-1 flex justify-center">
                    {formatChange(brand.change)}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Summary */}
          {selectedBrand && (
            <div className="mt-4 pt-4 border-t">
              <div className="bg-[#9369F6]/5 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9369F6] font-medium">Your Brand Position:</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#9369F6] text-white">
                      #{selectedBrand.rank} Globally
                    </Badge>
                    <span className="text-gray-600">
                      {selectedBrand.coverage.toFixed(1)}% coverage
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
