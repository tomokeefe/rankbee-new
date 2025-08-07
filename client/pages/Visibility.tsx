import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useFilters } from "../contexts/FilterContext";
import { getBrandVisibilityData, generateVisibilityInsights, getBrandDisplayName } from "../services/visibilityService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  TrendingUp,
  Target,
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

export default function Visibility() {
  const { filters, brands } = useFilters();
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const visibilityData = getBrandVisibilityData(filters.brand);
  const brandName = getBrandDisplayName(filters.brand);

  useEffect(() => {
    loadAIInsights();
  }, [filters.brand]);

  const loadAIInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const insights = await generateVisibilityInsights(filters.brand);
      setAiInsights(insights);
    } catch (error) {
      console.error("Error loading AI insights:", error);
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
            <h1 className="text-2xl font-bold text-[#384255]">Visibility Analysis</h1>
            <p className="text-gray-600">Search visibility gaps for {brandName}</p>
          </div>
          <Button onClick={loadAIInsights} disabled={isLoadingInsights} className="bg-[#9369F6] hover:bg-[#7C3AED]">
            <Brain className="h-4 w-4 mr-2" />
            {isLoadingInsights ? "Generating..." : "Refresh AI Insights"}
          </Button>
        </div>

        {/* AI Insights Panel */}
        {aiInsights.length > 0 && (
          <Card className="border-l-4 border-l-[#9369F6]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#9369F6]" />
                AI-Powered Visibility Insights for {brandName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.slice(0, 4).map((insight, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-[#9369F6]/20 bg-[#9369F6]/5"
                  >
                    <h4 className="font-semibold text-sm text-[#384255] mb-2">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {insight.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                      <span className={`text-xs px-2 py-1 rounded ${
                        insight.significance === 'high' ? 'bg-red-100 text-red-800' :
                        insight.significance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {insight.significance} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Visibility
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visibilityData.overallVisibility}%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +5.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Search Impressions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(visibilityData.searchImpressions / 1000).toFixed(1)}K</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12.3% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Click-Through Rate
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visibilityData.clickThroughRate}%</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +0.8% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Market Share
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visibilityData.marketShare}%</div>
              <div className="flex items-center text-xs text-red-600">
                <ArrowDown className="h-3 w-3 mr-1" />
                -1.2% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visibility Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visibility Trends Over Time for {brandName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibilityData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    type="category"
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    yAxisId="left"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visibility"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                    name="Visibility %"
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.1}
                    name="Impressions"
                    yAxisId="right"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance for {brandName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibilityData.platforms.map((platform) => (
                  <div
                    key={platform.platform}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <Progress value={platform.visibility} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">
                        {platform.visibility}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitor Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visibilityData.competitors.map((competitor, index) => (
                  <div
                    key={competitor.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      competitor.name === "Your Brand" 
                        ? "bg-[#9369F6]/10 border border-[#9369F6]/30" 
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        competitor.name === "Your Brand"
                          ? "bg-[#9369F6] text-white"
                          : "bg-purple-100 text-purple-600"
                      }`}>
                        {competitor.rank}
                      </div>
                      <div>
                        <div className={`font-medium ${
                          competitor.name === "Your Brand" ? "text-[#9369F6]" : ""
                        }`}>
                          {competitor.name === "Your Brand" ? brandName : competitor.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {competitor.visibility}% visibility
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {competitor.change > 0 ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <ArrowUp className="h-3 w-3" />
                          {competitor.change}
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 text-sm">
                          <ArrowDown className="h-3 w-3" />
                          {Math.abs(competitor.change)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keyword Categories Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Keyword Category Performance for {brandName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibilityData.keywordCategories.map((category) => (
                <div key={category.category} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{category.category}</h4>
                    <Badge variant="secondary">{category.visibility}%</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Keywords:</span>
                      <span>{category.keywords.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Position:</span>
                      <span>{category.avgPosition}</span>
                    </div>
                  </div>
                  <Progress value={category.visibility} className="h-2 mt-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
