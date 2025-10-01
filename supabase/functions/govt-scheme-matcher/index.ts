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
  funding_needed?: boolean;
  govt_scheme_interest?: boolean;
  team_size?: number;
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

const SYSTEM_PROMPT = `You are a Government Scheme Matching Expert specializing in startup funding and support programs. Your expertise includes:

- Government grants and subsidies for startups
- Startup India scheme and benefits
- MSME registration and schemes
- State-level startup policies and incentives
- Incubator and accelerator programs
- Tax benefits and exemptions
- Industry-specific government support
- Application processes and required documentation
- Eligibility criteria and timelines
- International startup programs (for global expansion)

Guidelines:
- Ask short, focused questions (one-liner preferred)
- Match schemes based on user's industry, location, and business stage
- Provide specific scheme names, eligibility criteria, and application links
- Include deadlines and required documents
- Mention both central and state government schemes
- Be encouraging about funding opportunities
- End conversations by asking: "Are you satisfied with the response?"
- Always verify current scheme status as policies change frequently`;

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
          session_type: 'govt_scheme',
          title: 'Government Scheme Matching Session'
        })
        .select()
        .single();
      currentSessionId = newSession?.id;
    }

    // Build context from user details
    let userContext = '';
    if (userDetails) {
      userContext = `User Context:
- Name: ${userDetails.full_name || 'Not provided'}
- Business: ${userDetails.business_name || 'Not provided'}
- Stage: ${userDetails.business_stage || 'idea'}
- Industry: ${userDetails.industry || 'Not specified'}
- Location: ${userDetails.location || 'Not specified'}
- Team Size: ${userDetails.team_size || 1}
- Funding Needed: ${userDetails.funding_needed ? 'Yes' : 'No'}
- Government Scheme Interest: ${userDetails.govt_scheme_interest ? 'Yes' : 'No'}

Focus on schemes relevant to their industry, location, and business stage.`;
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
        'X-Title': 'Startup Companion - Government Scheme Matcher'
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
        bot_type: 'govt_scheme_matcher',
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
    console.error('Government scheme matcher error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});