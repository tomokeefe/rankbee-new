import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
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

// Sample data matching the screenshots
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
    from: new Date(2023, 7, 1), // Aug 01, 2023
    to: new Date(2023, 8, 30)   // Sep 30, 2023
  });
  const [selectedModel, setSelectedModel] = useState("GPT-4");
  
  // Multi-select state for categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(filters.category) ? filters.category : filters.category ? [filters.category] : []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    Array.isArray(filters.subcategory) ? filters.subcategory : filters.subcategory ? [filters.subcategory] : []
  );
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [showAttributesDropdown, setShowAttributesDropdown] = useState(false);

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

  const removeCategoryBadge = (category: string) => {
    const newCategories = selectedCategories.filter(c => c !== category);
    setSelectedCategories(newCategories);
    updateFilter("category", newCategories);
  };

  const removeSubcategoryBadge = (subcategory: string) => {
    const newSubcategories = selectedSubcategories.filter(s => s !== subcategory);
    setSelectedSubcategories(newSubcategories);
    updateFilter("subcategory", newSubcategories);
  };

  const removeAttributeBadge = (attribute: string) => {
    const newAttributes = selectedAttributes.filter(a => a !== attribute);
    setSelectedAttributes(newAttributes);
    updateFilter("attributes", newAttributes);
  };

  return (
    <Card className="absolute top-full right-0 mt-2 w-[400px] shadow-lg border z-50 bg-white rounded-lg overflow-hidden">
      <CardContent className="p-0">
        {/* Filter content layout matching screenshot */}
        <div className="p-4 space-y-4">
          {/* First row - Date Range */}
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal h-8 px-3 border-gray-300 bg-gray-100 text-sm text-gray-700 min-w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
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
          </div>

          {/* Second row - Category, Subcategory, Attributes, Model */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category Dropdown */}
            <div className="relative">
              <Popover open={showCategoryDropdown} onOpenChange={setShowCategoryDropdown}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 px-3 border-gray-300 bg-white text-sm text-gray-700 min-w-[100px] justify-between"
                  >
                    <span>Category</span>
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs bg-purple-100 text-purple-700">
                        {selectedCategories.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="space-y-1">
                    {categoryOptions.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        <div className={`w-3 h-3 border border-gray-300 rounded-sm flex items-center justify-center ${
                          (category === "All" && selectedCategories.length === 0) || 
                          (category !== "All" && selectedCategories.includes(category))
                            ? 'bg-purple-600 border-purple-600' 
                            : 'bg-white'
                        }`}>
                          {((category === "All" && selectedCategories.length === 0) || 
                            (category !== "All" && selectedCategories.includes(category))) && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{category}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Subcategory Dropdown */}
            <div className="relative">
              <Popover open={showSubcategoryDropdown} onOpenChange={setShowSubcategoryDropdown}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 px-3 border-gray-300 bg-white text-sm text-gray-700 min-w-[110px] justify-between"
                  >
                    <span>Subcategory</span>
                    {selectedSubcategories.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs bg-purple-100 text-purple-700">
                        {selectedSubcategories.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="space-y-1">
                    {subcategoryOptions.map((subcategory) => (
                      <div
                        key={subcategory}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => handleSubcategoryToggle(subcategory)}
                      >
                        <div className={`w-3 h-3 border border-gray-300 rounded-sm flex items-center justify-center ${
                          (subcategory === "All Subcategories" && selectedSubcategories.length === 0) || 
                          (subcategory !== "All Subcategories" && selectedSubcategories.includes(subcategory))
                            ? 'bg-purple-600 border-purple-600' 
                            : 'bg-white'
                        }`}>
                          {((subcategory === "All Subcategories" && selectedSubcategories.length === 0) || 
                            (subcategory !== "All Subcategories" && selectedSubcategories.includes(subcategory))) && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{subcategory}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Attributes Dropdown */}
            <div className="relative">
              <Popover open={showAttributesDropdown} onOpenChange={setShowAttributesDropdown}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 px-3 border-gray-300 bg-white text-sm text-gray-700 min-w-[90px] justify-between"
                  >
                    <span>Attributes</span>
                    {selectedAttributes.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs bg-purple-100 text-purple-700">
                        {selectedAttributes.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="space-y-1">
                    {attributeOptions.map((attribute) => (
                      <div
                        key={attribute}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => handleAttributeToggle(attribute)}
                      >
                        <div className={`w-3 h-3 border border-gray-300 rounded-sm flex items-center justify-center ${
                          selectedAttributes.includes(attribute) ? 'bg-purple-600 border-purple-600' : 'bg-white'
                        }`}>
                          {selectedAttributes.includes(attribute) && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{attribute}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Model Dropdown */}
            <div className="relative">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="h-8 px-3 border-gray-300 bg-white text-sm text-gray-700 min-w-[80px]">
                  <SelectValue />
                  <ChevronDown className="ml-1 h-3 w-3" />
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
          </div>

          {/* Third row - Selected badges */}
          <div className="flex flex-wrap gap-2">
            {/* Category badges */}
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="h-6 px-2 text-xs bg-gray-100 text-gray-700 border border-gray-300 flex items-center gap-1"
              >
                {category}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-gray-900" 
                  onClick={() => removeCategoryBadge(category)}
                />
              </Badge>
            ))}
            
            {/* Subcategory badges */}
            {selectedSubcategories.map((subcategory) => (
              <Badge
                key={subcategory}
                variant="secondary"
                className="h-6 px-2 text-xs bg-gray-100 text-gray-700 border border-gray-300 flex items-center gap-1"
              >
                {subcategory}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-gray-900" 
                  onClick={() => removeSubcategoryBadge(subcategory)}
                />
              </Badge>
            ))}

            {/* Attribute badges */}
            {selectedAttributes.map((attribute) => (
              <Badge
                key={attribute}
                variant="secondary"
                className="h-6 px-2 text-xs bg-gray-100 text-gray-700 border border-gray-300 flex items-center gap-1"
              >
                {attribute}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-gray-900" 
                  onClick={() => removeAttributeBadge(attribute)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
