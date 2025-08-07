import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useFilters } from "../contexts/FilterContext";
import { getFilteredData } from "../services/dataService";
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

// Extended citation data with more comprehensive information
const citationData = [
  {
    id: "1",
    domain: "tripadvisor.com",
    url: "https://tripadvisor.com/restaurant/olive-garden-reviews",
    title: "Olive Garden Italian Restaurant Reviews",
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
    url: "https://yelp.com/biz/olive-garden-location",
    title: "Olive Garden - Local Business Listing",
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
    url: "https://opentable.com/olive-garden-reservations",
    title: "Make Reservations at Olive Garden",
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
    url: "https://zomato.com/olive-garden-menu-reviews",
    title: "Olive Garden Menu, Reviews & Ratings",
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
    url: "https://google.com/maps/place/olive-garden",
    title: "Olive Garden Locations on Google Maps",
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
    url: "https://foursquare.com/venue/olive-garden",
    title: "Olive Garden Venue Information",
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
  {
    id: "7",
    domain: "urbanspoon.com",
    url: "https://urbanspoon.com/r/olive-garden",
    title: "Olive Garden Restaurant Info",
    citations: 145,
    coverage: 2.9,
    change: -3.4,
    sentiment: "negative",
    authority: 45,
    traffic: 3200,
    lastCrawled: new Date("2025-01-08T04:30:00"),
    category: "Review Site",
    status: "inactive",
  },
];

const trendData = [
  { month: "Jul", citations: 3890, coverage: 19.2, domains: 145 },
  { month: "Aug", citations: 4120, coverage: 20.1, domains: 152 },
  { month: "Sep", citations: 4380, coverage: 21.5, domains: 158 },
  { month: "Oct", citations: 4650, coverage: 22.8, domains: 163 },
  { month: "Nov", citations: 4890, coverage: 23.9, domains: 167 },
  { month: "Dec", citations: 5140, coverage: 24.7, domains: 171 },
];

const categoryDistribution = [
  { name: "Review Sites", value: 35, color: "#8b5cf6" },
  { name: "Directories", value: 28, color: "#06b6d4" },
  { name: "Maps & Local", value: 20, color: "#10b981" },
  { name: "Social Platforms", value: 12, color: "#f59e0b" },
  { name: "Food Portals", value: 5, color: "#ef4444" },
];

export default function CitationAnalysis() {
  const { filters } = useFilters();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortField, setSortField] = useState("citations");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
      <div className="max-w-[1240px] mx-auto px-6 space-y-6">
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

        {/* Citation Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Citation Growth Trends</CardTitle>
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
              <CardTitle>Top Performing Domains</CardTitle>
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
              Citation Details ({sortedData.length} results)
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
