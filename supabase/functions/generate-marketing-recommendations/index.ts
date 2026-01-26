import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProjectProfile {
  project_name: string;
  description: string;
  ecosystem: string;
  marketing_goals_1month: string;
  marketing_goals_6month: string;
  marketing_goals_1year: string;
  budget_range: string;
  support_types: string[];
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectProfile } = await req.json() as { projectProfile: ProjectProfile };

    if (!projectProfile) {
      throw new Error("Project profile is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = `You are a Web3 marketing expert. Based on the following project information, generate 5-7 specific, actionable marketing recommendations.

Project Name: ${projectProfile.project_name}
Description: ${projectProfile.description || 'Not provided'}
Ecosystem: ${projectProfile.ecosystem || 'Not specified'}
Budget Range: ${projectProfile.budget_range || 'Not specified'}
Support Types Needed: ${projectProfile.support_types?.join(', ') || 'Not specified'}

Marketing Goals:
- 1 Month: ${projectProfile.marketing_goals_1month || 'Not specified'}
- 6 Months: ${projectProfile.marketing_goals_6month || 'Not specified'}
- 1 Year: ${projectProfile.marketing_goals_1year || 'Not specified'}

Return a JSON array of recommendations. Each recommendation should have:
- category: One of "Creator Strategy", "Community Building", "Campaign Type", "Content Strategy", "Growth Experiment", "Ambassador Program"
- title: A short, actionable title (max 60 chars)
- description: A detailed explanation of why this is recommended and how to implement it (100-200 words)
- priority: "high", "medium", or "low" based on impact and alignment with goals
- icon: One of "users", "megaphone", "trending", "zap", "target", "lightbulb"

Focus on Web3-specific strategies. Consider the ecosystem and budget constraints. Prioritize recommendations that align with their stated goals.

Return ONLY the JSON array, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a Web3 marketing expert. Always respond with valid JSON only, no markdown or extra text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API Error:", errorText);
      throw new Error("Failed to generate recommendations");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "[]";
    
    // Parse the JSON response
    let recommendations: Recommendation[] = [];
    try {
      // Clean the response in case it has markdown code blocks
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      recommendations = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return default recommendations if parsing fails
      recommendations = [
        {
          category: "Creator Strategy",
          title: "Partner with Tier-1 KOLs in Your Ecosystem",
          description: "Based on your project, partnering with established KOLs in your ecosystem can provide immediate credibility and reach. Focus on creators who have demonstrated engagement with similar projects.",
          priority: "high",
          icon: "users"
        },
        {
          category: "Community Building",
          title: "Launch Ambassador Program",
          description: "Build a dedicated community of advocates who can represent your project across multiple channels. This creates organic growth and authentic engagement.",
          priority: "high",
          icon: "megaphone"
        },
        {
          category: "Content Strategy",
          title: "Educational Content Series",
          description: "Create a content series explaining your project's value proposition. Educational content builds trust and attracts informed community members.",
          priority: "medium",
          icon: "lightbulb"
        }
      ];
    }

    return new Response(
      JSON.stringify({ recommendations }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-marketing-recommendations:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
