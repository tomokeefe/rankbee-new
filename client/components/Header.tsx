import { useFilters } from "../contexts/FilterContext";
import { ChevronDown, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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

  const handleBrandChange = (value: string) => {
    updateFilter("brand", value);
  };

  const selectedBrand = brands.find((brand) => brand.value === filters.brand);
  const displayName = selectedBrand?.label || "Select Brand";

  return (
    <header className="bg-white border-b border-gray-200 h-20">
      <div className="flex h-full items-center px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/3c2b6f10ebb36a0892d78be49e87b8a3f7b89f0d?width=112"
            alt="RankBee Logo"
            className="w-14 h-14"
          />
        </div>

        {/* Brand Selector */}
        <div className="flex items-center gap-4 ml-6">
          <span className="text-gray-600 font-medium">Brand:</span>
          <Select value={filters.brand} onValueChange={handleBrandChange}>
            <SelectTrigger className="w-[300px] h-12 border-gray-300 rounded-full bg-gray-50 text-lg font-semibold">
              <SelectValue placeholder="Select Brand">
                {displayName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="min-w-[300px]">
              {brands.map((brand) => (
                <SelectItem
                  key={brand.value}
                  value={brand.value}
                  className="text-lg py-3 hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100 focus:text-gray-900 hover:text-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                    {brand.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {/* Support Button */}
          <Button
            variant="ghost"
            className="h-10 px-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Headphones className="w-4 h-4 mr-2" />
            Support
          </Button>

          {/* Contact Us Button */}
          <Button
            variant="ghost"
            className="h-10 px-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            Contact Us
          </Button>

          {/* Avatar */}
          <Avatar className="w-10 h-10">
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
  );
}
