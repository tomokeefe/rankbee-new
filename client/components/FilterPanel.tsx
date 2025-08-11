import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown, Check } from "lucide-react";
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

// Sample data matching the Figma designs
const categoryOptions = [
  "All",
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
];

const modelOptions = [
  "GPT-4",
  "GPT-3.5",
  "Claude",
  "Gemini"
];

export function FilterPanel({ onClose }: FilterPanelProps) {
  const { filters, updateFilter } = useFilters();
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: new Date(2025, 7, 1), // Aug 01, 2025
    to: new Date(2025, 8, 2)   // Sep 02, 2025
  });
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  
  // Multi-select state for categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : ["Italian Restaurant", "Casual Dining"]
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    Array.isArray(filters.subcategory) ? filters.subcategory : filters.subcategory ? [filters.subcategory] : []
  );
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(true); // Show by default to match Figma

  const handleCategoryToggle = (category: string) => {
    if (category === "All") {
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

  const handleAttributeToggle = (attribute: string) => {
    const newAttributes = selectedAttributes.includes(attribute)
      ? selectedAttributes.filter(a => a !== attribute)
      : [...selectedAttributes, attribute];
    
    setSelectedAttributes(newAttributes);
    updateFilter("attributes", newAttributes);
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-[800px] z-50">
      {/* Main filter row with gray background matching Figma */}
      <div className="bg-[#F3F4F5] px-8 py-3 rounded-lg shadow-lg border">
        <div className="flex items-center gap-3">
          {/* Date Range Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-12 px-4 bg-white border border-[#CAC4D0] rounded-xl text-sm font-medium text-[#49454F] hover:border-[#6750A4]"
              >
                <CalendarIcon className="h-5 w-5 text-[#18181B]" strokeWidth={2} />
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                ) : (
                  "Pick a date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Category Button with counter */}
          <Button
            variant="outline"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`flex items-center gap-2 h-12 px-4 rounded-xl text-sm font-medium border ${
              selectedCategories.length > 0 
                ? 'bg-[#E8DEF8] border-[#6750A4] text-[#49454F]' 
                : 'bg-white border-[#CAC4D0] text-[#49454F]'
            } hover:border-[#6750A4]`}
          >
            <span>Category</span>
            {selectedCategories.length > 0 && (
              <div className="flex items-center justify-center w-5 h-5 rounded-lg bg-[#9369F6] text-white text-xs font-medium">
                {selectedCategories.length}
              </div>
            )}
          </Button>

          {/* Subcategory Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 h-12 px-4 bg-white border border-[#CAC4D0] rounded-xl text-sm font-medium text-[#49454F] hover:border-[#6750A4]"
          >
            <span>Subcategory</span>
            <ChevronDown className="h-5 w-5 text-[#49454F]" />
          </Button>

          {/* Attributes Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 h-12 px-4 bg-white border border-[#CAC4D0] rounded-xl text-sm font-medium text-[#49454F] hover:border-[#6750A4]"
          >
            <span>Attributes</span>
            <ChevronDown className="h-5 w-5 text-[#49454F]" />
          </Button>

          {/* Model Dropdown */}
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="flex items-center gap-2 h-12 px-4 bg-white border border-[#CAC4D0] rounded-xl text-sm font-medium text-[#49454F] hover:border-[#6750A4] w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((model) => (
                <SelectItem key={model} value={model} className="text-sm">
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category chips row - shown when category is open */}
        {showCategoryDropdown && (
          <div className="mt-4 flex flex-wrap gap-1">
            {categoryOptions.map((category) => {
              const isSelected = category === "All" ? selectedCategories.length === 0 : selectedCategories.includes(category);
              
              return (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => handleCategoryToggle(category)}
                  className={`flex items-center gap-2 h-8 px-4 rounded-lg text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-[#E8DEF8] border-transparent text-[#4A4459]'
                      : 'bg-white border-[#CAC4D0] text-[#49454F] hover:border-[#6750A4]'
                  }`}
                >
                  {isSelected && category !== "All" && (
                    <Check className="h-[18px] w-[18px] text-[#4A4459]" strokeWidth={2} />
                  )}
                  <span className={isSelected ? 'text-[#4A4459]' : 'text-[#49454F]'}>
                    {category}
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
