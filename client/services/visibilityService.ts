import { analyzeDashboardData } from "./geminiService";

export interface VisibilityData {
  overallVisibility: number;
  searchImpressions: number;
  clickThroughRate: number;
  marketShare: number;
  trends: VisibilityTrend[];
  platforms: PlatformData[];
  competitors: CompetitorData[];
  keywordCategories: KeywordCategory[];
}

export interface VisibilityTrend {
  month: string;
  visibility: number;
  impressions: number;
  clicks: number;
}

export interface PlatformData {
  platform: string;
  visibility: number;
  color: string;
}

export interface CompetitorData {
  name: string;
  visibility: number;
  rank: number;
  change: number;
}

export interface KeywordCategory {
  category: string;
  visibility: number;
  keywords: number;
  avgPosition: number;
}

const brandMultipliers: Record<string, number> = {
  "olive-garden": 1.0,
  "maggianos": 0.9,
  "darden": 1.1,
  "osteria": 0.7,
  "bloomin": 0.8,
  "carrabba": 0.85,
};

const baseTrends: VisibilityTrend[] = [
  { month: "Jan", visibility: 65, impressions: 12500, clicks: 850 },
  { month: "Feb", visibility: 68, impressions: 13200, clicks: 920 },
  { month: "Mar", visibility: 72, impressions: 14100, clicks: 1020 },
  { month: "Apr", visibility: 75, impressions: 15800, clicks: 1150 },
  { month: "May", visibility: 78, impressions: 16900, clicks: 1280 },
  { month: "Jun", visibility: 82, impressions: 18200, clicks: 1450 },
];

const basePlatforms: PlatformData[] = [
  { platform: "Google Search", visibility: 85, color: "#4285f4" },
  { platform: "Bing", visibility: 62, color: "#00809d" },
  { platform: "YouTube", visibility: 78, color: "#ff0000" },
  { platform: "Google Maps", visibility: 91, color: "#34a853" },
  { platform: "Social Media", visibility: 55, color: "#1da1f2" },
];

const baseKeywordCategories: KeywordCategory[] = [
  { category: "Brand Terms", visibility: 95, keywords: 245, avgPosition: 1.2 },
  { category: "Product Terms", visibility: 78, keywords: 1580, avgPosition: 2.8 },
  { category: "Category Terms", visibility: 62, keywords: 890, avgPosition: 4.1 },
  { category: "Competitor Terms", visibility: 45, keywords: 320, avgPosition: 6.2 },
];

export function getBrandVisibilityData(brandValue: string): VisibilityData {
  const multiplier = brandMultipliers[brandValue] || 1.0;
  
  const trends = baseTrends.map(trend => ({
    ...trend,
    visibility: Math.round(trend.visibility * multiplier),
    impressions: Math.round(trend.impressions * multiplier),
    clicks: Math.round(trend.clicks * multiplier),
  }));

  const platforms = basePlatforms.map(platform => ({
    ...platform,
    visibility: Math.round(platform.visibility * multiplier),
  }));

  const keywordCategories = baseKeywordCategories.map(category => ({
    ...category,
    visibility: Math.round(category.visibility * multiplier),
    keywords: Math.round(category.keywords * multiplier),
  }));

  // Generate competitors with the selected brand as "Your Brand"
  const competitors: CompetitorData[] = [
    { name: "Your Brand", visibility: Math.round(82 * multiplier), rank: 1, change: +5 },
    { name: "Competitor A", visibility: 79, rank: 2, change: -2 },
    { name: "Competitor B", visibility: 76, rank: 3, change: +1 },
    { name: "Competitor C", visibility: 71, rank: 4, change: -3 },
    { name: "Competitor D", visibility: 68, rank: 5, change: +2 },
  ].sort((a, b) => b.visibility - a.visibility);

  return {
    overallVisibility: Math.round(82 * multiplier),
    searchImpressions: Math.round(18200 * multiplier),
    clickThroughRate: Number((7.8 * multiplier).toFixed(1)),
    marketShare: Number((24.5 * multiplier).toFixed(1)),
    trends,
    platforms,
    competitors,
    keywordCategories,
  };
}

export function getBrandDisplayName(brandValue: string): string {
  const brandNames: Record<string, string> = {
    "olive-garden": "Olive Garden",
    "maggianos": "Maggiano's", 
    "darden": "Darden",
    "osteria": "Osteria M.",
    "bloomin": "Bloomin' Brands",
    "carrabba": "Carrabba's",
  };
  return brandNames[brandValue] || "Brand";
}

export async function generateVisibilityInsights(brandValue: string): Promise<any[]> {
  try {
    const visibilityData = getBrandVisibilityData(brandValue);
    const brandName = getBrandDisplayName(brandValue);
    
    const insightsData = {
      brandName,
      ...visibilityData,
      performanceTrend: visibilityData.trends.slice(-3),
      topPlatforms: visibilityData.platforms.sort((a, b) => b.visibility - a.visibility).slice(0, 3),
    };

    const insights = await analyzeDashboardData(insightsData, brandName);
    return insights;
  } catch (error) {
    console.error("Error generating visibility insights:", error);
    return [];
  }
}
