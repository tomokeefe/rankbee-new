import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

interface FilterPanelProps {
  onClose: () => void;
}

// Sample data - in a real app this would come from an API
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
  dateRange: { from: Date | undefined; to: Date | undefined };
  category: string;
  subcategory: string;
  attributes: string[];
}

export function FilterPanel({ onClose }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: undefined, to: undefined },
    category: "",
    subcategory: "",
    attributes: [],
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addAttribute = (attribute: string) => {
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
      dateRange: { from: undefined, to: undefined },
      category: "",
      subcategory: "",
      attributes: [],
    });
  };

  const applyFilters = () => {
    console.log("Applying filters:", filters);
    onClose();
  };

  const formatDateRange = () => {
    if (filters.dateRange.from) {
      if (filters.dateRange.to) {
        return `${format(filters.dateRange.from, "MMM dd")} - ${format(filters.dateRange.to, "MMM dd, yyyy")}`;
      }
      return format(filters.dateRange.from, "MMM dd, yyyy");
    }
    return "Select date range";
  };

  const hasActiveFilters =
    filters.category ||
    filters.subcategory ||
    filters.attributes.length > 0 ||
    filters.dateRange.from ||
    filters.dateRange.to;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <Card className="absolute top-full right-0 mt-2 w-96 shadow-lg border z-50 bg-white">
        <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={filters.dateRange.from}
                selected={filters.dateRange}
                onSelect={(range) => updateFilter("dateRange", range || { from: undefined, to: undefined })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              updateFilter("category", value === "All Categories" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Subcategory</label>
          <Select
            value={filters.subcategory}
            onValueChange={(value) =>
              updateFilter("subcategory", value === "All Subcategories" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategoryOptions.map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Attributes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Attributes</label>
          <Select onValueChange={addAttribute}>
            <SelectTrigger>
              <SelectValue placeholder="Add attribute" />
            </SelectTrigger>
            <SelectContent>
              {attributeOptions
                .filter((attr) => !filters.attributes.includes(attr))
                .map((attribute) => (
                  <SelectItem key={attribute} value={attribute}>
                    {attribute}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Selected Attributes */}
          {filters.attributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.attributes.map((attribute) => (
                <Badge
                  key={attribute}
                  variant="secondary"
                  className="gap-1 pr-1"
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
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm"
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </Button>
          <Button
            onClick={applyFilters}
            size="sm"
            className="text-sm"
          >
            Apply Filters
          </Button>
        </div>
        </CardContent>
      </Card>
    </>
  );
}
