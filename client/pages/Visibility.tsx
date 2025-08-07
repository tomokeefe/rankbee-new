import { DashboardLayout } from "../components/DashboardLayout";
import { useFilters } from "../contexts/FilterContext";
import { getFilteredData } from "../services/dataService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  TrendingUp,
  Target,
  Globe,
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

const visibilityTrends = [
  { month: "Jan", visibility: 65, impressions: 12500, clicks: 850 },
  { month: "Feb", visibility: 68, impressions: 13200, clicks: 920 },
  { month: "Mar", visibility: 72, impressions: 14100, clicks: 1020 },
  { month: "Apr", visibility: 75, impressions: 15800, clicks: 1150 },
  { month: "May", visibility: 78, impressions: 16900, clicks: 1280 },
  { month: "Jun", visibility: 82, impressions: 18200, clicks: 1450 },
];

const platformData = [
  { platform: "Google Search", visibility: 85, color: "#4285f4" },
  { platform: "Bing", visibility: 62, color: "#00809d" },
  { platform: "YouTube", visibility: 78, color: "#ff0000" },
  { platform: "Google Maps", visibility: 91, color: "#34a853" },
  { platform: "Social Media", visibility: 55, color: "#1da1f2" },
];

const competitorData = [
  { name: "Your Brand", visibility: 82, rank: 1, change: +5 },
  { name: "Competitor A", visibility: 79, rank: 2, change: -2 },
  { name: "Competitor B", visibility: 76, rank: 3, change: +1 },
  { name: "Competitor C", visibility: 71, rank: 4, change: -3 },
  { name: "Competitor D", visibility: 68, rank: 5, change: +2 },
];

const keywordCategories = [
  { category: "Brand Terms", visibility: 95, keywords: 245, avgPosition: 1.2 },
  {
    category: "Product Terms",
    visibility: 78,
    keywords: 1580,
    avgPosition: 2.8,
  },
  {
    category: "Category Terms",
    visibility: 62,
    keywords: 890,
    avgPosition: 4.1,
  },
  {
    category: "Competitor Terms",
    visibility: 45,
    keywords: 320,
    avgPosition: 6.2,
  },
];

export default function Visibility() {
  const { filters } = useFilters();
  const data = getFilteredData(filters);

  return (
    <DashboardLayout>
      <div className="max-w-[1240px] mx-auto px-6 space-y-6">
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
              <div className="text-2xl font-bold">82%</div>
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
              <div className="text-2xl font-bold">18.2K</div>
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
              <div className="text-2xl font-bold">7.8%</div>
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
              <div className="text-2xl font-bold">24.5%</div>
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
            <CardTitle>Visibility Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibilityTrends}>
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
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform) => (
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
                {competitorData.map((competitor, index) => (
                  <div
                    key={competitor.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                        {competitor.rank}
                      </div>
                      <div>
                        <div className="font-medium">{competitor.name}</div>
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
            <CardTitle>Keyword Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {keywordCategories.map((category) => (
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
