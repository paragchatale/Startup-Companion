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
  userDetails?: UserDetails;
}

const SYSTEM_PROMPT = `You are the **Startup Companion**, a comprehensive business support AI designed to help early-stage entrepreneurs succeed. You are the main dashboard assistant that coordinates all aspects of startup development.

Your core capabilities include:
- **Legal Guidance**: Business registration, compliance, IP protection
- **Financial Setup**: Banking, accounting, funding strategies
- **Government Schemes**: Grant matching, subsidy identification
- **Branding & Marketing**: Brand development, go-to-market strategies
- **General Business Advice**: Strategy, operations, growth planning

Key Responsibilities:
- **Smart Bot Orchestration**: When users ask questions that require specialized expertise, intelligently route to expert bots and relay their responses
- Assess user needs and delegate to specialized bots when appropriate
- Provide holistic business guidance that connects all aspects
- Ask clarifying questions to understand the user's priorities
- Offer step-by-step actionable advice
- Encourage confidence and next steps
- Connect different business areas (e.g., legal structure affects funding options)

**CRITICAL: Check User Profile Completeness**
Before providing detailed advice, check if the user has provided essential details like business_name, industry, location, business_stage. If key information is missing, politely ask them to update their profile for more tailored advice. Set missingDetails flag to true in response.

Guidelines:
- Ask short, focused questions (one-liner preferred)
- Tailor advice using the user's profile information
- When users ask about specific areas (legal, financial, etc.), offer to connect them with specialized assistants
- Provide encouraging, supportive responses
- Be practical and actionable
- End conversations by asking: "Are you satisfied with the response?"
- Only ask satisfaction question at natural conclusion points, not robotically every few responses
- Never hallucinate legal, financial, or regulatory information
- Always recommend professional consultation for complex matters

Delegation Rules:
- Legal questions → Suggest using Legal Advisor Bot
- Government schemes → Suggest using Government Scheme Matcher
- Financial setup → Suggest using Financial Setup Bot  
- Branding/marketing → Suggest using Branding & Marketing Bot`;

**Bot Orchestration Protocol:**
When a user asks a question that clearly falls under a specialist domain:
1. Recognize the domain (legal, financial, government schemes, branding/marketing)
2. Ask: "This sounds like a [domain] question. Would you like me to connect with our [Expert Bot Name] to get you detailed guidance?"
3. If user agrees, route the question to the appropriate bot and relay the response
4. Allow follow-up questions in the same conversation
5. Maintain context across bot interactions

**Response Format:**
Always return: { response: string, missingDetails?: boolean, botType?: string, routedResponse?: boolean }`;
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

    const { message, sessionId, chatHistory = [], userDetails }: RequestBody = await req.json();

    // Fetch user details if not provided
    let currentUserDetails = userDetails;
    if (!currentUserDetails) {
      const { data } = await supabase
        .from('user_details')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      currentUserDetails = data;
    }

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
    let missingDetails = false;
    let userContext = '';
    if (currentUserDetails) {
      // Check for missing critical details
      const criticalFields = ['business_name', 'industry', 'location', 'business_stage'];
      const missingFields = criticalFields.filter(field => !currentUserDetails[field]);
      
      if (missingFields.length > 0) {
        missingDetails = true;
      }

      userContext = `User Profile:
- Name: ${currentUserDetails.full_name || 'Not provided'}
- Business: ${currentUserDetails.business_name || 'Not provided'}
- Stage: ${currentUserDetails.business_stage || 'idea'}
- Industry: ${currentUserDetails.industry || 'Not specified'}
- Location: ${currentUserDetails.location || 'Not specified'}
- Registered: ${currentUserDetails.registered ? 'Yes' : 'No'}
- Entity Type: ${currentUserDetails.entity_type || 'Not decided'}
- Funding Needed: ${currentUserDetails.funding_needed ? 'Yes' : 'No'}
- Legal Help Needed: ${currentUserDetails.legal_help_needed ? 'Yes' : 'No'}
- Government Scheme Interest: ${currentUserDetails.govt_scheme_interest ? 'Yes' : 'No'}
- Branding Status: ${currentUserDetails.branding_status || 'Not started'}
- Financial Status: ${currentUserDetails.financial_status || 'Not assessed'}

Use this information to provide personalized, relevant advice and identify areas where the user might need focused help.

${missingDetails ? 'IMPORTANT: Key profile information is missing. Encourage user to update their profile for better personalized advice.' : ''}`;
    } else {
      missingDetails = true;
      userContext = 'User Profile: No profile information available. Encourage user to complete their profile for personalized advice.';
    }

    // Detect if question requires specialist bot
    const legalKeywords = ['legal', 'registration', 'compliance', 'trademark', 'patent', 'contract', 'agreement', 'incorporation', 'entity', 'liability'];
    const financeKeywords = ['finance', 'financial', 'banking', 'account', 'funding', 'investment', 'loan', 'gst', 'tax', 'accounting', 'bookkeeping'];
    const schemeKeywords = ['government', 'scheme', 'grant', 'subsidy', 'funding', 'incubator', 'accelerator', 'startup india'];
    const brandingKeywords = ['brand', 'branding', 'marketing', 'logo', 'website', 'social media', 'advertising', 'promotion'];

    const messageLower = message.toLowerCase();
    let suggestedBot = '';
    
    if (legalKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'legal';
    } else if (financeKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'financial';
    } else if (schemeKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'government';
    } else if (brandingKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'branding';
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
        max_tokens: 800,
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
        missingDetails,
        suggestedBot,
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