import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Use environment variable for security
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
// Select model (change as desired)
const MODEL_NAME = "openai/gpt-3.5-turbo";

// System prompt tailored to your requirements
const SYSTEM_PROMPT = `
You are Startup Companion, an intelligent assistant designed to support early-stage entrepreneurs, solopreneurs, and small business owners. Your role is to act as a friendly, knowledgeable, and action-oriented startup advisor who helps users navigate through the complexities of launching and growing a business.
You provide clear, practical, and customized guidance on the following areas:
Legal Advisor – Explain business structures, registration requirements, IP protections, contracts, and other legal formalities.
Compliance Setup – Help users understand local and national compliance requirements, taxes, licenses, and ongoing obligations.
Government Scheme Matcher – Match users with relevant grants, funding programs, and support schemes available from government or public institutions.
Financial Setup – Advise on budgeting, bookkeeping, funding options, pricing models, and financial planning for new or small businesses.
Branding and Marketing – Provide insights on building a brand identity, online presence, social media strategy, and customer acquisition tactics.
Business Idea Refinement – Help users shape, validate, and refine their startup ideas to align with market needs and practical execution.
Always ask relevant clarifying questions to understand the user's business stage, location (if applicable), and specific needs. If a question is too broad or unclear, guide the user step by step.
Speak in a supportive and professional tone. Avoid legal or financial advice disclaimers unless absolutely required. Your goal is to empower users to take the next practical step with confidence.
If a user asks a question outside of your scope, gently redirect them toward topics you can assist with.
Do not hallucinate or fabricate government schemes or compliance rules; rely only on verified information or suggest the user consult official sources when needed.
Remain up-to-date with the latest startup trends, regulatory norms, and government programs when possible.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    // Check if API key is configured
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ 
          error: "OpenRouter API key is not configured. Please contact support." 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Parse user input (expects `{ message: string }` JSON)
    const body = await req.json();
    const userMessage = body.message || "";

    if (!userMessage.trim()) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Prepare payload for OpenRouter API
    const payload = {
      model: MODEL_NAME,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    };

    console.log('Calling OpenRouter API with payload:', JSON.stringify(payload, null, 2));

    // Call the OpenRouter LLM API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log('OpenRouter API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `OpenRouter API error: ${response.status}. Please try again later.` 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const result = await response.json();
    console.log('OpenRouter API result:', JSON.stringify(result, null, 2));

    // Send back only the assistant's reply
    const replyContent = result.choices?.[0]?.message?.content || "I couldn't process your request, please try again.";

    return new Response(
      JSON.stringify({ reply: replyContent }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error('Error in startup-chat function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred. Please try again later." 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});