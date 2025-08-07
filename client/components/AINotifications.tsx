import { useState, useEffect } from "react";
import { useFilters } from "../contexts/FilterContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Info,
  X,
  Clock,
  Sparkles
} from "lucide-react";

interface AINotification {
  id: string;
  type: 'trend' | 'anomaly' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
  isRead: boolean;
  actionRequired: boolean;
  metricAffected: string;
  changePercent?: number;
}

const notificationIcons = {
  trend: TrendingUp,
  anomaly: AlertTriangle,
  alert: TrendingDown,
  info: Info,
};

const severityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

const typeColors = {
  trend: "border-green-500 bg-green-50",
  anomaly: "border-orange-500 bg-orange-50", 
  alert: "border-red-500 bg-red-50",
  info: "border-blue-500 bg-blue-50",
};

export function AINotifications() {
  const { filters } = useFilters();
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, [filters.brand, filters.timeframe]);

  const generateNotifications = async () => {
    setLoading(true);
    
    // Simulate AI-generated notifications
    setTimeout(() => {
      const mockNotifications: AINotification[] = [
        {
          id: "1",
          type: "trend",
          title: "Positive Engagement Trend Detected",
          message: "Your brand engagement has been consistently increasing over the past 7 days, with a 23% uplift compared to previous period.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          severity: "low",
          isRead: false,
          actionRequired: false,
          metricAffected: "Engagement Rate",
          changePercent: 23
        },
        {
          id: "2",
          type: "anomaly", 
          title: "Unusual Weekend Performance Drop",
          message: "Weekend engagement dropped 15% below normal patterns. This is unusual for restaurant brands and may indicate content scheduling issues.",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          severity: "medium",
          isRead: false,
          actionRequired: true,
          metricAffected: "Weekend Engagement",
          changePercent: -15
        },
        {
          id: "3",
          type: "alert",
          title: "Competitor Activity Surge",
          message: "Competitors in your category have increased their posting frequency by 40% this week. Consider adjusting your content strategy to maintain visibility.",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          severity: "high",
          isRead: false,
          actionRequired: true,
          metricAffected: "Share of Voice",
          changePercent: -12
        },
        {
          id: "4",
          type: "trend",
          title: "Visual Content Performance Peak",
          message: "Image posts are performing 45% better than average this week. AI suggests doubling visual content production for optimal results.",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          severity: "low",
          isRead: true,
          actionRequired: false,
          metricAffected: "Visual Content Engagement",
          changePercent: 45
        },
        {
          id: "5",
          type: "info",
          title: "Optimal Posting Time Shift",
          message: "AI analysis suggests your optimal posting window has shifted to 2 PM - 4 PM based on recent audience behavior patterns.",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          severity: "medium",
          isRead: true,
          actionRequired: false,
          metricAffected: "Posting Schedule"
        }
      ];

      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleDismiss = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const sortedNotifications = notifications.sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-600" />
          AI Notifications
          <Sparkles className="h-4 w-4 text-purple-400" />
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time AI analysis alerts and trend notifications
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {sortedNotifications.map((notification) => {
              const IconComponent = notificationIcons[notification.type];
              
              return (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-all ${
                    notification.isRead ? 'opacity-75' : ''
                  } ${typeColors[notification.type]}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold text-sm ${
                            notification.isRead ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge className={`text-xs text-white ${severityColors[notification.severity]}`}>
                            {notification.severity}
                          </Badge>
                          {notification.actionRequired && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Action Needed
                            </Badge>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(notification.timestamp)}
                          </div>
                          <div>
                            Metric: {notification.metricAffected}
                          </div>
                          {notification.changePercent && (
                            <div className={`flex items-center gap-1 ${
                              notification.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {notification.changePercent > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {Math.abs(notification.changePercent)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs"
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications at the moment</p>
                <p className="text-gray-400 text-sm">AI will notify you of important trends and changes</p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 border-t">
          <Button 
            onClick={generateNotifications}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" />
            Refresh
          </Button>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications(prev => 
                prev.map(n => ({ ...n, isRead: true }))
              )}
              className="text-sm"
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
