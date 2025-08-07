import { analyzeDashboardData } from "./geminiService";

export interface TrendsData {
  trendingScore: number;
  trendVelocity: number;
  audienceGrowth: number;
  marketPosition: number;
  trends: TrendData[];
  topTrends: TopTrend[];
  sentimentData: SentimentData[];
  emergingKeywords: EmergingKeyword[];
}

export interface TrendData {
  month: string;
  engagement: number;
  searches: number;
  mentions: number;
  sentiment: number;
}

export interface TopTrend {
  trend: string;
  growth: number;
  category: string;
}

export interface SentimentData {
  name: string;
  value: number;
  color: string;
}

export interface EmergingKeyword {
  keyword: string;
  searches: number;
  change: number;
}

const brandMultipliers: Record<string, number> = {
  "olive-garden": 1.0,
  "maggianos": 0.85,
  "darden": 1.15,
  "osteria": 0.75,
  "bloomin": 0.8,
  "carrabba": 0.9,
};

const baseTrendData: TrendData[] = [
  { month: "Jan", engagement: 65, searches: 12500, mentions: 850, sentiment: 72 },
  { month: "Feb", engagement: 68, searches: 13200, mentions: 920, sentiment: 74 },
  { month: "Mar", engagement: 72, searches: 14100, mentions: 1020, sentiment: 76 },
  { month: "Apr", engagement: 75, searches: 15800, mentions: 1150, sentiment: 78 },
  { month: "May", engagement: 78, searches: 16900, mentions: 1280, sentiment: 80 },
  { month: "Jun", engagement: 82, searches: 18200, mentions: 1450, sentiment: 82 },
];

const baseTopTrends: TopTrend[] = [
  { trend: "Plant-based menu items", growth: 45, category: "Menu Innovation" },
  { trend: "Outdoor dining experiences", growth: 38, category: "Dining Experience" },
  { trend: "Local sourcing", growth: 32, category: "Sustainability" },
  { trend: "Family meal deals", growth: 28, category: "Value Offerings" },
  { trend: "Contactless ordering", growth: 25, category: "Technology" },
];

const baseSentimentData: SentimentData[] = [
  { name: "Positive", value: 65, color: "#22c55e" },
  { name: "Neutral", value: 25, color: "#6b7280" },
  { name: "Negative", value: 10, color: "#ef4444" },
];

const baseEmergingKeywords: EmergingKeyword[] = [
  { keyword: "authentic Italian", searches: 24500, change: 18 },
  { keyword: "family friendly", searches: 18200, change: 22 },
  { keyword: "fresh ingredients", searches: 15800, change: 15 },
  { keyword: "cozy atmosphere", searches: 12400, change: 12 },
  { keyword: "date night", searches: 11200, change: 8 },
];

export function getBrandTrendsData(brandValue: string): TrendsData {
  const multiplier = brandMultipliers[brandValue] || 1.0;
  
  const trends = baseTrendData.map(trend => ({
    ...trend,
    engagement: Math.round(trend.engagement * multiplier),
    searches: Math.round(trend.searches * multiplier),
    mentions: Math.round(trend.mentions * multiplier),
    sentiment: Math.round(trend.sentiment * multiplier),
  }));

  const topTrends = baseTopTrends.map(trend => ({
    ...trend,
    growth: Math.round(trend.growth * multiplier),
  }));

  const emergingKeywords = baseEmergingKeywords.map(keyword => ({
    ...keyword,
    searches: Math.round(keyword.searches * multiplier),
    change: Math.round(keyword.change * multiplier),
  }));

  // Adjust sentiment data based on brand performance
  const sentimentMultiplier = multiplier > 1 ? 1.1 : multiplier < 0.9 ? 0.9 : 1;
  const sentimentData = baseSentimentData.map(sentiment => {
    if (sentiment.name === "Positive") {
      return { ...sentiment, value: Math.min(95, Math.round(sentiment.value * sentimentMultiplier)) };
    } else if (sentiment.name === "Negative") {
      return { ...sentiment, value: Math.max(5, Math.round(sentiment.value / sentimentMultiplier)) };
    }
    return sentiment;
  });

  // Rebalance sentiment to total 100%
  const total = sentimentData.reduce((sum, item) => sum + item.value, 0);
  const neutralValue = 100 - sentimentData[0].value - sentimentData[2].value;
  sentimentData[1] = { ...sentimentData[1], value: Math.max(0, neutralValue) };

  return {
    trendingScore: Number((8.2 * multiplier).toFixed(1)),
    trendVelocity: Math.round(18 * multiplier),
    audienceGrowth: Math.round(24500 * multiplier),
    marketPosition: multiplier > 1 ? 1 : multiplier > 0.9 ? 2 : 3,
    trends,
    topTrends,
    sentimentData,
    emergingKeywords,
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

export async function generateTrendsInsights(brandValue: string): Promise<any[]> {
  try {
    const trendsData = getBrandTrendsData(brandValue);
    const brandName = getBrandDisplayName(brandValue);
    
    const insightsData = {
      brandName,
      ...trendsData,
      recentTrends: trendsData.trends.slice(-3),
      topPerformingTrends: trendsData.topTrends.slice(0, 3),
      overallSentiment: trendsData.sentimentData[0].value, // Positive sentiment
    };

    const insights = await analyzeDashboardData(insightsData, brandName);
    return insights;
  } catch (error) {
    console.error("Error generating trends insights:", error);
    return [];
  }
}
