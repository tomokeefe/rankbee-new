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
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Calendar,
  Users,
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

const trendData = [
  { month: "Jan", engagement: 65, searches: 12500, mentions: 850, sentiment: 72 },
  { month: "Feb", engagement: 68, searches: 13200, mentions: 920, sentiment: 74 },
  { month: "Mar", engagement: 72, searches: 14100, mentions: 1020, sentiment: 76 },
  { month: "Apr", engagement: 75, searches: 15800, mentions: 1150, sentiment: 78 },
  { month: "May", engagement: 78, searches: 16900, mentions: 1280, sentiment: 80 },
  { month: "Jun", engagement: 82, searches: 18200, mentions: 1450, sentiment: 82 },
];

const topTrends = [
  { trend: "Plant-based menu items", growth: +45, category: "Menu Innovation" },
  { trend: "Outdoor dining experiences", growth: +38, category: "Dining Experience" },
  { trend: "Local sourcing", growth: +32, category: "Sustainability" },
  { trend: "Family meal deals", growth: +28, category: "Value Offerings" },
  { trend: "Contactless ordering", growth: +25, category: "Technology" },
];

const sentimentData = [
  { name: "Positive", value: 65, color: "#22c55e" },
  { name: "Neutral", value: 25, color: "#6b7280" },
  { name: "Negative", value: 10, color: "#ef4444" },
];

const emergingKeywords = [
  { keyword: "authentic Italian", searches: 24500, change: +18 },
  { keyword: "family friendly", searches: 18200, change: +22 },
  { keyword: "fresh ingredients", searches: 15800, change: +15 },
  { keyword: "cozy atmosphere", searches: 12400, change: +12 },
  { keyword: "date night", searches: 11200, change: +8 },
];

export default function Trends() {
  const { filters } = useFilters();
  const data = getFilteredData(filters);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
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
              <div className="text-2xl font-bold">8.2/10</div>
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
              <div className="text-2xl font-bold">+18%</div>
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
              <div className="text-2xl font-bold">24.5K</div>
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
              <div className="text-2xl font-bold">#2</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                Up 2 positions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
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
              <CardTitle>Top Trending Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTrends.map((trend, index) => (
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
              <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {sentimentData.map((item) => (
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
            <CardTitle>Emerging Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {emergingKeywords.map((keyword, index) => (
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
