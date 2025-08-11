import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { X, Filter, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  FileText,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilters } from "../contexts/FilterContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFilterVisibility } from "../contexts/FilterVisibilityContext";

const navItems = [
  {
    name: "Snapshot",
    href: "/",
    icon: BarChart3
  },
  {
    name: "Trends",
    href: "/trends",
    icon: TrendingUp
  },
  {
    name: "Gaps",
    href: "/visibility",
    icon: TrendingDown
  },
  {
    name: "Prompts",
    href: "/prompts",
    icon: MessageSquare
  },
  {
    name: "Citations",
    href: "/citations",
    icon: FileText
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings
  },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
  const { filters, brands, updateFilter } = useFilters();
  const [showFilters, setShowFilters] = useState(false);

  const handleBrandChange = (value: string) => {
    updateFilter("brand", value);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Filter to only show active brands for the selector
  const activeBrands = brands.filter(brand => brand.status === "active");
  const selectedBrand = activeBrands.find((brand) => brand.value === filters.brand);
  const displayName = selectedBrand?.label || (activeBrands.length > 0 ? activeBrands[0].label : "No Brands");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="filters" className="flex-1">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4 bg-gray-100">
            <TabsTrigger
              value="filters"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#9369F6] data-[state=active]:font-semibold data-[state=active]:shadow-sm"
            >
              <Filter className="h-4 w-4" />
              Filters
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#9369F6] data-[state=active]:font-semibold data-[state=active]:shadow-sm"
            >
              <Menu className="h-4 w-4" />
              Menu
            </TabsTrigger>
          </TabsList>

          {/* Filters Tab Content */}
          <TabsContent value="filters" className="p-4 space-y-6">
            {/* Brand Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <Select value={filters.brand} onValueChange={handleBrandChange}>
                <SelectTrigger className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-[#9369F6] focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20">
                  <SelectValue placeholder="Select Brand">
                    {displayName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full">
                  {activeBrands.map((brand) => {
                    const isSelected = filters.brand === brand.value;
                    return (
                      <SelectItem
                        key={brand.value}
                        value={brand.value!}
                        className="py-3 hover:bg-gray-100 focus:bg-purple-100"
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
            </div>

            {/* Advanced Filters Button */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-2 border-gray-300 hover:border-[#9369F6] hover:bg-purple-50"
                onClick={() => {
                  setIsFilterOpen(true);
                  onClose(); // Close mobile menu when opening filters
                }}
              >
                <Filter className="h-4 w-4" />
                Open Filters
              </Button>
            </div>
          </TabsContent>

          {/* Menu Tab Content */}
          <TabsContent value="menu" className="p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <IconComponent className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                    )} />
                    <span className="font-medium">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
