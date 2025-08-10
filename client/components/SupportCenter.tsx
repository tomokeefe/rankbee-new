import { useState } from "react";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "./ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "../hooks/use-toast";

interface SupportCenterProps {
  onClose?: () => void;
}

// FAQ Data
const faqCategories = [
  {
    id: "getting-started",
    name: "Getting Started",
    questions: [
      {
        id: "setup-account",
        question: "How do I set up my account?",
        answer: "To set up your account, navigate to Settings > Connections and add your brand information. Make sure to verify your email and connect your data sources for the best experience."
      },
      {
        id: "add-brand",
        question: "How do I add a new brand?",
        answer: "Go to Settings > Connections, click 'Add New Brand', fill in the brand details including name, website, and industry. Once saved, the brand will appear in your Brand Selector."
      },
      {
        id: "first-report",
        question: "How do I generate my first report?",
        answer: "Select your brand from the Brand Selector in the header, apply any filters you need, and navigate through the different sections (Snapshot, Trends, etc.) to view your data. Reports generate automatically based on your selections."
      }
    ]
  },
  {
    id: "features",
    name: "Features & Usage",
    questions: [
      {
        id: "filters",
        question: "How do filters work?",
        answer: "Use the filter icon next to the Brand Selector to access advanced filtering options. You can filter by date range, categories, subcategories, and attributes. Multi-select is available for categories and subcategories."
      },
      {
        id: "ai-insights",
        question: "What are AI Insights?",
        answer: "AI Insights use Gemini AI to analyze your brand data and provide personalized recommendations. These appear in the Insights panels throughout the dashboard and offer actionable suggestions for improving your brand performance."
      },
      {
        id: "export-data",
        question: "Can I export my data?",
        answer: "Yes, most data tables include export options. Look for download icons in the table headers to export data in CSV or PDF format."
      }
    ]
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    questions: [
      {
        id: "data-not-loading",
        question: "Why is my data not loading?",
        answer: "Check your internet connection and ensure your brand has been properly connected in Settings. If data is still not loading, try refreshing the page or clearing your browser cache."
      },
      {
        id: "filter-issues",
        question: "Filters are not working properly",
        answer: "Make sure you've selected a brand first, then apply filters. If issues persist, try clearing all filters and reapplying them. On mobile, use the hamburger menu to access filters."
      },
      {
        id: "performance-slow",
        question: "The dashboard is running slowly",
        answer: "Large datasets can impact performance. Try applying date range filters to limit the data being processed. Also ensure you're using a modern browser with JavaScript enabled."
      }
    ]
  }
];

// Live Chat Component
function LiveChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hi! I'm here to help. What can I assist you with today?",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);
    
    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: messages.length + 2,
        sender: "support",
        text: "Thanks for your message! A support specialist will review your question and respond shortly. In the meantime, you might find our FAQ section helpful.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-96">
      {/* Chat Header */}
      <div className="border-b p-3 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium">Support Team</span>
          <Badge variant="secondary" className="text-xs">Online</Badge>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-[#9369F6] text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600">
              Support is typing...
            </div>
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            size="icon"
            className="bg-[#9369F6] hover:bg-[#7C3AED]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    subject: "",
    priority: "medium",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ subject: "", priority: "medium", category: "", message: "" });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
        <p className="text-gray-600">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            placeholder="What can we help you with?"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            className="border-gray-300 focus:border-[#9369F6]"
          />
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger className="border-gray-300 focus:border-[#9369F6]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - General inquiry</SelectItem>
              <SelectItem value="medium">Medium - Account issue</SelectItem>
              <SelectItem value="high">High - Urgent support needed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="border-gray-300 focus:border-[#9369F6]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical Issue</SelectItem>
            <SelectItem value="billing">Billing Question</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="data">Data Question</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Please describe your question or issue in detail..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={4}
          className="border-gray-300 focus:border-[#9369F6]"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#9369F6] hover:bg-[#7C3AED]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

export function SupportCenter({ onClose }: SupportCenterProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqItems, setOpenFaqItems] = useState<string[]>([]);

  // Filter FAQ based on search
  const filteredFaq = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFaq = (id: string) => {
    setOpenFaqItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:+15551234567";
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@growcreate.com?subject=Support Request&body=Please describe your issue...";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:border-[#9369F6] transition-colors"
              onClick={() => setActiveTab("faq")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-[#9369F6]" />
                  FAQ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">Browse {faqCategories.reduce((acc, cat) => acc + cat.questions.length, 0)} frequently asked questions and solutions.</p>
                <Badge variant="secondary" className="mt-2">Most Popular</Badge>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-[#9369F6] transition-colors"
              onClick={() => setActiveTab("chat")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#9369F6]" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">Chat with our support team in real-time.</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Available now</span>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-[#9369F6] transition-colors"
              onClick={handlePhoneCall}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#9369F6]" />
                  Phone Support
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 font-mono">(555) 123-4567</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Mon-Fri 9AM-6PM EST</span>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-[#9369F6] transition-colors"
              onClick={handleEmailSupport}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#9369F6]" />
                  Email Support
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">support@growcreate.com</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Response within 24 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#9369F6]"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-4">
            {filteredFaq.map((category) => (
              <div key={category.id} className="space-y-2">
                <h3 className="font-semibold text-[#9369F6] text-lg">{category.name}</h3>
                <div className="space-y-2">
                  {category.questions.map((faq) => (
                    <Collapsible
                      key={faq.id}
                      open={openFaqItems.includes(faq.id)}
                      onOpenChange={() => toggleFaq(faq.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className="cursor-pointer hover:border-[#9369F6] transition-colors">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm flex items-center justify-between">
                              <span>{faq.question}</span>
                              {openFaqItems.includes(faq.id) ? 
                                <ChevronUp className="h-4 w-4" /> : 
                                <ChevronDown className="h-4 w-4" />
                              }
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Card className="border-t-0 rounded-t-none">
                          <CardContent className="pt-4">
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredFaq.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-gray-600">Try a different search term or browse all categories.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Live Chat Tab */}
        <TabsContent value="chat" className="mt-6">
          <LiveChat />
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <Mail className="h-8 w-8 text-[#9369F6] mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Send us a message</h3>
              <p className="text-gray-600 text-sm">We'll get back to you as soon as possible.</p>
            </div>
            <ContactForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
