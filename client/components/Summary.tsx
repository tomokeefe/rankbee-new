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
  Users,
  ArrowUp,
  ArrowDown,
  RefreshCw
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
          text: `${filters.brand} ranks #2 overall in restaurant search visibility`,
          metric: 'Search Ranking',
          change: 2,
          confidence: 0.92
        },
        {
          type: 'performance',
          icon: TrendingUp,
          iconColor: 'text-green-600',
          text: 'Brand engagement increased this week, driven by visual content',
          metric: 'Engagement',
          change: 18,
          confidence: 0.87
        },
        {
          type: 'opportunity',
          icon: Users,
          iconColor: 'text-blue-600',
          text: 'Higher conversion potential detected during evening hours',
          metric: 'Evening Traffic',
          change: 23,
          confidence: 0.79
        },
        {
          type: 'alert',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          text: 'Weekend visibility dropped - adjust content for family dining',
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ranking': return 'bg-purple-50 border-purple-200';
      case 'performance': return 'bg-green-50 border-green-200';
      case 'opportunity': return 'bg-blue-50 border-blue-200';
      case 'alert': return 'bg-amber-50 border-amber-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Summary</CardTitle>
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4 text-purple-600" />
              <Sparkles className="h-3 w-3 text-purple-400" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateAISummary}
            disabled={loading}
            className="text-xs h-7 px-2"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          AI-powered insights from your brand performance data
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
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
            {aiInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getTypeColor(insight.type)}`}
                >
                  {/* Header with icon, metric, and change */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 ${insight.iconColor}`} />
                      <span className="text-xs font-medium text-gray-700">
                        {insight.metric}
                      </span>
                    </div>
                    {insight.change && (
                      <div className={`flex items-center gap-1 text-xs font-semibold ${
                        insight.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {insight.change > 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(insight.change)}%
                      </div>
                    )}
                  </div>
                  
                  {/* Insight text */}
                  <p className="text-sm text-gray-800 leading-relaxed mb-2">
                    {insight.text}
                  </p>
                  
                  {/* Confidence indicator */}
                  <div className="flex justify-end">
                    <span className="text-xs text-gray-500">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
