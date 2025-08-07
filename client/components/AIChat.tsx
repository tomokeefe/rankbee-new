import { useState } from "react";
import { useFilters } from "../contexts/FilterContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Clock
} from "lucide-react";
import { processNaturalLanguageQuery, ChatQuery } from "../services/geminiService";
import { getMockMetrics } from "../services/dataService";

export function AIChat() {
  const { filters } = useFilters();
  const [chatHistory, setChatHistory] = useState<ChatQuery[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const commonQuestions = [
    "How is my brand performing this month?",
    "What are the biggest opportunities for growth?",
    "Why did engagement drop last week?",
    "Which content performs best?",
    "How do I compare to competitors?",
  ];

  const handleSendQuery = async () => {
    if (!currentQuery.trim() || loading) return;

    setLoading(true);
    const query = currentQuery;
    setCurrentQuery("");

    try {
      // Get current dashboard data
      const dashboardData = getMockMetrics(filters.brand, filters.timeframe);
      
      // Process the query with AI
      const response = await processNaturalLanguageQuery(query, dashboardData);
      
      setChatHistory(prev => [...prev, response]);
    } catch (error) {
      console.error("Error processing query:", error);
      // Add error response
      setChatHistory(prev => [...prev, {
        id: Date.now().toString(),
        query,
        response: "I'm sorry, I couldn't process your question right now. Please try again later.",
        timestamp: new Date(),
        confidence: 0,
        suggestedFollowUp: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setCurrentQuery(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendQuery();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-purple-600" />
          AI Assistant
          <Sparkles className="h-4 w-4 text-purple-400" />
        </CardTitle>
        <CardDescription>
          Ask questions about your brand performance and get AI-powered insights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
          {chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Ask me anything about your brand performance!</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-400 mb-2">Try these questions:</p>
                {commonQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="block mx-auto text-xs"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id} className="space-y-3">
                {/* User Query */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-gray-900">{chat.query}</p>
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border rounded-lg p-3">
                      <p className="text-gray-900 mb-2">{chat.response}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {chat.timestamp.toLocaleTimeString()}
                        <Badge variant="outline" className="text-xs">
                          {Math.round(chat.confidence * 100)}% confident
                        </Badge>
                      </div>
                      
                      {chat.suggestedFollowUp.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-500 mb-2">Follow-up questions:</p>
                          <div className="flex flex-wrap gap-2">
                            {chat.suggestedFollowUp.map((followUp, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-2"
                                onClick={() => handleQuestionClick(followUp)}
                              >
                                {followUp}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                    <span className="text-gray-500">Analyzing your data...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your brand performance..."
              className="flex-1"
              disabled={loading}
            />
            <Button 
              onClick={handleSendQuery}
              disabled={!currentQuery.trim() || loading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Questions */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1 px-2 text-gray-600 hover:text-gray-900"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
