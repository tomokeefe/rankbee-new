import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useFilters } from "../contexts/FilterContext";
import {
  analyzePrompt,
  generatePromptSuggestions,
  mockPromptAnalyses,
  type PromptAnalysis,
} from "../services/geminiService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Search,
  Brain,
  TrendingUp,
  MessageSquare,
  Filter,
  ChevronDown,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const sentimentColors = {
  positive: "bg-green-100 text-green-800",
  negative: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-800",
};

const sentimentIcons = {
  positive: <ArrowUp className="h-3 w-3" />,
  negative: <ArrowDown className="h-3 w-3" />,
  neutral: <Minus className="h-3 w-3" />,
};

export default function PromptDeepDive() {
  const { filters, brands } = useFilters();
  const [prompts, setPrompts] = useState<PromptAnalysis[]>(mockPromptAnalyses);
  const [newPrompt, setNewPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSentiment, setFilterSentiment] = useState<string>("all");
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // Get brand name from the brands array in FilterContext
  const selectedBrand = brands.find(brand => brand.value === filters.brand);
  const brandName = selectedBrand?.label || "Your Brand";

  useEffect(() => {
    // Load suggestions when component mounts
    handleGenerateSuggestions();
  }, [brandName]);

  const handleAnalyzePrompt = async () => {
    if (!newPrompt.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzePrompt(newPrompt, brandName);
      setPrompts([analysis, ...prompts]);
      setNewPrompt("");
    } catch (error) {
      console.error("Error analyzing prompt:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const newSuggestions = await generatePromptSuggestions(
        brandName,
        "restaurant",
      );
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleAnalyzeSuggestion = async (prompt: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzePrompt(prompt, brandName);
      setPrompts([analysis, ...prompts]);
    } catch (error) {
      console.error("Error analyzing suggestion:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredPrompts = prompts.filter((prompt) => {
    if (filterCategory !== "all" && prompt.category !== filterCategory)
      return false;
    if (filterSentiment !== "all" && prompt.sentiment !== filterSentiment)
      return false;
    return true;
  });

  const categories = [...new Set(prompts.map((p) => p.category))];
  const sentiments = ["positive", "negative", "neutral"];

  // Analytics
  const totalPrompts = prompts.length;
  const brandMentions = prompts.filter((p) => p.brandMention).length;
  const avgConfidence =
    prompts.reduce((acc, p) => acc + p.confidenceScore, 0) / prompts.length;
  const sentimentDistribution = sentiments.map((sentiment) => ({
    sentiment,
    count: prompts.filter((p) => p.sentiment === sentiment).length,
    percentage:
      (prompts.filter((p) => p.sentiment === sentiment).length / totalPrompts) *
      100,
  }));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Prompts
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPrompts}</div>
              <p className="text-xs text-muted-foreground">
                Analyzed this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Brand Mentions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brandMentions}</div>
              <p className="text-xs text-muted-foreground">
                {((brandMentions / totalPrompts) * 100).toFixed(1)}% mention
                rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Confidence
              </CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(avgConfidence * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                AI analysis accuracy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Positive Sentiment
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sentimentDistribution
                  .find((s) => s.sentiment === "positive")
                  ?.percentage.toFixed(1) || 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {sentimentDistribution.find((s) => s.sentiment === "positive")
                  ?.count || 0}{" "}
                prompts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Prompt Analysis Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Prompt Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">
              Analyze search prompts to understand user intent, sentiment, and
              brand visibility opportunities.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Textarea
                placeholder="Enter a search prompt to analyze (e.g., 'best italian restaurant near me')"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button
                onClick={handleAnalyzePrompt}
                disabled={!newPrompt.trim() || isAnalyzing}
                className="shrink-0"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>

            {/* AI Suggestions */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Prompt Suggestions</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSuggestions}
                  disabled={isGeneratingSuggestions}
                >
                  {isGeneratingSuggestions ? "Generating..." : "Refresh"}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm flex-1">{suggestion}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAnalyzeSuggestion(suggestion)}
                      disabled={isAnalyzing}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      {isAnalyzing ? "..." : "Analyze"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
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

              <Select
                value={filterSentiment}
                onValueChange={setFilterSentiment}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  {sentiments.map((sentiment) => (
                    <SelectItem key={sentiment} value={sentiment}>
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterCategory !== "all" || filterSentiment !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterCategory("all");
                    setFilterSentiment("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prompt Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>
              Prompt Analysis Results ({filteredPrompts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-lg mb-2">
                        "{prompt.originalPrompt}"
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={sentimentColors[prompt.sentiment]}>
                          {sentimentIcons[prompt.sentiment]}
                          {prompt.sentiment}
                        </Badge>
                        <Badge variant="outline">{prompt.category}</Badge>
                        {prompt.brandMention && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Brand Mentioned
                          </Badge>
                        )}
                        {prompt.competitorMentioned && (
                          <Badge variant="destructive">
                            Competitor: {prompt.competitorMentioned}
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {(prompt.confidenceScore * 100).toFixed(0)}%
                          confidence
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(prompt.timestamp, "MMM d, HH:mm")}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">
                        Intent Analysis
                      </h5>
                      <p className="text-sm text-gray-600">{prompt.intent}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">
                        Suggested Response
                      </h5>
                      <p className="text-sm text-gray-600">
                        {prompt.suggestedResponse}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPrompts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No prompts match your current filters. Try adjusting the
                  filters or analyze some new prompts.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
