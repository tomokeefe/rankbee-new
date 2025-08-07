import { useState, useEffect } from "react";
import { useFilters } from "../contexts/FilterContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Sparkles
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'content' | 'audience' | 'timing' | 'budget' | 'engagement';
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  isImplemented: boolean;
  metrics: {
    potentialLift: number;
    confidence: number;
  };
}

const categoryIcons = {
  content: Eye,
  audience: Users,
  timing: Calendar,
  budget: DollarSign,
  engagement: TrendingUp,
};

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const effortColors = {
  low: "text-green-600",
  medium: "text-yellow-600", 
  high: "text-red-600",
};

export function SmartRecommendations() {
  const { filters } = useFilters();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [implementedIds, setImplementedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateRecommendations();
  }, [filters.brand, filters.timeframe]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate AI-generated recommendations based on brand data
    setTimeout(() => {
      const mockRecommendations: Recommendation[] = [
        {
          id: "1",
          title: "Optimize evening posting schedule",
          description: "Your engagement drops 23% between 6-9 PM. Post high-value content during dinner hours to capture evening audience.",
          priority: "high",
          category: "timing",
          expectedImpact: "15-20% increase in evening engagement",
          effort: "low",
          timeframe: "1 week",
          isImplemented: false,
          metrics: {
            potentialLift: 18,
            confidence: 0.87
          }
        },
        {
          id: "2", 
          title: "Increase visual content production",
          description: "Image posts generate 34% more engagement than text-only posts. Increase visual content to 70% of total posts.",
          priority: "high",
          category: "content",
          expectedImpact: "25-30% boost in overall engagement",
          effort: "medium",
          timeframe: "2 weeks",
          isImplemented: false,
          metrics: {
            potentialLift: 27,
            confidence: 0.92
          }
        },
        {
          id: "3",
          title: "Target millennial food enthusiasts",
          description: "Audience analysis shows untapped potential with 25-35 age group interested in authentic dining experiences.",
          priority: "medium",
          category: "audience",
          expectedImpact: "12-18% audience growth",
          effort: "medium",
          timeframe: "3 weeks",
          isImplemented: false,
          metrics: {
            potentialLift: 15,
            confidence: 0.79
          }
        },
        {
          id: "4",
          title: "Launch weekend family campaigns",
          description: "Family-focused content shows 40% higher engagement on weekends. Create targeted family dining promotions.",
          priority: "medium",
          category: "content",
          expectedImpact: "20-25% weekend engagement increase",
          effort: "low",
          timeframe: "1 week",
          isImplemented: false,
          metrics: {
            potentialLift: 22,
            confidence: 0.84
          }
        },
        {
          id: "5",
          title: "Reallocate budget to high-performing channels",
          description: "Social media campaigns show 2.3x better ROI than display ads. Consider shifting 30% of display budget to social.",
          priority: "low",
          category: "budget",
          expectedImpact: "10-15% improvement in ROAS",
          effort: "high",
          timeframe: "4 weeks",
          isImplemented: false,
          metrics: {
            potentialLift: 12,
            confidence: 0.71
          }
        }
      ];

      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1500);
  };

  const handleImplement = (recommendationId: string) => {
    setImplementedIds(prev => new Set(prev).add(recommendationId));
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId 
          ? { ...rec, isImplemented: true }
          : rec
      )
    );
  };

  const sortedRecommendations = recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Smart Recommendations
          <Sparkles className="h-4 w-4 text-purple-400" />
        </CardTitle>
        <CardDescription>
          AI-powered action items to improve your brand performance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedRecommendations.map((rec) => {
              const IconComponent = categoryIcons[rec.category];
              const isImplemented = implementedIds.has(rec.id) || rec.isImplemented;
              
              return (
                <div 
                  key={rec.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isImplemented ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${isImplemented ? 'text-green-800' : 'text-gray-900'}`}>
                            {rec.title}
                          </h3>
                          <Badge className={`text-xs text-white ${priorityColors[rec.priority]}`}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.category}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm mb-3 ${isImplemented ? 'text-green-700' : 'text-gray-700'}`}>
                          {rec.description}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Expected Impact:</span>
                            <p className="font-medium text-green-600">{rec.expectedImpact}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Effort:</span>
                            <p className={`font-medium ${effortColors[rec.effort]}`}>
                              {rec.effort}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Timeframe:</span>
                            <p className="font-medium text-gray-700">{rec.timeframe}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Confidence:</span>
                            <p className="font-medium text-blue-600">
                              {Math.round(rec.metrics.confidence * 100)}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-gray-50 rounded border text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Potential Lift: </span>
                            <span className="text-green-600">+{rec.metrics.potentialLift}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      {isImplemented ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">Implemented</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleImplement(rec.id)}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Implement
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={generateRecommendations}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Sparkles className="h-4 w-4" />
                Refresh Recommendations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
