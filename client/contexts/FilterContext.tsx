import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FilterState {
  dateRange?: DateRange | null;
  brand: string;
  category?: string;
  subcategory?: string;
  priceRange?: string;
  attributes?: string[];
}

export interface FilterContextType {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  dateRange: null,
  brand: "olive-garden", // Auto-select first brand
  category: "All Categories",
  subcategory: "All Subcategories",
  priceRange: "",
  attributes: [],
};

// Create default context value
const defaultContextValue: FilterContextType = {
  filters: defaultFilters,
  updateFilter: () => {
    console.warn("updateFilter called outside of FilterProvider");
  },
  resetFilters: () => {
    console.warn("resetFilters called outside of FilterProvider");
  },
};

const FilterContext = createContext<FilterContextType>(defaultContextValue);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const contextValue: FilterContextType = {
    filters,
    updateFilter,
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
