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
  
  // Multi-select state for all filter types
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Italian Restaurant", "Casual Dining"]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  
  // Single dropdown state - only one can be open at a time
  const [activeDropdown, setActiveDropdown] = useState<string | null>("category"); // Default to category open

  // Calculate total selected filters for badge
  const totalSelectedFilters = selectedCategories.length + selectedSubcategories.length + selectedAttributes.length + (selectedModel ? 1 : 0);

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

  const handleModelSelect = (model: string) => {
    const newModel = selectedModel === model ? "" : model;
    setSelectedModel(newModel);
    setShowModelDropdown(false);
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
            className={`flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${
              selectedCategories.length > 0 
                ? 'border-[#6750A4] bg-[#E8DEF8]' 
                : 'border-[#CAC4D0] bg-white hover:border-[#6750A4]'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
          >
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Category
              </span>
              {selectedCategories.length > 0 && (
                <div className="flex items-center justify-center w-5 h-[18px] rounded-lg bg-[#9369F6]">
                  <span className="text-sm font-medium text-white leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                    {selectedCategories.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Subcategory Button with counter */}
          <div 
            className={`flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${
              selectedSubcategories.length > 0 
                ? 'border-[#6750A4] bg-[#E8DEF8]' 
                : 'border-[#CAC4D0] bg-white hover:border-[#6750A4]'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === "subcategory" ? null : "subcategory")}
          >
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Subcategory
              </span>
              {selectedSubcategories.length > 0 && (
                <div className="flex items-center justify-center w-5 h-[18px] rounded-lg bg-[#9369F6]">
                  <span className="text-sm font-medium text-white leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                    {selectedSubcategories.length}
                  </span>
                </div>
              )}
              <ChevronDown className="h-5 w-5 text-[#49454F]" />
            </div>
          </div>

          {/* Attributes Button with counter */}
          <div 
            className={`flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${
              selectedAttributes.length > 0 
                ? 'border-[#6750A4] bg-[#E8DEF8]' 
                : 'border-[#CAC4D0] bg-white hover:border-[#6750A4]'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === "attributes" ? null : "attributes")}
          >
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Attributes
              </span>
              {selectedAttributes.length > 0 && (
                <div className="flex items-center justify-center w-5 h-[18px] rounded-lg bg-[#9369F6]">
                  <span className="text-sm font-medium text-white leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                    {selectedAttributes.length}
                  </span>
                </div>
              )}
              <ChevronDown className="h-5 w-5 text-[#49454F]" />
            </div>
          </div>

          {/* Model Button with indicator */}
          <div 
            className={`flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${
              selectedModel 
                ? 'border-[#6750A4] bg-[#E8DEF8]' 
                : 'border-[#CAC4D0] bg-white hover:border-[#6750A4]'
            }`}
            onClick={() => setActiveDropdown(activeDropdown === "model" ? null : "model")}
          >
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                {selectedModel || "Model"}
              </span>
              <ChevronDown className="h-5 w-5 text-[#49454F]" />
            </div>
          </div>
        </div>

        {/* Category chips row */}
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

        {/* Subcategory chips row */}
        {showSubcategoryDropdown && (
          <div className="mt-4 flex flex-wrap gap-[5px]">
            {subcategoryOptions.map((subcategory) => {
              const isSelected = subcategory === "All Subcategories" ? selectedSubcategories.length === 0 : selectedSubcategories.includes(subcategory);
              
              return (
                <div
                  key={subcategory}
                  onClick={() => handleSubcategoryToggle(subcategory)}
                  className={`flex items-center justify-center h-8 rounded-lg border cursor-pointer transition-all ${
                    isSelected && subcategory !== "All Subcategories"
                      ? 'bg-[#E8DEF8] border-transparent'
                      : 'bg-white border-[#CAC4D0] hover:border-[#6750A4]'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isSelected && subcategory !== "All Subcategories" ? 'px-2 pr-4' : 'px-4'
                  } py-[6px]`}>
                    {isSelected && subcategory !== "All Subcategories" && (
                      <Check className="h-[18px] w-[18px] text-[#4A4459]" strokeWidth={2} />
                    )}
                    <span className={`text-sm font-medium leading-5 tracking-[0.1px] ${
                      isSelected && subcategory !== "All Subcategories" ? 'text-[#4A4459]' : 'text-[#49454F]'
                    }`} style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {subcategory}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Attributes chips row */}
        {showAttributesDropdown && (
          <div className="mt-4 flex flex-wrap gap-[5px]">
            {attributeOptions.map((attribute) => {
              const isSelected = selectedAttributes.includes(attribute);
              
              return (
                <div
                  key={attribute}
                  onClick={() => handleAttributeToggle(attribute)}
                  className={`flex items-center justify-center h-8 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#E8DEF8] border-transparent'
                      : 'bg-white border-[#CAC4D0] hover:border-[#6750A4]'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isSelected ? 'px-2 pr-4' : 'px-4'
                  } py-[6px]`}>
                    {isSelected && (
                      <Check className="h-[18px] w-[18px] text-[#4A4459]" strokeWidth={2} />
                    )}
                    <span className={`text-sm font-medium leading-5 tracking-[0.1px] ${
                      isSelected ? 'text-[#4A4459]' : 'text-[#49454F]'
                    }`} style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {attribute}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Model chips row */}
        {showModelDropdown && (
          <div className="mt-4 flex flex-wrap gap-[5px]">
            {modelOptions.map((model) => {
              const isSelected = selectedModel === model;
              
              return (
                <div
                  key={model}
                  onClick={() => handleModelSelect(model)}
                  className={`flex items-center justify-center h-8 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#E8DEF8] border-transparent'
                      : 'bg-white border-[#CAC4D0] hover:border-[#6750A4]'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isSelected ? 'px-2 pr-4' : 'px-4'
                  } py-[6px]`}>
                    {isSelected && (
                      <Check className="h-[18px] w-[18px] text-[#4A4459]" strokeWidth={2} />
                    )}
                    <span className={`text-sm font-medium leading-5 tracking-[0.1px] ${
                      isSelected ? 'text-[#4A4459]' : 'text-[#49454F]'
                    }`} style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      {model}
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
