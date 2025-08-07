import { useFilters } from "../contexts/FilterContext";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";

// Available brands
const brands = [
  { value: "olive-garden", label: "Olive Garden" },
  { value: "maggianos", label: "Maggiano's" },
  { value: "darden", label: "Darden" },
  { value: "osteria", label: "Osteria M." },
  { value: "bloomin", label: "Bloomin' Brands" },
  { value: "carrabba", label: "Carrabba's" },
];

export function BrandTitle() {
  const { filters, updateFilter } = useFilters();

  const handleBrandChange = (value: string) => {
    updateFilter("brand", value);
  };

  const selectedBrand = brands.find((brand) => brand.value === filters.brand);
  const displayName = selectedBrand?.label || "Select Brand";

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1240px] mx-auto px-6 py-4">
        <div className="space-y-2">
          <h1 className="text-sm font-medium text-gray-600">Brand</h1>
          <Select value={filters.brand} onValueChange={handleBrandChange}>
            <SelectTrigger
              className={cn(
                "h-auto text-2xl font-bold border-none shadow-none focus:ring-0 bg-transparent p-0",
                "hover:bg-transparent focus:bg-transparent",
                "w-auto gap-2",
              )}
            >
              <SelectValue className="text-2xl font-bold text-gray-900">
                {displayName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="min-w-[200px]">
              {brands.map((brand) => (
                <SelectItem
                  key={brand.value}
                  value={brand.value}
                  className="text-lg py-3 hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100 focus:text-gray-900 hover:text-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                    {brand.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
