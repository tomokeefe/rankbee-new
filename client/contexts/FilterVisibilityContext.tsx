import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterVisibilityContextType {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

const FilterVisibilityContext = createContext<FilterVisibilityContextType | undefined>(undefined);

export function FilterVisibilityProvider({ children }: { children: ReactNode }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <FilterVisibilityContext.Provider value={{ isFilterOpen, setIsFilterOpen }}>
      {children}
    </FilterVisibilityContext.Provider>
  );
}

export function useFilterVisibility() {
  const context = useContext(FilterVisibilityContext);
  if (context === undefined) {
    throw new Error('useFilterVisibility must be used within a FilterVisibilityProvider');
  }
  return context;
}
