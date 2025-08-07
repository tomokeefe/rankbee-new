import { FilterState } from "../contexts/FilterContext";

// Mock base data
const baseData = {
  kpiMetrics: {
    brandCoverage: { value: 49, change: 2.1 },
    totalPrompts: { value: "131/267", change: 5.3 },
    averagePosition: { value: "1.59th", change: -0.2 },
    categoryRank: { value: "3rd", change: 1 },
  },

  timeSeriesData: [
    { date: "2025-07-31", coverage: 45, prompts: 120, position: 1.65 },
    { date: "2025-08-01", coverage: 47, prompts: 125, position: 1.62 },
    { date: "2025-08-02", coverage: 48, prompts: 128, position: 1.6 },
    { date: "2025-08-03", coverage: 49, prompts: 131, position: 1.59 },
  ],

  brands: [
    { name: "Olive Garden", coverage: 48, rank: 1.59, logo: "🫒" },
    { name: "Maggiano's", coverage: 63, rank: 2.6, logo: "🍝" },
    { name: "Darden", coverage: 26, rank: 1.04, logo: "🍽️" },
    { name: "Osteria M.", coverage: 35, rank: 2.05, logo: "🇮🇹" },
    { name: "Bloomin' Brands", coverage: 11, rank: 2.83, logo: "🌸" },
    { name: "Carrabba's", coverage: 46, rank: 2.93, logo: "🍷" },
    { name: "Brinker Intl.", coverage: 13, rank: 3.16, logo: "🍔" },
    { name: "Buca Di Beppo", coverage: 52, rank: 3.24, logo: "🍕" },
    { name: "Buca Inc.", coverage: 8.61, rank: 3.61, logo: "🥘" },
    { name: "Pasta Pomodoro", coverage: 11, rank: 4.53, logo: "🍅" },
  ],

  categoryBreakdown: [
    { category: "Italian Restaurant", avgRank: 1.2, change: 8 },
    { category: "Casual Dining", avgRank: 1.8, change: 8 },
    { category: "Family Restaurant", avgRank: 2.1, change: 1 },
    { category: "Chain Restaurant", avgRank: 2.4, change: 1 },
  ],

  demographicBreakdown: [
    { demographic: "Women 55+", avgRank: 1.1, change: 1 },
    { demographic: "Men 35-54", avgRank: 1.4, change: 9 },
    { demographic: "Women 25-34", avgRank: 1.5, change: 8 },
    { demographic: "Men 55+", avgRank: 2.2, change: 6 },
  ],

  subcategoryCoverage: {
    "Olive Garden": 49,
    "Maggiano's": 15,
    "Other Brands": 10,
    "No Coverage": 26,
  },

  citationData: [
    { domain: "tripadvisor.com", citations: 1247, coverage: 23.4, change: 1.8 },
    { domain: "yelp.com", citations: 892, coverage: 18.9, change: -0.7 },
    { domain: "opentable.com", citations: 634, coverage: 12.3, change: 0.3 },
    { domain: "zomato.com", citations: 421, coverage: 8.1, change: 2.2 },
  ],
};

// Apply filters to data
export function getFilteredData(filters: FilterState) {
  // Create filtered data based on filters
  let filteredData = JSON.parse(JSON.stringify(baseData)); // Deep clone

  // Apply brand filter
  if (filters.brand) {
    const brandMultiplier = getBrandMultiplier(filters.brand);
    filteredData.kpiMetrics.brandCoverage.value = Math.round(
      baseData.kpiMetrics.brandCoverage.value * brandMultiplier,
    );
    filteredData.kpiMetrics.totalPrompts.value = `${Math.round(131 * brandMultiplier)}/267`;

    // Filter brands list
    filteredData.brands = filteredData.brands.filter((brand: any) =>
      brand.name
        .toLowerCase()
        .includes(getBrandName(filters.brand).toLowerCase()),
    );
  }

  // Apply category filter
  if (filters.category) {
    const categoryMultiplier = getCategoryMultiplier(filters.category);
    filteredData.kpiMetrics.brandCoverage.value = Math.round(
      filteredData.kpiMetrics.brandCoverage.value * categoryMultiplier,
    );

    // Filter category breakdown
    filteredData.categoryBreakdown = filteredData.categoryBreakdown.filter(
      (cat: any) =>
        cat.category
          .toLowerCase()
          .includes(getCategoryName(filters.category).toLowerCase()),
    );
  }

  // Apply date range filter
  if (filters.dateRange) {
    const startDate = filters.dateRange.from.toISOString().split("T")[0];
    const endDate = filters.dateRange.to.toISOString().split("T")[0];

    filteredData.timeSeriesData = filteredData.timeSeriesData.filter(
      (item: any) => item.date >= startDate && item.date <= endDate,
    );
  }

  // Apply attributes filter
  if (filters.attributes.length > 0) {
    const attributeMultiplier = 1 + filters.attributes.length * 0.1; // 10% boost per attribute
    filteredData.kpiMetrics.brandCoverage.change =
      Math.round(
        filteredData.kpiMetrics.brandCoverage.change * attributeMultiplier * 10,
      ) / 10;
  }

  return filteredData;
}

// Helper functions
function getBrandMultiplier(brand: string): number {
  const multipliers: Record<string, number> = {
    "olive-garden": 1.2,
    maggianos: 0.8,
    darden: 1.5,
    osteria: 0.6,
    bloomin: 0.4,
    carrabba: 0.9,
  };
  return multipliers[brand] || 1;
}

function getBrandName(brand: string): string {
  const names: Record<string, string> = {
    "olive-garden": "Olive Garden",
    maggianos: "Maggiano's",
    darden: "Darden",
    osteria: "Osteria M.",
    bloomin: "Bloomin'",
    carrabba: "Carrabba's",
  };
  return names[brand] || brand;
}

function getCategoryMultiplier(category: string): number {
  const multipliers: Record<string, number> = {
    italian: 1.3,
    casual: 1.1,
    family: 0.9,
    chain: 0.8,
  };
  return multipliers[category] || 1;
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    italian: "Italian Restaurant",
    casual: "Casual Dining",
    family: "Family Restaurant",
    chain: "Chain Restaurant",
  };
  return names[category] || category;
}

// Export function for AI components
export function getMockMetrics(brand: string, timeframe: string) {
  const filters: FilterState = {
    brand,
    category: "",
    attributes: [],
    dateRange: null,
    timeframe
  };

  return getFilteredData(filters);
}
