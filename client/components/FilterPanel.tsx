import { useState } from "react";
import { CalendarDays, X, Calendar as CalendarIcon, ChevronDown, Check } from "lucide-react";
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
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useFilters } from "../contexts/FilterContext";
import { cn } from "../lib/utils";

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

  // Early safety check
  if (!filters) {
    console.error("FilterPanel: filters is undefined");
    return (
      <Card className="absolute top-full right-0 mt-2 w-[480px] shadow-xl border-0 z-50 bg-white rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <p>Error: Filter context not available</p>
          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    );
  }
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("ChatGPT");

  // Safe initialization with error handling
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    try {
      return (filters?.category && Array.isArray(filters.category)) ? filters.category : [];
    } catch (error) {
      console.warn("Error initializing selectedCategories:", error);
      return [];
    }
  });

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(() => {
    try {
      return (filters?.subcategory && Array.isArray(filters.subcategory)) ? filters.subcategory : [];
    } catch (error) {
      console.warn("Error initializing selectedSubcategories:", error);
      return [];
    }
  });

  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const [subcategoryPopoverOpen, setSubcategoryPopoverOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    try {
      if (category === "All Categories") {
        const newCategories: string[] = [];
        setSelectedCategories(newCategories);
        updateFilter("category", newCategories);
        return;
      }

      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category];
      setSelectedCategories(newCategories);
      updateFilter("category", newCategories);
    } catch (error) {
      console.error("Error in handleCategoryToggle:", error);
    }
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    if (subcategory === "All Subcategories") {
      const newSubcategories: string[] = [];
      setSelectedSubcategories(newSubcategories);
      updateFilter("subcategory", newSubcategories);
      return;
    }

    const newSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter(s => s !== subcategory)
      : [...selectedSubcategories, subcategory];
    setSelectedSubcategories(newSubcategories);
    updateFilter("subcategory", newSubcategories);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    if (range.from && range.to) {
      updateFilter("dateRange", range);
    }
  };

  const handleAttributeChange = (attribute: string) => {
    setSelectedAttributes([attribute]);
    updateFilter("attributes", [attribute]);
  };

  const clearAllFilters = () => {
    setSelectedModel("ChatGPT");
    setDateRange({ from: undefined, to: undefined });
    setSelectedAttributes([]);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    updateFilter("category", []);
    updateFilter("subcategory", []);
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
      <Card className="absolute top-full right-0 mt-2 w-[480px] shadow-xl border-0 z-50 bg-white rounded-lg overflow-hidden">
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

            {/* Category Filter - Multi-select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#384255]">Category (Multi-select)</label>
              <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 border-gray-300 hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20 text-left"
                  >
                    <span className="truncate">
                      {selectedCategories.length === 0
                        ? "Select categories"
                        : selectedCategories.length === 1
                        ? selectedCategories[0]
                        : `${selectedCategories.length} categories selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[440px] p-0" align="start">
                  <div className="max-h-64 overflow-y-auto">
                    {categoryOptions.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        <Checkbox
                          checked={category === "All Categories" ? selectedCategories.length === 0 : selectedCategories.includes(category)}
                          className="data-[state=checked]:bg-[#9369F6] data-[state=checked]:border-[#9369F6]"
                        />
                        <label className="text-sm font-medium cursor-pointer flex-1">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="text-xs bg-[#9369F6]/10 text-[#9369F6] border-[#9369F6]/20"
                    >
                      {category}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryToggle(category);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategory Filter - Multi-select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#384255]">Subcategory (Multi-select)</label>
              <Popover open={subcategoryPopoverOpen} onOpenChange={setSubcategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 border-gray-300 hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20 text-left"
                  >
                    <span className="truncate">
                      {selectedSubcategories.length === 0
                        ? "Select subcategories"
                        : selectedSubcategories.length === 1
                        ? selectedSubcategories[0]
                        : `${selectedSubcategories.length} subcategories selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[440px] p-0" align="start">
                  <div className="max-h-64 overflow-y-auto">
                    {subcategoryOptions.map((subcategory) => (
                      <div
                        key={subcategory}
                        className="flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSubcategoryToggle(subcategory)}
                      >
                        <Checkbox
                          checked={subcategory === "All Subcategories" ? selectedSubcategories.length === 0 : selectedSubcategories.includes(subcategory)}
                          className="data-[state=checked]:bg-[#9369F6] data-[state=checked]:border-[#9369F6]"
                        />
                        <label className="text-sm font-medium cursor-pointer flex-1">
                          {subcategory}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {selectedSubcategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedSubcategories.map((subcategory) => (
                    <Badge
                      key={subcategory}
                      variant="secondary"
                      className="text-xs bg-[#9369F6]/10 text-[#9369F6] border-[#9369F6]/20"
                    >
                      {subcategory}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubcategoryToggle(subcategory);
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Attributes Filter - Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#384255]">Attributes</label>
              <Select value={selectedAttributes[0] || ""} onValueChange={handleAttributeChange}>
                <SelectTrigger className="h-10 border-gray-300 hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20">
                  <SelectValue placeholder="Select attribute" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="py-2">
                    No attribute selected
                  </SelectItem>
                  {attributeOptions.map((attribute) => (
                    <SelectItem key={attribute} value={attribute} className="py-2">
                      {attribute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAttributes.length > 0 && selectedAttributes[0] && (
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-[#9369F6]/10 text-[#9369F6] border-[#9369F6]/20"
                  >
                    {selectedAttributes[0]}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                      onClick={() => {
                        setSelectedAttributes([]);
                        updateFilter("attributes", []);
                      }}
                    />
                  </Badge>
                </div>
              )}
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
