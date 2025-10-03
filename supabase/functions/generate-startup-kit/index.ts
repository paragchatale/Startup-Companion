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
  team_size?: number;
  revenue_model?: string;
  funding_needed?: boolean;
  branding_status?: string;
  financial_status?: string;
  govt_scheme_interest?: boolean;
  legal_help_needed?: boolean;
}

interface RequestBody {
  userId: string;
  userDetails: UserDetails;
}

const STARTUP_KIT_PROMPT = `You are an expert startup consultant creating a comprehensive Startup Kit. Based on the user's profile, generate a detailed, actionable business plan covering all essential areas.

Structure the response as a complete startup guide with these sections:

# [Business Name] - Comprehensive Startup Kit

## Executive Summary
- Business overview and mission
- Key value proposition
- Target market summary
- Financial projections overview

## Legal Foundation
- Recommended business entity type and why
- Registration requirements and process
- Intellectual property considerations
- Key legal documents needed
- Compliance requirements

## Financial Framework
- Startup costs breakdown
- Revenue model analysis
- Funding requirements and sources
- Banking and accounting setup
- Tax considerations and GST registration

## Government Support & Schemes
- Relevant government schemes and grants
- Eligibility criteria and application process
- Startup India benefits
- State-specific incentives

## Branding & Marketing Strategy
- Brand positioning and identity
- Target audience analysis
- Marketing channels and tactics
- Digital presence strategy
- Go-to-market plan

## Operational Roadmap
- 90-day action plan
- Key milestones and timelines
- Team building strategy
- Technology and infrastructure needs

## Risk Assessment & Mitigation
- Potential challenges and solutions
- Market risks and competitive analysis
- Financial risk management

## Next Steps & Resources
- Immediate action items
- Useful resources and contacts
- Professional services recommendations

Make it comprehensive, actionable, and tailored to their specific business and location.`;

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

    const { userId, userDetails }: RequestBody = await req.json();

    // Build comprehensive user context
    const userContext = `User Profile for Startup Kit Generation:
- Name: ${userDetails.full_name || 'Entrepreneur'}
- Business Name: ${userDetails.business_name || 'New Startup'}
- Business Stage: ${userDetails.business_stage || 'idea'}
- Industry: ${userDetails.industry || 'Technology'}
- Location: ${userDetails.location || 'India'}
- Team Size: ${userDetails.team_size || 1}
- Registered: ${userDetails.registered ? 'Yes' : 'No'}
- Entity Type: ${userDetails.entity_type || 'To be determined'}
- Revenue Model: ${userDetails.revenue_model || 'To be defined'}
- Funding Needed: ${userDetails.funding_needed ? 'Yes' : 'No'}
- Legal Help Needed: ${userDetails.legal_help_needed ? 'Yes' : 'No'}
- Government Scheme Interest: ${userDetails.govt_scheme_interest ? 'Yes' : 'No'}
- Branding Status: ${userDetails.branding_status || 'Not started'}
- Financial Status: ${userDetails.financial_status || 'Planning stage'}

Create a comprehensive, personalized startup kit based on this information.`;

    // Call OpenRouter API for startup kit generation
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://startup-companion.com',
        'X-Title': 'Startup Companion - Startup Kit Generator'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: STARTUP_KIT_PROMPT },
          { role: 'user', content: userContext }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error('Failed to generate startup kit content');
    }

    const aiData = await openRouterResponse.json();
    const startupKitContent = aiData.choices?.[0]?.message?.content;

    if (!startupKitContent) {
      throw new Error('No startup kit content received');
    }

    // Generate HTML content for PDF
    const htmlContent = generateStartupKitHTML(
      userDetails.business_name || 'Your Startup',
      startupKitContent,
      userDetails.full_name || 'Entrepreneur'
    );

    // Save to storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${userDetails.business_name || 'Startup'}-Kit-${timestamp}.html`;
    const filePath = `${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ai-response-docs')
      .upload(filePath, new Blob([htmlContent], { type: 'text/html' }), {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Failed to save startup kit: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('ai-response-docs')
      .getPublicUrl(filePath);

    // Create session and save response record
    const { data: newSession } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        session_type: 'startup_kit',
        title: `${userDetails.business_name || 'Startup'} Kit Generation`
      })
      .select()
      .single();

    // Store the startup kit response
    const { data: responseRecord } = await supabase
      .from('ai_responses')
      .insert({
        user_id: userId,
        session_id: newSession?.id,
        bot_type: 'startup_kit',
        user_message: 'Generate comprehensive startup kit',
        ai_response: startupKitContent,
        pdf_generated: true,
        pdf_url: urlData.publicUrl,
        is_satisfied: true
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({
        success: true,
        kitUrl: urlData.publicUrl,
        fileName: fileName,
        message: 'Startup Kit generated successfully',
        responseId: responseRecord?.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Startup kit generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate startup kit' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateStartupKitHTML(businessName: string, content: string, userName: string): string {
  const currentDate = new Date().toLocaleDateString();
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${businessName} - Startup Kit</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 30px;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            border-radius: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0;
            font-size: 1.2em;
            opacity: 0.9;
        }
        .content {
            background: #f8fafc;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .content h1, .content h2, .content h3 {
            color: #1e40af;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .content h1 {
            font-size: 2em;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
        }
        .content h2 {
            font-size: 1.5em;
            color: #2563eb;
        }
        .content h3 {
            font-size: 1.2em;
            color: #3b82f6;
        }
        .content ul, .content ol {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .content li {
            margin-bottom: 8px;
        }
        .highlight {
            background-color: #dbeafe;
            padding: 15px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            color: #666;
        }
        .footer p {
            margin: 5px 0;
        }
        .kit-badge {
            display: inline-block;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${businessName}</h1>
        <p>Comprehensive Startup Kit</p>
        <div class="kit-badge">Generated by Start-up Companion</div>
        <p>Prepared for: ${userName}</p>
        <p>Generated on: ${currentDate}</p>
    </div>

    <div class="content">
        ${content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h2>').replace(/<h2>/g, '</p><h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
    </div>

    <div class="footer">
        <p><strong>This comprehensive startup kit was generated by Start-up Companion AI</strong></p>
        <p>Your AI-powered business advisory platform</p>
        <p><em>Disclaimer: This kit provides general guidance. Please consult with qualified professionals for specific legal, financial, and business decisions.</em></p>
        <p>© 2025 Start-up Companion. All rights reserved.</p>
    </div>
</body>
</html>`;
}