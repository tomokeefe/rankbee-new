import { analyzeDashboardData } from "./geminiService";

export interface CitationData {
  id: string;
  domain: string;
  url: string;
  title: string;
  citations: number;
  coverage: number;
  change: number;
  sentiment: "positive" | "negative" | "neutral";
  authority: number;
  traffic: number;
  lastCrawled: Date;
  category: string;
  status: "active" | "declining" | "inactive";
  brandId: string;
}

const baseCitationData: Omit<CitationData, 'brandId'>[] = [
  {
    id: "1",
    domain: "tripadvisor.com",
    url: "https://tripadvisor.com/restaurant/reviews",
    title: "Restaurant Reviews",
    citations: 1247,
    coverage: 23.4,
    change: 1.8,
    sentiment: "positive",
    authority: 92,
    traffic: 45600,
    lastCrawled: new Date("2025-01-08T10:30:00"),
    category: "Review Site",
    status: "active",
  },
  {
    id: "2",
    domain: "yelp.com",
    url: "https://yelp.com/biz/business-listing",
    title: "Local Business Listing",
    citations: 892,
    coverage: 18.9,
    change: -0.7,
    sentiment: "neutral",
    authority: 88,
    traffic: 32100,
    lastCrawled: new Date("2025-01-08T09:45:00"),
    category: "Directory",
    status: "active",
  },
  {
    id: "3",
    domain: "opentable.com",
    url: "https://opentable.com/reservations",
    title: "Make Reservations",
    citations: 634,
    coverage: 12.3,
    change: 0.3,
    sentiment: "positive",
    authority: 85,
    traffic: 18900,
    lastCrawled: new Date("2025-01-08T08:20:00"),
    category: "Booking Platform",
    status: "active",
  },
  {
    id: "4",
    domain: "zomato.com",
    url: "https://zomato.com/menu-reviews",
    title: "Menu, Reviews & Ratings",
    citations: 421,
    coverage: 8.1,
    change: 2.2,
    sentiment: "positive",
    authority: 78,
    traffic: 12500,
    lastCrawled: new Date("2025-01-08T07:15:00"),
    category: "Food Portal",
    status: "active",
  },
  {
    id: "5",
    domain: "google.com",
    url: "https://google.com/maps/place",
    title: "Locations on Google Maps",
    citations: 856,
    coverage: 16.2,
    change: 3.1,
    sentiment: "neutral",
    authority: 100,
    traffic: 67800,
    lastCrawled: new Date("2025-01-08T06:30:00"),
    category: "Maps & Local",
    status: "active",
  },
  {
    id: "6",
    domain: "foursquare.com",
    url: "https://foursquare.com/venue",
    title: "Venue Information",
    citations: 234,
    coverage: 4.7,
    change: -1.2,
    sentiment: "neutral",
    authority: 72,
    traffic: 8900,
    lastCrawled: new Date("2025-01-08T05:45:00"),
    category: "Social Platform",
    status: "declining",
  },
];

// Brand-specific multipliers for citation data
const brandMultipliers: Record<string, number> = {
  "olive-garden": 1.0,
  "maggianos": 0.8,
  "darden": 1.2,
  "osteria": 0.6,
  "bloomin": 0.7,
  "carrabba": 0.9,
};

export function getBrandCitationData(brandValue: string): CitationData[] {
  const multiplier = brandMultipliers[brandValue] || 1.0;
  
  return baseCitationData.map((citation, index) => ({
    ...citation,
    id: `${brandValue}-${citation.id}`,
    brandId: brandValue,
    url: citation.url.replace('/', `/${brandValue}-`),
    title: `${getBrandDisplayName(brandValue)} ${citation.title}`,
    citations: Math.round(citation.citations * multiplier),
    coverage: Number((citation.coverage * multiplier).toFixed(1)),
    traffic: Math.round(citation.traffic * multiplier),
    change: Number((citation.change * (0.8 + Math.random() * 0.4)).toFixed(1)),
  }));
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

export interface CitationTrend {
  month: string;
  citations: number;
  coverage: number;
  domains: number;
}

export function getBrandCitationTrends(brandValue: string): CitationTrend[] {
  const multiplier = brandMultipliers[brandValue] || 1.0;
  const baseTrends = [
    { month: "Jul", citations: 3890, coverage: 19.2, domains: 145 },
    { month: "Aug", citations: 4120, coverage: 20.1, domains: 152 },
    { month: "Sep", citations: 4380, coverage: 21.5, domains: 158 },
    { month: "Oct", citations: 4650, coverage: 22.8, domains: 163 },
    { month: "Nov", citations: 4890, coverage: 23.9, domains: 167 },
    { month: "Dec", citations: 5140, coverage: 24.7, domains: 171 },
  ];

  return baseTrends.map(trend => ({
    ...trend,
    citations: Math.round(trend.citations * multiplier),
    coverage: Number((trend.coverage * multiplier).toFixed(1)),
    domains: Math.round(trend.domains * multiplier),
  }));
}

export async function generateCitationInsights(brandValue: string): Promise<any[]> {
  try {
    const citationData = getBrandCitationData(brandValue);
    const brandName = getBrandDisplayName(brandValue);
    
    const insightsData = {
      brandName,
      totalCitations: citationData.reduce((sum, item) => sum + item.citations, 0),
      activeDomains: citationData.filter(item => item.status === "active").length,
      avgAuthority: citationData.reduce((sum, item) => sum + item.authority, 0) / citationData.length,
      topDomains: citationData.sort((a, b) => b.citations - a.citations).slice(0, 3),
      trends: getBrandCitationTrends(brandValue)
    };

    const insights = await analyzeDashboardData(insightsData, brandName);
    return insights;
  } catch (error) {
    console.error("Error generating citation insights:", error);
    return [];
  }
}
