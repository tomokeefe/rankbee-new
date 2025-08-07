const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "AIzaSyCPkeoXew8wmLf_QY6kx_TcLDejOMO85o4";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface PromptAnalysis {
  id: string;
  originalPrompt: string;
  intent: string;
  sentiment: "positive" | "negative" | "neutral";
  category: string;
  brandMention: boolean;
  competitorMentioned?: string;
  suggestedResponse: string;
  confidenceScore: number;
  timestamp: Date;
}

export async function analyzePrompt(
  prompt: string,
  brandName: string,
): Promise<PromptAnalysis> {
  try {
    const analysisPrompt = `
Analyze this user search prompt for brand visibility insights: "${prompt}"
Brand context: ${brandName}

Please provide a JSON response with the following structure:
{
  "intent": "Brief description of user intent",
  "sentiment": "positive|negative|neutral",
  "category": "Category of the search (e.g., 'restaurant search', 'menu inquiry', 'location search')",
  "brandMention": true/false,
  "competitorMentioned": "competitor name if mentioned, otherwise null",
  "suggestedResponse": "How the brand should position itself for this type of query",
  "confidenceScore": 0.0-1.0
}

Focus on understanding what the user is looking for and how it relates to brand visibility and search intent.
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: analysisPrompt,
              },
            ],
          },
        ],
      }),
    });

    // Clone the response so we can read it multiple times if needed
    const responseClone = response.clone();

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, try reading as text for debugging
      const text = await responseClone.text();
      console.error("Failed to parse JSON response:", text);
      throw new Error("Invalid JSON response from API");
    }

    if (!response.ok) {
      console.error("Gemini API error details:", response.status, data);
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(data)}`);
    }

    if (!data.candidates || !data.candidates[0]) {
      throw new Error("No candidates in AI response");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Parse the JSON response from Gemini
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      id: generateId(),
      originalPrompt: prompt,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      category: analysis.category,
      brandMention: analysis.brandMention,
      competitorMentioned: analysis.competitorMentioned,
      suggestedResponse: analysis.suggestedResponse,
      confidenceScore: analysis.confidenceScore,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error analyzing prompt:", error);
    // Fallback analysis if AI fails
    return generateMockAnalysis(prompt, brandName);
  }
}

export interface DashboardInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'alert';
  title: string;
  description: string;
  significance: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestedActions: string[];
  confidence: number;
  timestamp: Date;
  dataContext: any;
}

export interface ChatQuery {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  confidence: number;
  suggestedFollowUp: string[];
}

export async function analyzeDashboardData(data: any, brandName: string): Promise<DashboardInsight[]> {
  try {
    const analysisPrompt = `
Analyze this brand dashboard data for ${brandName} and provide actionable insights:

Data: ${JSON.stringify(data, null, 2)}

Please provide insights as a JSON array of objects with this structure:
[
  {
    "type": "trend|anomaly|opportunity|alert",
    "title": "Brief insight title",
    "description": "Detailed explanation of the insight",
    "significance": "high|medium|low",
    "actionable": true/false,
    "suggestedActions": ["Action 1", "Action 2"],
    "confidence": 0.0-1.0
  }
]

Focus on:
- Performance trends and patterns
- Unusual changes or anomalies
- Growth opportunities
- Actionable recommendations
- Competitive positioning insights

Limit to 5-8 most significant insights.
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: analysisPrompt,
              },
            ],
          },
        ],
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Gemini API error details:", response.status, responseData);
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    const aiResponse = responseData.candidates[0].content.parts[0].text;

    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const insights = JSON.parse(jsonMatch[0]);

    return insights.map((insight: any) => ({
      id: generateId(),
      type: insight.type,
      title: insight.title,
      description: insight.description,
      significance: insight.significance,
      actionable: insight.actionable,
      suggestedActions: insight.suggestedActions,
      confidence: insight.confidence,
      timestamp: new Date(),
      dataContext: data
    }));
  } catch (error) {
    console.error("Error analyzing dashboard data:", error);
    return generateMockInsights(brandName);
  }
}

export async function processNaturalLanguageQuery(query: string, dashboardData: any): Promise<ChatQuery> {
  try {
    const queryPrompt = `
User question about their brand dashboard data: "${query}"

Dashboard context: ${JSON.stringify(dashboardData, null, 2)}

Please provide a helpful response that:
1. Directly answers the user's question using the available data
2. Provides specific numbers/metrics when possible
3. Explains any trends or patterns relevant to their question
4. Suggests related insights they might find valuable

Respond in this JSON format:
{
  "response": "Your detailed answer to the user's question",
  "confidence": 0.0-1.0,
  "suggestedFollowUp": ["Question 1", "Question 2", "Question 3"]
}
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: queryPrompt,
              },
            ],
          },
        ],
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Gemini API error details:", response.status, responseData);
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(responseData)}`);
    }

    const aiResponse = responseData.candidates[0].content.parts[0].text;

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    return {
      id: generateId(),
      query,
      response: parsedResponse.response,
      timestamp: new Date(),
      confidence: parsedResponse.confidence,
      suggestedFollowUp: parsedResponse.suggestedFollowUp
    };
  } catch (error) {
    console.error("Error processing natural language query:", error);
    return generateMockChatResponse(query);
  }
}

export async function generatePromptSuggestions(
  brandName: string,
  category: string,
): Promise<string[]> {
  try {
    const suggestionPrompt = `
Generate 10 realistic search prompts that users might enter when looking for ${brandName} or similar ${category} businesses.
Include a mix of:
- Direct brand searches
- Local searches
- Menu/service inquiries
- Comparison searches
- Competitor searches

Return as a simple JSON array of strings.
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: suggestionPrompt,
              },
            ],
          },
        ],
      }),
    });

    // Clone the response so we can read it multiple times if needed
    const responseClone = response.clone();

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, try reading as text for debugging
      const text = await responseClone.text();
      console.error("Failed to parse JSON response:", text);
      throw new Error("Invalid JSON response from API");
    }

    if (!response.ok) {
      console.error("Gemini API error details:", response.status, data);
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(data)}`);
    }

    if (!data.candidates || !data.candidates[0]) {
      throw new Error("No candidates in AI response");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Parse the JSON array from Gemini
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return generateMockSuggestions(brandName, category);
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateMockAnalysis(
  prompt: string,
  brandName: string,
): PromptAnalysis {
  const lowercasePrompt = prompt.toLowerCase();
  const lowercaseBrand = brandName.toLowerCase();

  // Intelligent analysis based on prompt content
  let intent = "General search query";
  let sentiment: "positive" | "negative" | "neutral" = "neutral";
  let category = "General";
  let competitorMentioned: string | undefined;
  let suggestedResponse = "Ensure strong SEO presence for relevant keywords";
  let confidenceScore = 0.7;

  // Analyze intent
  if (
    lowercasePrompt.includes("near me") ||
    lowercasePrompt.includes("location") ||
    lowercasePrompt.includes("address")
  ) {
    intent = "Local search for nearby locations";
    category = "Location Search";
    suggestedResponse = "Optimize local SEO and Google My Business listings";
    confidenceScore = 0.9;
  } else if (
    lowercasePrompt.includes("menu") ||
    lowercasePrompt.includes("price") ||
    lowercasePrompt.includes("cost")
  ) {
    intent = "Menu and pricing information seeking";
    category = "Menu Inquiry";
    suggestedResponse =
      "Ensure menu and pricing information is easily accessible online";
    confidenceScore = 0.85;
  } else if (
    lowercasePrompt.includes("vs") ||
    lowercasePrompt.includes("compare") ||
    lowercasePrompt.includes("better")
  ) {
    intent = "Brand comparison research";
    category = "Comparison Search";
    suggestedResponse =
      "Highlight unique value propositions and competitive advantages";
    confidenceScore = 0.8;

    // Check for competitor mentions
    const competitors = [
      "maggiano's",
      "carrabba's",
      "buca di beppo",
      "romano's",
      "fazoli's",
    ];
    for (const competitor of competitors) {
      if (lowercasePrompt.includes(competitor)) {
        competitorMentioned =
          competitor.charAt(0).toUpperCase() + competitor.slice(1);
        break;
      }
    }
  } else if (
    lowercasePrompt.includes("hours") ||
    lowercasePrompt.includes("open") ||
    lowercasePrompt.includes("closed")
  ) {
    intent = "Operating hours inquiry";
    category = "Service Search";
    suggestedResponse =
      "Prominently display current hours and any special holiday schedules";
    confidenceScore = 0.9;
  } else if (
    lowercasePrompt.includes("delivery") ||
    lowercasePrompt.includes("takeout") ||
    lowercasePrompt.includes("pickup")
  ) {
    intent = "Service availability inquiry";
    category = "Service Search";
    suggestedResponse =
      "Prominently display delivery options and ordering platforms";
    confidenceScore = 0.88;
  } else if (
    lowercasePrompt.includes("review") ||
    lowercasePrompt.includes("rating") ||
    lowercasePrompt.includes("opinion")
  ) {
    intent = "Review and rating research";
    category = "Review Search";
    suggestedResponse =
      "Encourage positive reviews and respond to customer feedback";
    confidenceScore = 0.82;
  } else if (
    lowercasePrompt.includes("best") ||
    lowercasePrompt.includes("top") ||
    lowercasePrompt.includes("good")
  ) {
    intent = "Quality-focused discovery search";
    category = "Discovery Search";
    suggestedResponse =
      "Emphasize quality, awards, and positive customer experiences";
    confidenceScore = 0.75;
    sentiment = "positive";
  } else if (
    lowercasePrompt.includes("family") ||
    lowercasePrompt.includes("kids") ||
    lowercasePrompt.includes("children")
  ) {
    intent = "Family-friendly dining search";
    category = "Feature Search";
    suggestedResponse =
      "Emphasize family-friendly atmosphere and kids menu options";
    confidenceScore = 0.78;
    sentiment = "positive";
  }

  // Determine sentiment
  if (
    lowercasePrompt.includes("bad") ||
    lowercasePrompt.includes("worst") ||
    lowercasePrompt.includes("terrible") ||
    lowercasePrompt.includes("avoid")
  ) {
    sentiment = "negative";
  } else if (
    lowercasePrompt.includes("best") ||
    lowercasePrompt.includes("great") ||
    lowercasePrompt.includes("excellent") ||
    lowercasePrompt.includes("love")
  ) {
    sentiment = "positive";
  }

  // Check for brand mention
  const brandMention =
    lowercasePrompt.includes(lowercaseBrand) ||
    lowercasePrompt.includes(brandName.replace(/\s+/g, "").toLowerCase());

  return {
    id: generateId(),
    originalPrompt: prompt,
    intent,
    sentiment,
    category,
    brandMention,
    competitorMentioned,
    suggestedResponse,
    confidenceScore,
    timestamp: new Date(),
  };
}

function generateMockSuggestions(
  brandName: string,
  category: string,
): string[] {
  const baseSuggestions = [
    `${brandName} near me`,
    `${brandName} menu prices`,
    `${brandName} hours`,
    `${brandName} delivery`,
    `${brandName} reviews`,
    `${brandName} locations`,
    `${brandName} reservations`,
    `${brandName} takeout menu`,
    `best ${category.toLowerCase()} near me`,
    `${category.toLowerCase()} with good food`,
    `family friendly ${category.toLowerCase()}`,
    `${category.toLowerCase()} open now`,
    `${brandName} vs competitors`,
    `${brandName} special offers`,
    `${brandName} catering menu`,
  ];

  // Add brand-specific suggestions based on brand name
  const brandSpecific: string[] = [];

  if (brandName.toLowerCase().includes("olive")) {
    brandSpecific.push(
      "olive garden breadsticks",
      "olive garden unlimited soup salad",
      "olive garden italian restaurant",
      "olive garden vs maggianos",
    );
  } else if (brandName.toLowerCase().includes("maggiano")) {
    brandSpecific.push(
      "maggianos family style",
      "maggianos little italy",
      "maggianos pasta portions",
      "maggianos special occasions",
    );
  }

  // Combine and randomize
  const allSuggestions = [...baseSuggestions, ...brandSpecific];

  // Return 10 random suggestions
  const shuffled = allSuggestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
}

function generateMockInsights(brandName: string): DashboardInsight[] {
  return [
    {
      id: generateId(),
      type: 'trend',
      title: `${brandName} showing strong engagement growth`,
      description: 'Brand engagement has increased by 18% over the past 30 days, with particularly strong performance in visual content.',
      significance: 'high',
      actionable: true,
      suggestedActions: [
        'Increase visual content production',
        'Analyze top-performing content themes',
        'Expand successful content formats'
      ],
      confidence: 0.89,
      timestamp: new Date(),
      dataContext: { metric: 'engagement', trend: 'up', change: 0.18 }
    },
    {
      id: generateId(),
      type: 'opportunity',
      title: 'Untapped evening audience potential',
      description: 'Data shows 23% lower engagement during 6-9 PM compared to industry benchmarks, suggesting opportunity for targeted evening campaigns.',
      significance: 'medium',
      actionable: true,
      suggestedActions: [
        'Launch evening-focused campaigns',
        'Create dinner-time content',
        'Test promotional timing'
      ],
      confidence: 0.76,
      timestamp: new Date(),
      dataContext: { timeframe: 'evening', gap: 0.23 }
    },
    {
      id: generateId(),
      type: 'anomaly',
      title: 'Unusual weekend performance dip',
      description: 'Weekend engagement dropped 12% below normal patterns, which is atypical for restaurant brands.',
      significance: 'medium',
      actionable: true,
      suggestedActions: [
        'Investigate weekend content strategy',
        'Review competitor weekend activity',
        'Adjust posting schedule'
      ],
      confidence: 0.82,
      timestamp: new Date(),
      dataContext: { period: 'weekend', change: -0.12 }
    }
  ];
}

function generateMockChatResponse(query: string): ChatQuery {
  return {
    id: generateId(),
    query,
    response: `Based on your dashboard data, I can see that your brand metrics show interesting patterns. ${query.includes('engagement') ? 'Your engagement rates are currently trending upward with a 15% increase this month.' : 'The data suggests strong performance across key metrics.'} This indicates positive brand momentum and audience connection.`,
    timestamp: new Date(),
    confidence: 0.75,
    suggestedFollowUp: [
      'What factors are driving this trend?',
      'How does this compare to competitors?',
      'What actions should I take next?'
    ]
  };
}

// Mock data for initial display
export const mockPromptAnalyses: PromptAnalysis[] = [
  {
    id: "1",
    originalPrompt: "best italian restaurant near me",
    intent: "Local restaurant discovery",
    sentiment: "neutral",
    category: "Location Search",
    brandMention: false,
    suggestedResponse: "Optimize for local SEO and 'near me' searches",
    confidenceScore: 0.92,
    timestamp: new Date("2025-01-08T10:30:00"),
  },
  {
    id: "2",
    originalPrompt: "Olive Garden menu and prices",
    intent: "Menu information seeking",
    sentiment: "neutral",
    category: "Menu Inquiry",
    brandMention: true,
    suggestedResponse:
      "Ensure menu and pricing information is easily accessible online",
    confidenceScore: 0.88,
    timestamp: new Date("2025-01-08T09:45:00"),
  },
  {
    id: "3",
    originalPrompt: "Olive Garden vs Maggiano's which is better",
    intent: "Brand comparison research",
    sentiment: "neutral",
    category: "Comparison Search",
    brandMention: true,
    competitorMentioned: "Maggiano's",
    suggestedResponse:
      "Highlight unique value propositions and competitive advantages",
    confidenceScore: 0.85,
    timestamp: new Date("2025-01-08T08:20:00"),
  },
  {
    id: "4",
    originalPrompt: "family friendly restaurants with good breadsticks",
    intent: "Family dining with specific preferences",
    sentiment: "positive",
    category: "Feature Search",
    brandMention: false,
    suggestedResponse:
      "Emphasize family-friendly atmosphere and signature menu items",
    confidenceScore: 0.78,
    timestamp: new Date("2025-01-08T07:15:00"),
  },
  {
    id: "5",
    originalPrompt: "Olive Garden delivery options",
    intent: "Service availability inquiry",
    sentiment: "neutral",
    category: "Service Search",
    brandMention: true,
    suggestedResponse:
      "Prominently display delivery options and ordering platforms",
    confidenceScore: 0.91,
    timestamp: new Date("2025-01-08T06:30:00"),
  },
];
