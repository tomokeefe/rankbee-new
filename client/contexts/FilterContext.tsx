import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterState {
  dateRange: DateRange;
  brand: string;
  category: string;
  subcategory: string;
  priceRange: string;
  attributes: string[];
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
  dateRange: {
    from: new Date(2025, 6, 31), // Jul 31, 2025
    to: new Date(2025, 7, 3), // Aug 3, 2025
  },
  brand: "olive-garden", // Auto-select first brand
  category: "",
  subcategory: "",
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
