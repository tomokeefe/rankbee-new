import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useFilters } from "../contexts/FilterContext";
import { getBrandTrendsData, generateTrendsInsights, getBrandDisplayName } from "../services/trendsService";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Calendar,
  Users,
  Globe,
  Brain,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Trends() {
  const { filters, brands } = useFilters();
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const { toast } = useToast();

  const trendsData = getBrandTrendsData(filters.brand);
  const brandName = getBrandDisplayName(filters.brand);

  useEffect(() => {
    loadAIInsights();
  }, [filters.brand]);

  const loadAIInsights = async () => {
    setIsLoadingInsights(true);
    setIsUsingFallback(false);
    try {
      const insights = await generateTrendsInsights(filters.brand);
      setAiInsights(insights);
    } catch (error) {
      console.error("Error loading AI insights:", error);
      setIsUsingFallback(true);

      // Show user-friendly notification for quota errors
      if (error instanceof Error && error.message.includes('429')) {
        toast({
          title: "AI Analysis Unavailable",
          description: "Using sample insights due to API quota limits. Data shown is for demonstration purposes.",
          variant: "default",
        });
      }
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#384255]">Trends Analysis</h1>
            <p className="text-gray-600">Market trends and insights for {brandName}</p>
          </div>
          <Button onClick={loadAIInsights} disabled={isLoadingInsights} className="bg-[#9369F6] hover:bg-[#7C3AED]">
            <Brain className="h-4 w-4 mr-2" />
            {isLoadingInsights ? "Generating..." : "Refresh AI Insights"}
          </Button>
        </div>


        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trending Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trendsData.trendingScore}/10</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +1.2 from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trend Velocity
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{trendsData.trendVelocity}%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                Accelerating trend growth
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Audience Growth
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(trendsData.audienceGrowth / 1000).toFixed(1)}K</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12% new followers
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Market Position
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{trendsData.marketPosition}</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                Up 2 positions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        {aiInsights.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Insights for {brandName}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadAIInsights}
                  disabled={isLoadingInsights}
                  className="text-xs h-7 px-2"
                >
                  <Brain className={`h-3 w-3 mr-1 ${isLoadingInsights ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {isUsingFallback
                  ? "Sample insights shown (AI analysis quota exceeded)"
                  : "AI-powered insights from your trend performance data"
                }
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoadingInsights ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 rounded-lg border animate-pulse">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiInsights.slice(0, 4).map((insight, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border transition-all duration-200 hover:shadow-sm bg-gray-50 border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-gray-700">
                          {insight.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          insight.significance === 'high' ? 'bg-red-100 text-red-800' :
                          insight.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {insight.significance} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed mb-2">
                        {insight.description}
                      </p>
                      <div className="flex justify-end">
                        <span className="text-xs text-gray-500">
                          {Math.round(insight.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Trend Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis Over Time for {brandName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    type="category"
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    name="Engagement %"
                  />
                  <Area
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.1}
                    name="Sentiment Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Top Trending Topics for {brandName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendsData.topTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{trend.trend}</div>
                        <div className="text-sm text-gray-600">
                          {trend.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-green-600 text-sm">
                        <ArrowUp className="h-3 w-3" />
                        {trend.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution for {brandName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trendsData.sentimentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {trendsData.sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {trendsData.sentimentData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emerging Keywords */}
        <Card>
          <CardHeader>
            <CardTitle>Emerging Keywords for {brandName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {trendsData.emergingKeywords.map((keyword, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{keyword.keyword}</h4>
                    <Badge 
                      variant="secondary" 
                      className={keyword.change > 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {keyword.change > 0 ? '+' : ''}{keyword.change}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {keyword.searches.toLocaleString()} searches
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
