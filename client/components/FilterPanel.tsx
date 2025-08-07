import { useState } from "react";
import { CalendarDays, X, Calendar as CalendarIcon } from "lucide-react";
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
import { useFilters } from "../contexts/FilterContext";

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

const modelOptions = [
  "ChatGPT",
  "Gemini",
  "Grok",
  "Claude",
  "Apple",
  "Llama",
];

export function FilterPanel({ onClose }: FilterPanelProps) {
  const { filters, updateFilter } = useFilters();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("ChatGPT");

  const handleCategoryChange = (value: string) => {
    updateFilter("category", value);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    if (range.from && range.to) {
      updateFilter("dateRange", range);
    }
  };

  const toggleAttribute = (attribute: string) => {
    const newAttributes = selectedAttributes.includes(attribute)
      ? selectedAttributes.filter(a => a !== attribute)
      : [...selectedAttributes, attribute];
    setSelectedAttributes(newAttributes);
    updateFilter("attributes", newAttributes);
  };

  const clearAllFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedAttributes([]);
    updateFilter("category", "All Categories");
    updateFilter("subcategory", "All Subcategories");
    updateFilter("dateRange", null);
    updateFilter("attributes", []);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <Card className="absolute top-full right-0 mt-2 w-96 shadow-xl border-0 z-50 bg-white rounded-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h3 className="font-bold text-lg text-[#384255]">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          <div className="p-4 space-y-6">
            {/* Model Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#384255]">Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="h-10 border-gray-300 hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model} value={model} className="py-2">
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#384255]">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10 px-3 border-gray-300 hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span className="text-gray-500">Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => handleDateRangeChange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#384255]">Category</label>
              <Select value={filters.category || "All Categories"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-10 border-gray-300 hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category} className="py-2">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#384255]">Subcategory</label>
              <Select value={filters.subcategory || "All Subcategories"} onValueChange={(value) => updateFilter("subcategory", value)}>
                <SelectTrigger className="h-10 border-gray-300 hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategoryOptions.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory} className="py-2">
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Attributes Filter */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#384255]">Attributes</label>
              <div className="flex flex-wrap gap-2">
                {attributeOptions.map((attribute) => {
                  const isSelected = selectedAttributes.includes(attribute);
                  return (
                    <Badge
                      key={attribute}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1 text-xs transition-all duration-200 ${
                        isSelected
                          ? "bg-[#9369F6] text-white hover:bg-[#7C3AED] border-[#9369F6]"
                          : "text-gray-600 border-gray-300 hover:border-[#9369F6] hover:text-[#9369F6] bg-white"
                      }`}
                      onClick={() => toggleAttribute(attribute)}
                    >
                      {attribute}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between gap-3 p-4 border-t bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="flex-1 h-9 text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-100"
            >
              Clear All
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 h-9 bg-[#9369F6] hover:bg-[#7C3AED] text-white"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
