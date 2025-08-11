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
  "All",
  "Traditional Italian",
  "Modern Italian",
  "Pizza & Pasta",
  "Wine & Dine",
  "Family Style",
  "Corporate Dining",
];

const attributeOptions = [
  "All",
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

  // Use filter state from context
  const {
    selectedCategories,
    selectedSubcategories,
    selectedAttributes,
    selectedModel,
    activeDropdown,
    filterDateRange
  } = filters;

  // Calculate total selected filters for badge
  const totalSelectedFilters = selectedCategories.length + selectedSubcategories.length + selectedAttributes.length + (selectedModel ? 1 : 0);

  const handleCategoryToggle = (category: string) => {
    if (category === "All") {
      // Select all categories (excluding "All" itself)
      const allCategories = categoryOptions.filter(cat => cat !== "All");
      const newCategories = selectedCategories.length === allCategories.length ? [] : allCategories;
      updateFilter("selectedCategories", newCategories);
      return;
    }

    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    updateFilter("selectedCategories", newCategories);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    if (subcategory === "All") {
      // Select all subcategories (excluding "All" itself)
      const allSubcategories = subcategoryOptions.filter(sub => sub !== "All");
      const newSubcategories = selectedSubcategories.length === allSubcategories.length ? [] : allSubcategories;
      updateFilter("selectedSubcategories", newSubcategories);
      return;
    }

    const newSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter(s => s !== subcategory)
      : [...selectedSubcategories, subcategory];

    updateFilter("selectedSubcategories", newSubcategories);
  };

  const handleAttributeToggle = (attribute: string) => {
    if (attribute === "All") {
      // Select all attributes (excluding "All" itself)
      const allAttributes = attributeOptions.filter(attr => attr !== "All");
      const newAttributes = selectedAttributes.length === allAttributes.length ? [] : allAttributes;
      updateFilter("selectedAttributes", newAttributes);
      return;
    }

    const newAttributes = selectedAttributes.includes(attribute)
      ? selectedAttributes.filter(a => a !== attribute)
      : [...selectedAttributes, attribute];

    updateFilter("selectedAttributes", newAttributes);
  };

  const handleModelSelect = (model: string) => {
    const newModel = selectedModel === model ? "" : model;
    updateFilter("selectedModel", newModel);
    updateFilter("activeDropdown", null);
  };

  return (
    <div className="fixed top-[90px] left-0 right-0 bg-[#F3F4F5] border-t border-gray-200 z-50">
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
                    {filterDateRange.from && filterDateRange.to ? (
                      `${format(filterDateRange.from, "MMM dd, yyyy")} - ${format(filterDateRange.to, "MMM dd, yyyy")}`
                    ) : filterDateRange.from ? (
                      format(filterDateRange.from, "MMM dd, yyyy")
                    ) : (
                      "Select date range"
                    )}
                  </span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={filterDateRange.from}
                selected={filterDateRange}
                onSelect={(newDateRange) => updateFilter("filterDateRange", newDateRange || { from: undefined, to: undefined })}
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
            onClick={() => updateFilter("activeDropdown", activeDropdown === "category" ? null : "category")}
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
              <ChevronDown className={`h-5 w-5 text-[#49454F] transition-transform duration-200 ${activeDropdown === "category" ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Subcategory Button with counter */}
          <div 
            className={`flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${
              selectedSubcategories.length > 0 
                ? 'border-[#6750A4] bg-[#E8DEF8]' 
                : 'border-[#CAC4D0] bg-white hover:border-[#6750A4]'
            }`}
            onClick={() => updateFilter("activeDropdown", activeDropdown === "subcategory" ? null : "subcategory")}
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
              <ChevronDown className={`h-5 w-5 text-[#49454F] transition-transform duration-200 ${activeDropdown === "subcategory" ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Attributes Button with counter */}
          <div 
            className={`flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${
              selectedAttributes.length > 0 
                ? 'border-[#6750A4] bg-[#E8DEF8]' 
                : 'border-[#CAC4D0] bg-white hover:border-[#6750A4]'
            }`}
            onClick={() => updateFilter("activeDropdown", activeDropdown === "attributes" ? null : "attributes")}
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
              <ChevronDown className={`h-5 w-5 text-[#49454F] transition-transform duration-200 ${activeDropdown === "attributes" ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Model Button with indicator */}
          <div 
            className={`flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${
              selectedModel 
                ? 'border-[#6750A4] bg-[#E8DEF8]' 
                : 'border-[#CAC4D0] bg-white hover:border-[#6750A4]'
            }`}
            onClick={() => updateFilter("activeDropdown", activeDropdown === "model" ? null : "model")}
          >
            <div className="flex items-center gap-2 px-4 py-[10px]">
              <span className="text-sm font-medium text-[#49454F] leading-5 tracking-[0.1px]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                {selectedModel || "Model"}
              </span>
              <ChevronDown className={`h-5 w-5 text-[#49454F] transition-transform duration-200 ${activeDropdown === "model" ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {/* Category chips row */}
        {activeDropdown === "category" && (
          <div className="mt-4 flex flex-wrap gap-[5px]">
            {categoryOptions.map((category) => {
              const allCategoriesSelected = selectedCategories.length === categoryOptions.filter(cat => cat !== "All").length;
              const isSelected = category === "All" ? allCategoriesSelected : selectedCategories.includes(category);
              
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
        {activeDropdown === "subcategory" && (
          <div className="mt-4 flex flex-wrap gap-[5px]">
            {subcategoryOptions.map((subcategory) => {
              const allSubcategoriesSelected = selectedSubcategories.length === subcategoryOptions.filter(sub => sub !== "All").length;
              const isSelected = subcategory === "All" ? allSubcategoriesSelected : selectedSubcategories.includes(subcategory);
              
              return (
                <div
                  key={subcategory}
                  onClick={() => handleSubcategoryToggle(subcategory)}
                  className={`flex items-center justify-center h-8 rounded-lg border cursor-pointer transition-all ${
                    isSelected && subcategory !== "All"
                      ? 'bg-[#E8DEF8] border-transparent'
                      : 'bg-white border-[#CAC4D0] hover:border-[#6750A4]'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isSelected && subcategory !== "All" ? 'px-2 pr-4' : 'px-4'
                  } py-[6px]`}>
                    {isSelected && subcategory !== "All" && (
                      <Check className="h-[18px] w-[18px] text-[#4A4459]" strokeWidth={2} />
                    )}
                    <span className={`text-sm font-medium leading-5 tracking-[0.1px] ${
                      isSelected && subcategory !== "All" ? 'text-[#4A4459]' : 'text-[#49454F]'
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
        {activeDropdown === "attributes" && (
          <div className="mt-4 flex flex-wrap gap-[5px]">
            {attributeOptions.map((attribute) => {
              const allAttributesSelected = selectedAttributes.length === attributeOptions.filter(attr => attr !== "All").length;
              const isSelected = attribute === "All" ? allAttributesSelected : selectedAttributes.includes(attribute);
              
              return (
                <div
                  key={attribute}
                  onClick={() => handleAttributeToggle(attribute)}
                  className={`flex items-center justify-center h-8 rounded-lg border cursor-pointer transition-all ${
                    isSelected && attribute !== "All"
                      ? 'bg-[#E8DEF8] border-transparent'
                      : 'bg-white border-[#CAC4D0] hover:border-[#6750A4]'
                  }`}
                >
                  <div className={`flex items-center gap-2 ${
                    isSelected && attribute !== "All" ? 'px-2 pr-4' : 'px-4'
                  } py-[6px]`}>
                    {isSelected && attribute !== "All" && (
                      <Check className="h-[18px] w-[18px] text-[#4A4459]" strokeWidth={2} />
                    )}
                    <span className={`text-sm font-medium leading-5 tracking-[0.1px] ${
                      isSelected && attribute !== "All" ? 'text-[#4A4459]' : 'text-[#49454F]'
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
        {activeDropdown === "model" && (
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
