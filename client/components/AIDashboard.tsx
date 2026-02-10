import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Brain, 
  MessageCircle, 
  Target, 
  Bell, 
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { AIInsights } from "./AIInsights";
import { AIChat } from "./AIChat";
import { SmartRecommendations } from "./SmartRecommendations";
import { AINotifications } from "./AINotifications";

export function AIDashboard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      {/* Compact Header */}
      <Card className={`transition-all duration-300 ${isExpanded ? 'mb-4' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI-Powered Analytics
              <Sparkles className="h-4 w-4 text-purple-400" />
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expand AI Features
                </>
              )}
            </Button>
          </div>
          {!isExpanded && (
            <p className="text-sm text-gray-600 mt-2">
              Get AI-powered insights, recommendations, and chat assistance for your brand analytics
            </p>
          )}
        </CardHeader>
        
        {!isExpanded && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => setIsExpanded(true)}
              >
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-xs">AI Insights</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => setIsExpanded(true)}
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="text-xs">AI Chat</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => setIsExpanded(true)}
              >
                <Target className="h-5 w-5 text-orange-600" />
                <span className="text-xs">Recommendations</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => setIsExpanded(true)}
              >
                <Bell className="h-5 w-5 text-purple-600" />
                <span className="text-xs">Notifications</span>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Expanded AI Features */}
      {isExpanded && (
        <div className="space-y-6">
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="mt-6">
              <AIInsights />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6">
              <AIChat />
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-6">
              <SmartRecommendations />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <AINotifications />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
