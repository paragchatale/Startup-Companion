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
  legal_help_needed?: boolean;
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

const SYSTEM_PROMPT = `You are the "Registration Guide Guru", a specialized assistant for company registration and legal entity formation in India. Your expertise includes:

**Core Services:**
1. **Name Registration:** Help choose unique, regulation-compliant company names and check for conflicts
2. **Entity Guidance:** Advise on best entity type (LLP, Partnership, Private Limited, Proprietary, etc.) based on business model
3. **Legal Compliance:** Guide through mandatory registration steps and legal requirements
4. **Document Preparation:** Assist with MOA, AOA, and other required documents with official links
5. **Certifications:** Help acquire DSC (Digital Signature Certificate) and DIN (Director Identification Number)
6. **Brand Protection:** Advise on securing company name and brand under intellectual property laws

**Key Guidelines:**
- Always gather user details from user_details table before providing advice
- Tailor all recommendations to user's specific business type, location, and requirements
- Ask only questions relevant to registration needs (avoid requesting already-provided details)
- Provide step-by-step guidance with official government links
- Upon user consent, generate comprehensive PDF documents with checklists and links
- Focus on actionable advice rather than generic overviews
- Ensure all advice complies with current Indian company registration laws

**Document Generation:**
When user requests documentation help, offer to create a comprehensive PDF guide including:
- Entity type recommendations with pros/cons
- Required documents checklist
- Step-by-step registration process
- Official government links and forms
- Timeline and fee structure
- Compliance requirements

**Response Style:**
- Be precise and actionable
- Provide personalized recommendations
- Include official links where relevant
- Ask for consent before generating PDFs
- End conversations naturally by asking: "Are you satisfied with the response?"`;

// Generate PDF content for registration documents
const generateRegistrationPDF = (userDetails: UserDetails, registrationContent: string) => {
  const currentDate = new Date().toLocaleDateString();
  const businessName = userDetails.business_name || 'Your Business';
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${businessName} - Company Registration Guide</title>
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
            border-bottom: 3px solid #4f46e5;
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
            color: #4338ca;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .content h1 {
            font-size: 2em;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 10px;
        }
        .content h2 {
            font-size: 1.5em;
            color: #5b21b6;
        }
        .content h3 {
            font-size: 1.2em;
            color: #4f46e5;
        }
        .content ul, .content ol {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .content li {
            margin-bottom: 8px;
        }
        .highlight {
            background-color: #e0e7ff;
            padding: 15px;
            border-left: 4px solid #4f46e5;
            margin: 20px 0;
            border-radius: 5px;
        }
        .link-box {
            background-color: #dbeafe;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            border: 1px solid #93c5fd;
        }
        .link-box a {
            color: #1d4ed8;
            text-decoration: none;
            font-weight: bold;
        }
        .link-box a:hover {
            text-decoration: underline;
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
        .guru-badge {
            display: inline-block;
            background: linear-gradient(45deg, #4f46e5, #06b6d4);
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
        <h1>Company Registration Guide</h1>
        <p>Complete Registration Roadmap for ${businessName}</p>
        <div class="guru-badge">Registration Guide Guru</div>
        <p>Prepared for: ${userDetails.full_name || 'Business Owner'}</p>
        <p>Generated on: ${currentDate}</p>
    </div>

    <div class="content">
        ${registrationContent.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h2>').replace(/<h2>/g, '</p><h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        
        <div class="highlight">
            <h3>🔗 Essential Government Links</h3>
            <div class="link-box">
                <strong>Ministry of Corporate Affairs (MCA):</strong><br>
                <a href="https://www.mca.gov.in/" target="_blank">https://www.mca.gov.in/</a><br>
                <em>Main portal for company registration and compliance</em>
            </div>
            
            <div class="link-box">
                <strong>SPICe+ Form (Company Incorporation):</strong><br>
                <a href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/spice-plus.html" target="_blank">SPICe+ Application Form</a><br>
                <em>Single form for company incorporation, PAN, TAN, EPFO, ESIC, and bank account</em>
            </div>
            
            <div class="link-box">
                <strong>Digital Signature Certificate (DSC):</strong><br>
                <a href="https://www.mca.gov.in/content/mca/global/en/data-and-reports/reports/corporate-affairs/dsc.html" target="_blank">DSC Information & Authorized Agencies</a><br>
                <em>Required for online filing of documents</em>
            </div>
            
            <div class="link-box">
                <strong>Director Identification Number (DIN):</strong><br>
                <a href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/din.html" target="_blank">DIN Application Process</a><br>
                <em>Unique identification for company directors</em>
            </div>
            
            <div class="link-box">
                <strong>Name Availability Check:</strong><br>
                <a href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/company-llp-master-data.html" target="_blank">Company/LLP Master Data</a><br>
                <em>Check availability of proposed company names</em>
            </div>
            
            <div class="link-box">
                <strong>Trademark Registration:</strong><br>
                <a href="https://ipindia.gov.in/trademark.htm" target="_blank">https://ipindia.gov.in/trademark.htm</a><br>
                <em>Protect your brand and company name</em>
            </div>
        </div>
    </div>

    <div class="footer">
        <p><strong>This registration guide was generated by Registration Guide Guru</strong></p>
        <p>Your AI-powered company registration assistant</p>
        <p><em>Disclaimer: This guide provides general information. Please consult with qualified professionals and verify current regulations before proceeding with registration.</em></p>
        <p>© 2025 Start-up Companion. All rights reserved.</p>
    </div>
</body>
</html>`;
};

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
          session_type: 'registration_guide',
          title: 'Company Registration Session'
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
- Currently Registered: ${userDetails.registered ? 'Yes' : 'No'}
- Preferred Entity Type: ${userDetails.entity_type || 'Not decided'}
- Team Size: ${userDetails.team_size || 1}
- Revenue Model: ${userDetails.revenue_model || 'Not defined'}
- Legal Help Needed: ${userDetails.legal_help_needed ? 'Yes' : 'No'}

Provide registration guidance tailored to their specific business needs and current status.`;
    }

    // Check if user is asking for document generation
    const messageLower = message.toLowerCase();
    const documentKeywords = ['pdf', 'document', 'guide', 'checklist', 'download', 'generate', 'create document'];
    const wantsDocument = documentKeywords.some(keyword => messageLower.includes(keyword));

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
        'X-Title': 'Startup Companion - Registration Guide Guru'
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

    // Generate PDF if user requested documentation
    let pdfUrl = null;
    if (wantsDocument && userDetails) {
      try {
        // Generate comprehensive registration guide content
        const registrationGuideContent = `
# Company Registration Guide for ${userDetails.business_name || 'Your Business'}

## Recommended Entity Type
Based on your business profile, here are the most suitable entity types:

### For ${userDetails.industry || 'your industry'} business:
- **Private Limited Company**: Best for growth-oriented businesses seeking investment
- **LLP (Limited Liability Partnership)**: Ideal for professional services and partnerships
- **Proprietorship**: Simple structure for solo entrepreneurs
- **Partnership**: Suitable for multiple founders without external investment

## Required Documents Checklist

### For Directors/Partners:
- [ ] PAN Card copies
- [ ] Aadhaar Card copies  
- [ ] Passport size photographs
- [ ] Address proof (utility bills, bank statements)
- [ ] Identity proof

### For Company Registration:
- [ ] Digital Signature Certificate (DSC)
- [ ] Director Identification Number (DIN)
- [ ] Memorandum of Association (MOA)
- [ ] Articles of Association (AOA)
- [ ] Registered office address proof

## Step-by-Step Registration Process

### Step 1: Name Reservation
1. Check name availability on MCA portal
2. Apply for name reservation (RUN form)
3. Wait for approval (typically 1-2 days)

### Step 2: Obtain DSC and DIN
1. Apply for Digital Signature Certificate from authorized agencies
2. File DIN application for all directors
3. Processing time: 3-5 working days

### Step 3: File Incorporation Documents
1. Prepare MOA and AOA
2. File SPICe+ form online
3. Pay required fees
4. Submit all documents digitally

### Step 4: Receive Certificate
1. Certificate of Incorporation issued
2. PAN and TAN allotted automatically
3. Company officially registered

## Estimated Timeline and Costs

### Timeline: 15-20 working days
### Estimated Costs:
- Government fees: ₹4,000 - ₹8,000
- Professional fees: ₹5,000 - ₹15,000
- DSC and DIN: ₹2,000 - ₹3,000

## Post-Registration Compliance
- Open bank account within 30 days
- File commencement of business (if applicable)
- Maintain statutory registers
- File annual returns and financial statements

## Brand Protection
- Apply for trademark registration
- Consider domain name registration
- Protect intellectual property rights
`;

        const htmlContent = generateRegistrationPDF(userDetails, registrationGuideContent);
        
        // Save to storage
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${userDetails.business_name || 'Company'}-Registration-Guide-${timestamp}.html`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ai-response-docs')
          .upload(filePath, new Blob([htmlContent], { type: 'text/html' }), {
            contentType: 'text/html',
            upsert: true
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('ai-response-docs')
            .getPublicUrl(filePath);
          
          pdfUrl = urlData.publicUrl;
          
          // Add PDF generation info to response
          aiResponse += `\n\n📋 **Registration Guide Generated!**\n\nI've created a comprehensive company registration guide tailored for your business. The document includes:\n\n• Entity type recommendations\n• Complete documents checklist\n• Step-by-step registration process\n• Official government links and forms\n• Timeline and cost estimates\n• Post-registration compliance requirements\n\nYou can find this guide in your AI Response Documents section.`;
        }
      } catch (error) {
        console.error('Error generating registration PDF:', error);
      }
    }

    // Store the AI response
    const { data: responseRecord } = await supabase
      .from('ai_responses')
      .insert({
        user_id: user.id,
        session_id: currentSessionId,
        bot_type: 'registration_guide_guru',
        user_message: message,
        ai_response: aiResponse,
        pdf_generated: !!pdfUrl,
        pdf_url: pdfUrl
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({
        response: aiResponse,
        sessionId: currentSessionId,
        responseId: responseRecord?.id,
        pdfGenerated: !!pdfUrl
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Registration guide guru bot error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});