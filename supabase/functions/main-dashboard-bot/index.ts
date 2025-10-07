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
- **Document Analysis**: Reading and analyzing user's business documents

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

**Bot Orchestration Protocol:**
When a user asks a question that clearly falls under a specialist domain:
1. Recognize the domain (legal, financial, government schemes, branding/marketing)
2. Ask: "This sounds like a [domain] question. Would you like me to connect with our [Expert Bot Name] to get you detailed guidance?"
3. If user agrees (responds with "yes", "sure", "connect", "please do", etc.), route the question to the appropriate bot and relay the response
4. Allow follow-up questions in the same conversation
5. Maintain context across bot interactions

**Document Access:**
You can access and analyze documents from the user's "My Biz Doc" folder to answer questions about their business documents, contracts, plans, etc.

Guidelines:
- Ask short, focused questions (one-liner preferred)
- Tailor advice using the user's profile information
- When users ask about specific areas (legal, financial, etc.), offer to connect them with specialized assistants
- Provide encouraging, supportive responses
- Be practical and actionable
- End conversations by asking: "Are you satisfied with the response?" only at natural conclusion points
- Never hallucinate legal, financial, or regulatory information
- Always recommend professional consultation for complex matters

**Response Format:**
Always return: { response: string, missingDetails?: boolean, botType?: string, routedResponse?: boolean }`;

// Helper function to call expert bots
async function callExpertBot(botType: string, message: string, userDetails: any, supabaseUrl: string, supabaseServiceKey: string, openRouterApiKey: string, userId: string) {
  const botEndpoints = {
    'legal': 'legal-advisor-bot',
    'financial': 'financial-setup-bot',
    'government': 'govt-scheme-matcher',
    'branding': 'branding-marketing-bot'
    'registration': 'registration-guide-guru-bot'
  };

  const endpoint = botEndpoints[botType as keyof typeof botEndpoints];
  if (!endpoint) return null;

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userDetails,
        chatHistory: []
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.response;
    }
  } catch (error) {
    console.error(`Error calling ${botType} bot:`, error);
  }

  return null;
}

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

    // Check if user is asking to connect to an expert bot
    const messageLower = message.toLowerCase();
    const connectKeywords = ['yes', 'sure', 'connect', 'please do', 'go ahead', 'okay', 'ok'];
    const isConnectRequest = connectKeywords.some(keyword => messageLower.includes(keyword));

    // Check if previous message suggested connecting to a bot
    const lastAssistantMessage = chatHistory.filter(m => m.role === 'assistant').pop();
    const suggestedConnection = lastAssistantMessage?.content.includes('Would you like me to connect');

    let expertResponse = null;
    let routedBotType = null;

    if (isConnectRequest && suggestedConnection) {
      // Determine which bot to connect to based on the previous suggestion
      if (lastAssistantMessage?.content.includes('Legal Advisor')) {
        expertResponse = await callExpertBot('legal', message, currentUserDetails, supabaseUrl, supabaseServiceKey, openRouterApiKey, user.id);
        routedBotType = 'legal_advisor';
      } else if (lastAssistantMessage?.content.includes('Financial Setup')) {
        expertResponse = await callExpertBot('financial', message, currentUserDetails, supabaseUrl, supabaseServiceKey, openRouterApiKey, user.id);
        routedBotType = 'financial_setup';
      } else if (lastAssistantMessage?.content.includes('Government Scheme')) {
        expertResponse = await callExpertBot('government', message, currentUserDetails, supabaseUrl, supabaseServiceKey, openRouterApiKey, user.id);
        routedBotType = 'govt_scheme_matcher';
      } else if (lastAssistantMessage?.content.includes('Branding')) {
        expertResponse = await callExpertBot('branding', message, currentUserDetails, supabaseUrl, supabaseServiceKey, openRouterApiKey, user.id);
        routedBotType = 'branding_marketing';
      } else if (lastAssistantMessage?.content.includes('Registration Guide')) {
        expertResponse = await callExpertBot('registration', message, currentUserDetails, supabaseUrl, supabaseServiceKey, openRouterApiKey, user.id);
        routedBotType = 'registration_guide_guru';
      }
    }

    // If we got an expert response, return it
    if (expertResponse) {
      // Store the AI response
      await supabase
        .from('ai_responses')
        .insert({
          user_id: user.id,
          session_id: currentSessionId,
          bot_type: routedBotType,
          user_message: message,
          ai_response: expertResponse
        });

      return new Response(
        JSON.stringify({
          response: expertResponse,
          botType: routedBotType,
          routedResponse: true,
          sessionId: currentSessionId
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Detect if question requires specialist bot
    const legalKeywords = ['legal', 'registration', 'compliance', 'trademark', 'patent', 'contract', 'agreement', 'incorporation', 'entity', 'liability'];
    const financeKeywords = ['finance', 'financial', 'banking', 'account', 'funding', 'investment', 'loan', 'gst', 'tax', 'accounting', 'bookkeeping'];
    const schemeKeywords = ['government', 'scheme', 'grant', 'subsidy', 'funding', 'incubator', 'accelerator', 'startup india'];
    const brandingKeywords = ['brand', 'branding', 'marketing', 'logo', 'website', 'social media', 'advertising', 'promotion'];
    const registrationKeywords = ['registration', 'register', 'company name', 'entity', 'incorporation', 'moa', 'aoa', 'dsc', 'din', 'private limited', 'llp', 'partnership', 'proprietorship'];

    let suggestedBot = '';
    
    if (legalKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'legal';
    } else if (financeKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'financial';
    } else if (schemeKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'government';
    } else if (brandingKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'branding';
    } else if (registrationKeywords.some(keyword => messageLower.includes(keyword))) {
      suggestedBot = 'registration';
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
    let aiResponse = aiData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response received from AI service');
    }

    // If we detected a specialist area and the AI didn't suggest connection, add the suggestion
    if (suggestedBot && !aiResponse.includes('Would you like me to connect')) {
      const botNames = {
        'legal': 'Legal Advisor',
        'financial': 'Financial Setup Expert',
        'government': 'Government Scheme Matcher',
        'branding': 'Branding & Marketing Expert',
        'registration': 'Registration Guide Guru'
      };
      
      aiResponse += `\n\nThis sounds like a ${suggestedBot} question. Would you like me to connect with our ${botNames[suggestedBot as keyof typeof botNames]} to get you detailed guidance?`;
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