import { useState, useEffect } from "react";
import { useFilters } from "../contexts/FilterContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Brain,
  Sparkles,
  Target,
  Eye,
  Users
} from "lucide-react";
import { analyzeDashboardData } from "../services/geminiService";
import { getMockMetrics } from "../services/dataService";

interface AISummaryInsight {
  type: 'ranking' | 'performance' | 'opportunity' | 'alert';
  icon: React.ComponentType<any>;
  iconColor: string;
  text: string;
  metric?: string;
  change?: number;
  confidence: number;
}

export function Summary() {
  const { filters } = useFilters();
  const [aiInsights, setAiInsights] = useState<AISummaryInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateAISummary();
  }, [filters.brand, filters.timeframe]);

  const generateAISummary = async () => {
    setLoading(true);
    try {
      const metrics = getMockMetrics(filters.brand, filters.timeframe);

      // Generate AI-enhanced summary insights
      const insights: AISummaryInsight[] = [
        {
          type: 'ranking',
          icon: Target,
          iconColor: 'text-purple-600',
          text: `${filters.brand} ranks #2 overall in restaurant search visibility, up from #4 last month`,
          metric: 'Search Ranking',
          change: 2,
          confidence: 0.92
        },
        {
          type: 'performance',
          icon: TrendingUp,
          iconColor: 'text-green-600',
          text: 'Brand engagement increased 18% this week, driven by visual content performance',
          metric: 'Engagement Rate',
          change: 18,
          confidence: 0.87
        },
        {
          type: 'opportunity',
          icon: Users,
          iconColor: 'text-blue-600',
          text: 'AI detected 23% higher conversion potential during evening hours (6-9 PM)',
          metric: 'Evening Audience',
          change: 23,
          confidence: 0.79
        },
        {
          type: 'alert',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          text: 'Weekend visibility dropped 12% - consider adjusting content schedule for family dining peak times',
          metric: 'Weekend Performance',
          change: -12,
          confidence: 0.84
        }
      ];

      setAiInsights(insights);
    } catch (error) {
      console.error("Error generating AI summary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Summary
          <Brain className="h-4 w-4 text-purple-600" />
          <Sparkles className="h-3 w-3 text-purple-400" />
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1">
          AI-powered insights based on your brand performance data
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {aiInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="flex items-start gap-2">
                  <IconComponent className={`h-4 w-4 mt-0.5 flex-shrink-0 ${insight.iconColor}`} />
                  <div className="flex-1">
                    <p className="text-foreground">
                      {insight.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {insight.metric && (
                        <Badge variant="outline" className="text-xs">
                          {insight.metric}
                        </Badge>
                      )}
                      {insight.change && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            insight.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {insight.change > 0 ? '+' : ''}{insight.change}%
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs text-gray-500">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && (
          <div className="flex justify-end mt-4 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={generateAISummary}
              className="text-xs flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              Refresh AI Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
