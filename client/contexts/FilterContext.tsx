import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface Brand {
  id: string;
  name: string;
  url: string;
  category: string;
  status: "active" | "inactive";
  addedDate: string;
  description?: string;
  value?: string; // For compatibility with selector
  label?: string; // For compatibility with selector
}

export interface FilterState {
  dateRange?: DateRange | null;
  brand: string;
  category?: string[];
  subcategory?: string[];
  priceRange?: string;
  attributes?: string[];
  // Filter panel specific state
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedAttributes: string[];
  selectedModel: string;
  activeDropdown: string | null;
  filterDateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export interface FilterContextType {
  filters: FilterState;
  brands: Brand[];
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  resetFilters: () => void;
}

const defaultBrands: Brand[] = [
  {
    id: "1",
    name: "Olive Garden",
    url: "https://www.olivegarden.com",
    category: "Casual Dining",
    status: "active",
    addedDate: "2025-01-01",
    description: "Family-friendly Italian restaurant chain",
    value: "olive-garden",
    label: "Olive Garden"
  },
  {
    id: "2",
    name: "Maggiano's",
    url: "https://www.maggianos.com",
    category: "Fine Dining",
    status: "active",
    addedDate: "2025-01-05",
    description: "Upscale Italian restaurant",
    value: "maggianos",
    label: "Maggiano's"
  },
  {
    id: "3",
    name: "Darden",
    url: "https://www.darden.com",
    category: "Restaurant Group",
    status: "active",
    addedDate: "2024-12-20",
    description: "Restaurant holding company",
    value: "darden",
    label: "Darden"
  },
  {
    id: "4",
    name: "Osteria M.",
    url: "https://www.osteria.com",
    category: "Fine Dining",
    status: "active",
    addedDate: "2024-12-25",
    description: "Authentic Italian dining",
    value: "osteria",
    label: "Osteria M."
  },
  {
    id: "5",
    name: "Bloomin' Brands",
    url: "https://www.bloominbrands.com",
    category: "Restaurant Group",
    status: "active",
    addedDate: "2024-12-10",
    description: "Restaurant holding company",
    value: "bloomin",
    label: "Bloomin' Brands"
  },
  {
    id: "6",
    name: "Carrabba's",
    url: "https://www.carrabbas.com",
    category: "Casual Dining",
    status: "active",
    addedDate: "2024-12-15",
    description: "Italian-American restaurant chain",
    value: "carrabba",
    label: "Carrabba's"
  }
];

const defaultFilters: FilterState = {
  dateRange: null,
  brand: "olive-garden", // Auto-select first brand
  category: [],
  subcategory: [],
  priceRange: "",
  attributes: [],
  // Filter panel defaults
  selectedCategories: [],
  selectedSubcategories: [],
  selectedAttributes: [],
  selectedModel: "",
  activeDropdown: null,
  filterDateRange: {
    from: new Date(2025, 7, 1), // Aug 01, 2025
    to: new Date(2025, 8, 2)   // Sep 02, 2025
  },
};

// Create default context value
const defaultContextValue: FilterContextType = {
  filters: defaultFilters,
  brands: defaultBrands,
  updateFilter: () => {
    console.warn("updateFilter called outside of FilterProvider");
  },
  addBrand: () => {
    console.warn("addBrand called outside of FilterProvider");
  },
  updateBrand: () => {
    console.warn("updateBrand called outside of FilterProvider");
  },
  deleteBrand: () => {
    console.warn("deleteBrand called outside of FilterProvider");
  },
  resetFilters: () => {
    console.warn("resetFilters called outside of FilterProvider");
  },
};

const FilterContext = createContext<FilterContextType>(defaultContextValue);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [brands, setBrands] = useState<Brand[]>(defaultBrands);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addBrand = (newBrand: Omit<Brand, 'id'>) => {
    const brand: Brand = {
      ...newBrand,
      id: Date.now().toString(),
      value: newBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      label: newBrand.name,
    };
    setBrands((prev) => [...prev, brand]);
  };

  const updateBrand = (id: string, updatedBrand: Partial<Brand>) => {
    setBrands((prev) =>
      prev.map(brand =>
        brand.id === id
          ? {
              ...brand,
              ...updatedBrand,
              value: updatedBrand.name ? updatedBrand.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : brand.value,
              label: updatedBrand.name || brand.label
            }
          : brand
      )
    );
  };

  const deleteBrand = (id: string) => {
    setBrands((prev) => prev.filter(brand => brand.id !== id));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const contextValue: FilterContextType = {
    filters,
    brands,
    updateFilter,
    addBrand,
    updateBrand,
    deleteBrand,
    resetFilters,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  return context;
}
