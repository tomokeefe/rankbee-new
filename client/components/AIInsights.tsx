import { useState, useEffect } from "react";
import { useFilters } from "../contexts/FilterContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Brain,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { analyzeDashboardData, DashboardInsight } from "../services/geminiService";
import { getMockMetrics } from "../services/dataService";

const insightIcons = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  opportunity: Lightbulb,
  alert: TrendingDown,
};

const significanceColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500", 
  low: "bg-green-500",
};

const typeColors = {
  trend: "border-blue-500 bg-blue-50",
  anomaly: "border-orange-500 bg-orange-50",
  opportunity: "border-green-500 bg-green-50",
  alert: "border-red-500 bg-red-50",
};

export function AIInsights() {
  const { filters } = useFilters();
  const [insights, setInsights] = useState<DashboardInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  useEffect(() => {
    generateInsights();
  }, [filters.brand, filters.timeframe]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      // Get current dashboard data
      const metrics = getMockMetrics(filters.brand, filters.timeframe);
      
      // Generate AI insights
      const aiInsights = await analyzeDashboardData(metrics, filters.brand);
      setInsights(aiInsights);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInsightClick = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Insights
            <Sparkles className="h-4 w-4 text-purple-400" />
          </CardTitle>
          <CardDescription>
            Analyzing your brand performance data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Insights
          <Sparkles className="h-4 w-4 text-purple-400" />
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your brand performance and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const IconComponent = insightIcons[insight.type];
            const isExpanded = expandedInsight === insight.id;
            
            return (
              <div
                key={insight.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${typeColors[insight.type]}`}
                onClick={() => handleInsightClick(insight.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      <IconComponent className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <Badge variant="outline" className={`text-xs ${significanceColors[insight.significance]} text-white`}>
                          {insight.significance}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(insight.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
                      
                      {isExpanded && insight.actionable && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <h4 className="font-medium text-gray-900 mb-2">Suggested Actions:</h4>
                          <ul className="space-y-1">
                            {insight.suggestedActions.map((action, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                <ChevronRight className="h-3 w-3" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>
            );
          })}
          
          {insights.length === 0 && (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No insights available. Try refreshing or adjusting your filters.</p>
            </div>
          )}
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={generateInsights}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Refresh Insights
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
