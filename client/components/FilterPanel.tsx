import { useState } from "react";
import { Filter, CalendarDays, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

// Sample data - in a real app this would come from an API
const brandOptions = [
  "All Brands",
  "Olive Garden",
  "Maggiano's Little Italy",
  "Romano's Macaroni Grill",
  "Carrabba's Italian Grill",
  "Buca di Beppo",
  "Tony Roma's",
  "Cheesecake Factory",
];

const categoryOptions = [
  "All Categories",
  "Italian Restaurant",
  "Casual Dining",
  "Family Restaurant",
  "Chain Restaurant",
  "Fine Dining",
  "Fast Casual",
];

const subcategoryOptions = [
  "All Subcategories",
  "Traditional Italian",
  "Modern Italian",
  "Pizza & Pasta",
  "Wine & Dine",
  "Family Style",
  "Corporate Dining",
];

const attributeOptions = [
  "All Attributes",
  "Pet Friendly",
  "Outdoor Seating",
  "Delivery Available",
  "Reservations",
  "Happy Hour",
  "Private Dining",
  "Vegetarian Options",
  "Gluten Free",
  "Live Music",
];

interface FilterState {
  dateRange: string;
  brand: string;
  category: string;
  subcategory: string;
  attributes: string[];
}

export function FilterPanel() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "Jul 31 - Aug 3, 2025",
    brand: "Olive Garden",
    category: "Italian Restaurant",
    subcategory: "",
    attributes: [],
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    console.log("Filter panel toggle clicked, current state:", isExpanded);
    setIsExpanded(!isExpanded);
  };

  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addAttribute = (attribute: string) => {
    if (attribute === "All Attributes") return;
    if (!filters.attributes.includes(attribute)) {
      updateFilter("attributes", [...filters.attributes, attribute]);
    }
  };

  const removeAttribute = (attribute: string) => {
    updateFilter(
      "attributes",
      filters.attributes.filter((a) => a !== attribute),
    );
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: "",
      brand: "",
      category: "",
      subcategory: "",
      attributes: [],
    });
  };

  const applyFilters = () => {
    console.log("Applying filters:", filters);
    // In a real app, this would trigger a data fetch or update the dashboard
  };

  const hasActiveFilters =
    filters.brand ||
    filters.category ||
    filters.subcategory ||
    filters.attributes.length > 0;

  return (
    <div
      className={cn(
        "mb-6 rounded-lg border transition-all duration-200",
        isExpanded
          ? "bg-card shadow-sm border-border"
          : "bg-background/60 hover:bg-card/80 border-border/40 hover:border-border hover:shadow-sm",
      )}
    >
      <div className="py-4 px-4">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Filters label and active filters */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleToggleExpanded}
              className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
            >
              <Filter className="h-4 w-4" />
              <span className="font-semibold">Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="h-5 text-xs">
                  {
                    [
                      filters.brand,
                      filters.category,
                      filters.subcategory,
                      ...filters.attributes,
                    ].filter(Boolean).length
                  }
                </Badge>
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded && "rotate-180",
                )}
              />
            </Button>

            {/* Active filter display when collapsed */}
            {!isExpanded && hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {filters.brand && <span>{filters.brand}</span>}
                {filters.category && <span>• {filters.category}</span>}
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground h-8 px-3 text-sm"
              >
                Clear
              </Button>
            )}
            <Button
              onClick={applyFilters}
              size="sm"
              className="h-8 px-4 text-sm"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-0 px-4 pb-4">
          {/* Compact Filter Controls */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Date Range */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Date Range
              </label>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs h-8"
              >
                <CalendarDays className="h-3 w-3 mr-1" />
                {filters.dateRange || "Select"}
              </Button>
            </div>

            {/* Brand Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Brand
              </label>
              <Select
                value={filters.brand}
                onValueChange={(value) =>
                  updateFilter("brand", value === "All Brands" ? "" : value)
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand} value={brand} className="text-xs">
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  updateFilter(
                    "category",
                    value === "All Categories" ? "" : value,
                  )
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-xs"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Subcategory
              </label>
              <Select
                value={filters.subcategory}
                onValueChange={(value) =>
                  updateFilter(
                    "subcategory",
                    value === "All Subcategories" ? "" : value,
                  )
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {subcategoryOptions.map((subcategory) => (
                    <SelectItem
                      key={subcategory}
                      value={subcategory}
                      className="text-xs"
                    >
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Attributes Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Attributes
              </label>
              <Select onValueChange={addAttribute}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Add" />
                </SelectTrigger>
                <SelectContent>
                  {attributeOptions
                    .filter(
                      (attr) =>
                        attr === "All Attributes" ||
                        !filters.attributes.includes(attr),
                    )
                    .map((attribute) => (
                      <SelectItem
                        key={attribute}
                        value={attribute}
                        className="text-xs"
                      >
                        {attribute}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Attributes */}
          {filters.attributes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Selected Attributes
              </label>
              <div className="flex flex-wrap gap-1">
                {filters.attributes.map((attribute) => (
                  <Badge
                    key={attribute}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs h-6"
                  >
                    {attribute}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 hover:bg-transparent"
                      onClick={() => removeAttribute(attribute)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
