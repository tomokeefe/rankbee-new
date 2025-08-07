import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useFilters } from "../contexts/FilterContext";
import { getBrandCitationData, getBrandCitationTrends, generateCitationInsights, getBrandDisplayName } from "../services/citationService";
import { useToast } from "../hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Link,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Search,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Brain,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { format } from "date-fns";
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

const categoryDistribution = [
  { name: "Review Sites", value: 35, color: "#8b5cf6" },
  { name: "Directories", value: 28, color: "#06b6d4" },
  { name: "Maps & Local", value: 20, color: "#10b981" },
  { name: "Social Platforms", value: 12, color: "#f59e0b" },
  { name: "Food Portals", value: 5, color: "#ef4444" },
];

export default function CitationAnalysis() {
  const { filters, brands } = useFilters();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortField, setSortField] = useState("citations");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const { toast } = useToast();

  // Get brand-specific citation data
  const citationData = getBrandCitationData(filters.brand);
  const trendData = getBrandCitationTrends(filters.brand);
  const brandName = getBrandDisplayName(filters.brand);

  useEffect(() => {
    loadAIInsights();
  }, [filters.brand]);

  const loadAIInsights = async () => {
    setIsLoadingInsights(true);
    setIsUsingFallback(false);
    try {
      const insights = await generateCitationInsights(filters.brand);
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

  const filteredData = citationData.filter((item) => {
    if (
      searchTerm &&
      !item.domain.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory)
      return false;
    if (selectedStatus !== "all" && item.status !== selectedStatus)
      return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    const multiplier = sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * multiplier;
    }
    return String(aValue).localeCompare(String(bValue)) * multiplier;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const totalCitations = citationData.reduce(
    (sum, item) => sum + item.citations,
    0,
  );
  const activeDomains = citationData.filter(
    (item) => item.status === "active",
  ).length;
  const avgAuthority =
    citationData.reduce((sum, item) => sum + item.authority, 0) /
    citationData.length;
  const totalTraffic = citationData.reduce(
    (sum, item) => sum + item.traffic,
    0,
  );

  const categories = [...new Set(citationData.map((item) => item.category))];
  const statuses = [...new Set(citationData.map((item) => item.status))];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "declining":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#9369F6]">Citation Analysis</h1>
            <p className="text-gray-600">Analyzing citations for {brandName}</p>
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
                Total Citations
              </CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCitations.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Domains
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDomains}</div>
              <p className="text-xs text-muted-foreground">
                of {citationData.length} total domains
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Authority
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgAuthority.toFixed(0)}
              </div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="h-3 w-3 mr-1" />
                +2.1 from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Traffic
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalTraffic / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly referral traffic
              </p>
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
                  : "AI-powered insights from your citation performance data"
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

        {/* Citation Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Citation Growth Trends for {brandName}</CardTitle>
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
                    dataKey="citations"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                    name="Citations"
                  />
                  <Area
                    type="monotone"
                    dataKey="domains"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.1}
                    name="Domains"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Citation Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoryDistribution.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Domains */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Domains for {brandName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {citationData
                  .sort((a, b) => b.citations - a.citations)
                  .slice(0, 5)
                  .map((domain, index) => (
                    <div
                      key={domain.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{domain.domain}</div>
                          <div className="text-sm text-gray-600">
                            {domain.citations} citations
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{domain.coverage}%</div>
                        <div
                          className={`text-sm flex items-center ${
                            domain.change > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {domain.change > 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(domain.change)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Search domains or titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Citation Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {brandName} Citation Details ({sortedData.length} results)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("domain")}
                    >
                      Domain{" "}
                      {sortField === "domain" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("citations")}
                    >
                      Citations{" "}
                      {sortField === "citations" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("coverage")}
                    >
                      Coverage{" "}
                      {sortField === "coverage" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Traffic</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Crawled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((citation) => (
                    <TableRow key={citation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{citation.domain}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {citation.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {citation.citations.toLocaleString()}
                      </TableCell>
                      <TableCell>{citation.coverage}%</TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center ${
                            citation.change > 0
                              ? "text-green-600"
                              : citation.change < 0
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {citation.change > 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : citation.change < 0 ? (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          ) : null}
                          {Math.abs(citation.change)}%
                        </div>
                      </TableCell>
                      <TableCell>{citation.authority}</TableCell>
                      <TableCell>{citation.traffic.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{citation.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(citation.status)}>
                          {citation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(citation.lastCrawled, "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
