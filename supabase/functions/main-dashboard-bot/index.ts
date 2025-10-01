import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface UserDetails {
  id: string;
  full_name?: string;
  business_name?: string;
  business_stage?: string;
  industry?: string;
  location?: string;
  registered?: boolean;
  entity_type?: string;
  funding_needed?: boolean;
  legal_help_needed?: boolean;
  govt_scheme_interest?: boolean;
  branding_status?: string;
  financial_status?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  sessionId?: string;
  chatHistory?: ChatMessage[];
}

const SYSTEM_PROMPT = `You are the **Startup Companion**, a comprehensive business support AI designed to help early-stage entrepreneurs succeed. You are the main dashboard assistant that coordinates all aspects of startup development.

Your core capabilities include:
- **Legal Guidance**: Business registration, compliance, IP protection
- **Financial Setup**: Banking, accounting, funding strategies
- **Government Schemes**: Grant matching, subsidy identification
- **Branding & Marketing**: Brand development, go-to-market strategies
- **General Business Advice**: Strategy, operations, growth planning

Key Responsibilities:
- Assess user needs and delegate to specialized bots when appropriate
- Provide holistic business guidance that connects all aspects
- Ask clarifying questions to understand the user's priorities
- Offer step-by-step actionable advice
- Encourage confidence and next steps
- Connect different business areas (e.g., legal structure affects funding options)

Guidelines:
- Ask short, focused questions (one-liner preferred)
- Tailor advice using the user's profile information
- When users ask about specific areas (legal, financial, etc.), offer to connect them with specialized assistants
- Provide encouraging, supportive responses
- Be practical and actionable
- End conversations by asking: "Are you satisfied with the response?"
- Never hallucinate legal, financial, or regulatory information
- Always recommend professional consultation for complex matters

Delegation Rules:
- Legal questions → Suggest using Legal Advisor Bot
- Government schemes → Suggest using Government Scheme Matcher
- Financial setup → Suggest using Financial Setup Bot  
- Branding/marketing → Suggest using Branding & Marketing Bot`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, sessionId, chatHistory = [] }: RequestBody = await req.json();

    // Fetch user details for personalization
    const { data: userDetails } = await supabase
      .from('user_details')
      .select('*')
      .eq('id', user.id)
      .single();

    // Create or get chat session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          session_type: 'main_dashboard',
          title: 'General Business Consultation'
        })
        .select()
        .single();
      currentSessionId = newSession?.id;
    }

    // Build comprehensive context from user details
    let userContext = '';
    if (userDetails) {
      userContext = `User Profile:
- Name: ${userDetails.full_name || 'Not provided'}
- Business: ${userDetails.business_name || 'Not provided'}
- Stage: ${userDetails.business_stage || 'idea'}
- Industry: ${userDetails.industry || 'Not specified'}
- Location: ${userDetails.location || 'Not specified'}
- Registered: ${userDetails.registered ? 'Yes' : 'No'}
- Entity Type: ${userDetails.entity_type || 'Not decided'}
- Funding Needed: ${userDetails.funding_needed ? 'Yes' : 'No'}
- Legal Help Needed: ${userDetails.legal_help_needed ? 'Yes' : 'No'}
- Government Scheme Interest: ${userDetails.govt_scheme_interest ? 'Yes' : 'No'}
- Branding Status: ${userDetails.branding_status || 'Not started'}
- Financial Status: ${userDetails.financial_status || 'Not assessed'}

Use this information to provide personalized, relevant advice and identify areas where the user might need focused help.`;
    }

    // Prepare messages for OpenRouter
    const messages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${userContext}` },
      ...chatHistory,
      { role: 'user', content: message }
    ];

    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://startup-companion.com',
        'X-Title': 'Startup Companion - Main Dashboard'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages,
        max_tokens: 600,
        temperature: 0.7,
        stream: false
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error('Failed to get response from AI service');
    }

    const aiData = await openRouterResponse.json();
    const aiResponse = aiData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response received from AI service');
    }

    // Store the AI response
    const { data: responseRecord } = await supabase
      .from('ai_responses')
      .insert({
        user_id: user.id,
        session_id: currentSessionId,
        bot_type: 'main_dashboard',
        user_message: message,
        ai_response: aiResponse
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({
        response: aiResponse,
        sessionId: currentSessionId,
        responseId: responseRecord?.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Main dashboard bot error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});