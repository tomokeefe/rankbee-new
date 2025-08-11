import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown, Check } from "lucide-react";
import { Button } from "./ui/button";
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

export function FilterPanel({ onClose }: FilterPanelProps) {
  const { filters, updateFilter } = useFilters();
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: new Date(2025, 7, 1), // Aug 01, 2025
    to: new Date(2025, 8, 2)   // Sep 02, 2025
  });
  
  // Multi-select state for categories - default to Italian Restaurant and Casual Dining selected
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Italian Restaurant", "Casual Dining"]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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

  return (
    <div className="fixed left-0 right-0 top-[90px] z-40 bg-[#F3F4F5] border-t border-gray-200">
      <div className="max-w-[1600px] mx-auto px-8 py-3">
        {/* Main filter row */}
        <div className="flex items-center gap-[11px]">
          {/* Date Range Button */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center justify-center border border-[#CAC4D0] rounded-xl bg-white hover:border-[#6750A4] transition-colors cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-[10px]">
                  <CalendarIcon className="h-5 w-5 text-[#18181B]" strokeWidth={2} />
                  <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                    Aug 01, 2025 - Sep 02, 2025
                  </span>
                </div>
              </div>
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
          <div 
            className="flex items-center justify-center border border-[#6750A4] rounded-xl bg-[#E8DEF8] hover:border-[#6750A4] transition-colors cursor-pointer"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Category
              </span>
              <div className="flex items-center justify-center w-5 h-[18px] rounded-lg bg-[#9369F6]">
                <span className="text-sm font-medium text-white leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                  2
                </span>
              </div>
            </div>
          </div>

          {/* Subcategory Button */}
          <div className="flex items-center justify-center border border-[#CAC4D0] rounded-xl bg-white hover:border-[#6750A4] transition-colors cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Subcategory
              </span>
              <ChevronDown className="h-5 w-5 text-[#49454F]" />
            </div>
          </div>

          {/* Attributes Button */}
          <div className="flex items-center justify-center border border-[#CAC4D0] rounded-xl bg-white hover:border-[#6750A4] transition-colors cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Attributes
              </span>
              <ChevronDown className="h-5 w-5 text-[#49454F]" />
            </div>
          </div>

          {/* Model Button */}
          <div className="flex items-center justify-center border border-[#CAC4D0] rounded-xl bg-white hover:border-[#6750A4] transition-colors cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Model
              </span>
              <ChevronDown className="h-5 w-5 text-[#49454F]" />
            </div>
          </div>
        </div>

        {/* Category chips row - shown when category is open */}
        {showCategoryDropdown && (
          <div className="mt-4 flex flex-wrap gap-[5px]">
            {categoryOptions.map((category) => {
              const isSelected = category === "All" ? selectedCategories.length === 0 : selectedCategories.includes(category);
              
              return (
                <div
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`flex items-center justify-center h-8 rounded-lg border cursor-pointer transition-all ${
                    isSelected && category !== "All"
                      ? 'bg-[#E8DEF8] border-transparent'
                      : 'bg-white border-[#CAC4D0] hover:border-[#6750A4]'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isSelected && category !== "All" ? 'px-2 pr-4' : 'px-4'
                  } py-[6px]`}>
                    {isSelected && category !== "All" && (
                      <Check className="h-[18px] w-[18px] text-[#4A4459]" strokeWidth={2} />
                    )}
                    <span className={`text-sm font-medium leading-5 tracking-[0.1px] ${
                      isSelected && category !== "All" ? 'text-[#4A4459]' : 'text-[#49454F]'
                    }`} style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
