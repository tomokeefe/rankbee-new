import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { useFilters } from "../contexts/FilterContext";

// Mock data for dropdowns
const categories = [
  { value: "italian", label: "Italian Restaurant" },
  { value: "casual", label: "Casual Dining" },
  { value: "family", label: "Family Restaurant" },
  { value: "chain", label: "Chain Restaurant" },
];

const subcategories = [
  { value: "pizza", label: "Pizza & Pasta" },
  { value: "breadsticks", label: "Breadsticks" },
  { value: "salads", label: "Salads" },
  { value: "desserts", label: "Desserts" },
];

const priceRanges = [
  { value: "budget", label: "$" },
  { value: "moderate", label: "$$" },
  { value: "upscale", label: "$$$" },
  { value: "fine-dining", label: "$$$$" },
];

const attributes = [
  { value: "location", label: "Location" },
  { value: "cuisine", label: "Cuisine Type" },
  { value: "service", label: "Service Style" },
  { value: "ambiance", label: "Ambiance" },
];

export function FilterBar() {
  const { filters, updateFilter } = useFilters();

  const handleCategoryChange = (value: string) => {
    updateFilter("category", [value]);
    // Reset subcategory when category changes
    updateFilter("subcategory", []);
  };

  const handleSubcategoryChange = (value: string) => {
    updateFilter("subcategory", [value]);
  };

  const handlePriceRangeChange = (value: string) => {
    updateFilter("priceRange", value);
  };

  const handleAttributeChange = (value: string) => {
    const currentAttributes = filters.attributes;
    if (currentAttributes.includes(value)) {
      updateFilter(
        "attributes",
        currentAttributes.filter((attr) => attr !== value),
      );
    } else {
      updateFilter("attributes", [...currentAttributes, value]);
    }
  };

  const clearFilters = () => {
    updateFilter("category", []);
    updateFilter("subcategory", []);
    updateFilter("priceRange", "");
    updateFilter("attributes", []);
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-[1240px] mx-auto px-6 py-4">
        <div className="grid grid-cols-6 gap-4 items-end">
          {/* Date Range */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Jul 31 - Aug 3, 2025</span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <Select
              value={(filters.category && filters.category.length > 0) ? filters.category[0] : ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                className={cn(
                  "h-9 text-sm border border-gray-300 bg-white",
                  "hover:bg-gray-50 hover:border-gray-400",
                  (filters.category && filters.category.length > 0) && "border-purple-600 bg-purple-50",
                )}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <Select
              value={(filters.subcategory && filters.subcategory.length > 0) ? filters.subcategory[0] : ""}
              onValueChange={handleSubcategoryChange}
              disabled={!filters.category || filters.category.length === 0}
            >
              <SelectTrigger
                className={cn(
                  "h-9 text-sm border border-gray-300 bg-white",
                  "hover:bg-gray-50 hover:border-gray-400",
                  (filters.subcategory && filters.subcategory.length > 0) && "border-purple-600 bg-purple-50",
                  (!filters.category || filters.category.length === 0) && "opacity-50 cursor-not-allowed",
                )}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem
                    key={subcategory.value}
                    value={subcategory.value}
                    className="hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100"
                  >
                    {subcategory.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Price range
            </label>
            <Select
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
            >
              <SelectTrigger
                className={cn(
                  "h-9 text-sm border border-gray-300 bg-white",
                  "hover:bg-gray-50 hover:border-gray-400",
                  filters.priceRange && "border-purple-600 bg-purple-50",
                )}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((price) => (
                  <SelectItem
                    key={price.value}
                    value={price.value}
                    className="hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100"
                  >
                    {price.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Attributes */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Attributes
            </label>
            <Select onValueChange={handleAttributeChange}>
              <SelectTrigger
                className={cn(
                  "h-9 text-sm border border-gray-300 bg-white",
                  "hover:bg-gray-50 hover:border-gray-400",
                  filters.attributes.length > 0 &&
                    "border-purple-600 bg-purple-50",
                )}
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {attributes.map((attribute) => (
                  <SelectItem
                    key={attribute.value}
                    value={attribute.value}
                    className="hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-3 h-3 border rounded-sm",
                          filters.attributes.includes(attribute.value)
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-300",
                        )}
                      />
                      {attribute.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
