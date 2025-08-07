import { useState } from "react";
import { useFilters } from "../contexts/FilterContext";
import { ChevronDown, Headphones, Filter, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FilterPanel } from "./FilterPanel";

// Available brands
const brands = [
  { value: "olive-garden", label: "Olive Garden" },
  { value: "maggianos", label: "Maggiano's" },
  { value: "darden", label: "Darden" },
  { value: "osteria", label: "Osteria M." },
  { value: "bloomin", label: "Bloomin' Brands" },
  { value: "carrabba", label: "Carrabba's" },
];

export function Header() {
  const { filters, updateFilter } = useFilters();
  const [showFilters, setShowFilters] = useState(false);

  const handleBrandChange = (value: string) => {
    updateFilter("brand", value);
  };

  const selectedBrand = brands.find((brand) => brand.value === filters.brand);
  const displayName = selectedBrand?.label || "Olive Garden";

  return (
    <>
      <header className="bg-white h-[90px] shadow-md relative z-40">
        <div className="flex h-full items-center px-5 gap-9">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center gap-[280px]">
            <div className="flex items-center gap-[25px]">
              {/* Logo */}
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/1aaf17a846b7f6d27c800bb71697497d6f50202a?width=158"
                alt="RankBee Logo"
                className="w-[79px] h-[61px]"
              />

              {/* Divider */}
              <div className="w-px h-[62px] bg-black opacity-20" />

              {/* Company Name */}
              <div className="w-[132px] h-[38px]">
                <span className="text-black font-bold text-[22px] leading-[38px] font-sans">
                  GrowCreate
                </span>
              </div>
            </div>

            {/* Brand Selector and Filter */}
            <div className="flex items-center gap-[13px]">
              <span className="text-[#18181B] font-bold text-[17px] leading-5 opacity-60 font-sans">
                Brand:
              </span>

              {/* Brand Dropdown */}
              <Select value={filters.brand} onValueChange={handleBrandChange}>
                <SelectTrigger className="w-[311px] h-[51px] px-[33px] border border-[#C9C9C9] rounded-full bg-white text-[#384255] font-bold text-[23px] leading-5 justify-center relative [&>svg]:hidden">
                  <SelectValue placeholder="Select Brand" className="text-[#384255] font-bold text-[23px]">
                    {displayName}
                  </SelectValue>
                  <svg className="absolute right-[33px] h-4 w-4 opacity-50" width="10" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.6" d="M5.05078 5.51282L0 0.487305H10.1016L5.05078 5.51282Z" fill="black"/>
                  </svg>
                </SelectTrigger>
                <SelectContent className="min-w-[311px]">
                  {brands.map((brand) => {
                    const isSelected = filters.brand === brand.value;
                    return (
                      <SelectItem
                        key={brand.value}
                        value={brand.value}
                        className="text-lg py-3 hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100 focus:text-gray-900 hover:text-gray-900"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-purple-600' : 'bg-gray-300'}`} />
                          <span className={isSelected ? 'font-semibold' : ''}>{brand.label}</span>
                          {isSelected && (
                            <div className="ml-auto">
                              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Filter Icon */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-5 h-5 text-[#71717A]" strokeWidth={1.33} />
                </Button>

                {/* Filter Panel */}
                {showFilters && (
                  <FilterPanel onClose={() => setShowFilters(false)} />
                )}
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-[10px]">
            {/* Support Button */}
            <Button
              variant="ghost"
              className="h-10 px-4 text-[#9369F6] hover:text-purple-700 hover:bg-purple-50 gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <g clipPath="url(#clip0_24_623)">
                  <path
                    d="M3.28679 3.2863L6.11346 6.11296M9.88673 6.11296L12.7134 3.2863M9.88673 9.88639L12.7134 12.7131M6.11346 9.88639L3.28679 12.7131M14.6667 7.99967C14.6667 11.6816 11.6819 14.6663 8.00001 14.6663C4.31811 14.6663 1.33334 11.6816 1.33334 7.99967C1.33334 4.31778 4.31811 1.33301 8.00001 1.33301C11.6819 1.33301 14.6667 4.31778 14.6667 7.99967ZM10.6667 7.99967C10.6667 9.47243 9.47277 10.6663 8.00001 10.6663C6.52725 10.6663 5.33334 9.47243 5.33334 7.99967C5.33334 6.52692 6.52725 5.33301 8.00001 5.33301C9.47277 5.33301 10.6667 6.52692 10.6667 7.99967Z"
                    stroke="#9369F6"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_24_623">
                    <rect width="16" height="16" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-sm font-medium">Support</span>
            </Button>

            {/* Contact Us Button */}
            <Button
              variant="ghost"
              className="h-10 px-4 text-[#9369F6] hover:text-purple-700 hover:bg-purple-50 gap-2"
            >
              <Mail className="w-4 h-4" strokeWidth={1.33} />
              <span className="text-sm font-medium">Contact Us</span>
            </Button>

            {/* Avatar */}
            <Avatar className="w-10 h-10 rounded-full">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Profile"
              />
              <AvatarFallback className="bg-purple-600 text-white text-sm font-medium">
                TO
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    </>
  );
}
