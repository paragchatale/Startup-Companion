import { supabase } from './supabase';

// User Details Management
export interface UserDetails {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  business_stage?: 'idea' | 'early' | 'growth';
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
  profile_picture_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const getUserDetails = async (userId: string): Promise<UserDetails | null> => {
  const { data, error } = await supabase
    .from('user_details')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user details:', error);
    return null;
  }

  return data;
};

export const upsertUserDetails = async (userDetails: Partial<UserDetails>): Promise<boolean> => {
  const { error } = await supabase
    .from('user_details')
    .upsert(userDetails, { onConflict: 'id' });

  if (error) {
    console.error('Error upserting user details:', error);
    return false;
  }

  return true;
};

// Profile Picture Management
export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('user-profile-pictures')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Error uploading profile picture:', uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('user-profile-pictures')
    .getPublicUrl(filePath);

  // Update user details with new profile picture URL
  await supabase
    .from('user_details')
    .upsert({ id: userId, profile_picture_url: urlData.publicUrl }, { onConflict: 'id' });

  return urlData.publicUrl;
};

// Business Documents Management
export interface BizDocument {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
}

export const uploadBizDocument = async (userId: string, file: File): Promise<BizDocument | null> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${timestamp}_${file.name}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('biz-documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading business document:', uploadError);
    return null;
  }

  // Save metadata to database
  const { data, error: dbError } = await supabase
    .from('biz_documents')
    .insert({
      user_id: userId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type
    })
    .select()
    .single();

  if (dbError) {
    console.error('Error saving document metadata:', dbError);
    return null;
  }

  return data;
};

export const getBizDocuments = async (userId: string): Promise<BizDocument[]> => {
  const { data, error } = await supabase
    .from('biz_documents')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching business documents:', error);
    return [];
  }

  return data || [];
};

export const deleteBizDocument = async (documentId: string, filePath: string): Promise<boolean> => {
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('biz-documents')
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting from storage:', storageError);
    return false;
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('biz_documents')
    .delete()
    .eq('id', documentId);

  if (dbError) {
    console.error('Error deleting from database:', dbError);
    return false;
  }

  return true;
};

// AI Response Documents Management
export interface AIResponseDoc {
  id: string;
  user_id: string;
  session_id: string;
  bot_type: string;
  user_message: string;
  ai_response: string;
  is_satisfied: boolean;
  pdf_generated: boolean;
  pdf_url?: string;
  created_at: string;
}

export const getAIResponseDocs = async (userId: string): Promise<AIResponseDoc[]> => {
  const { data, error } = await supabase
    .from('ai_responses')
    .select('*')
    .eq('user_id', userId)
    .eq('pdf_generated', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching AI response documents:', error);
    return [];
  }

  return data || [];
};

export const generatePDFFromResponse = async (responseId: string, title?: string): Promise<string | null> => {
  const { data, error } = await supabase.functions.invoke('generate-pdf-response', {
    body: { responseId, title }
  });

  if (error) {
    console.error('Error generating PDF:', error);
    return null;
  }

  return data?.pdfUrl || null;
};

// Chat Bot Functions
export const callLegalAdvisorBot = async (message: string, sessionId?: string, chatHistory?: any[]) => {
  const { data, error } = await supabase.functions.invoke('legal-advisor-bot', {
    body: { message, sessionId, chatHistory }
  });

  if (error) {
    console.error('Error calling legal advisor bot:', error);
    throw error;
  }

  return data;
};

export const callGovtSchemeMatcherBot = async (message: string, sessionId?: string, chatHistory?: any[]) => {
  const { data, error } = await supabase.functions.invoke('govt-scheme-matcher', {
    body: { message, sessionId, chatHistory }
  });

  if (error) {
    console.error('Error calling government scheme matcher bot:', error);
    throw error;
  }

  return data;
};

export const callFinancialSetupBot = async (message: string, sessionId?: string, chatHistory?: any[]) => {
  const { data, error } = await supabase.functions.invoke('financial-setup-bot', {
    body: { message, sessionId, chatHistory }
  });

  if (error) {
    console.error('Error calling financial setup bot:', error);
    throw error;
  }

  return data;
};

export const callBrandingMarketingBot = async (message: string, sessionId?: string, chatHistory?: any[]) => {
  const { data, error } = await supabase.functions.invoke('branding-marketing-bot', {
    body: { message, sessionId, chatHistory }
  });

  if (error) {
    console.error('Error calling branding marketing bot:', error);
    throw error;
  }

  return data;
};

export const callRegistrationGuideGuruBot = async (message: string, sessionId?: string, chatHistory?: any[]) => {
  const { data, error } = await supabase.functions.invoke('registration-guide-guru-bot', {
    body: { message, sessionId, chatHistory }
  });

  if (error) {
    console.error('Error calling registration guide guru bot:', error);
    throw error;
  }

  return data;
};

export const callMainDashboardBot = async (message: string, sessionId?: string, chatHistory?: any[], userDetails?: UserDetails) => {
  const { data, error } = await supabase.functions.invoke('main-dashboard-bot', {
    body: { message, sessionId, chatHistory, userDetails }
  });

  if (error) {
    console.error('Error calling main dashboard bot:', error);
    throw error;
  }

  return data;
};

// Generate comprehensive startup kit
export const generateStartupKit = async (userId: string, userDetails: UserDetails): Promise<{ success: boolean; kitUrl?: string }> => {
  const { data, error } = await supabase.functions.invoke('generate-startup-kit', {
    body: { userId, userDetails }
  });

  if (error) {
    console.error('Error generating startup kit:', error);
    throw error;
  }

  return data;
};

// Download file from storage
export const downloadFile = async (bucket: string, filePath: string): Promise<Blob | null> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }

  return data;
};

// Get public URL for file
export const getFileUrl = (bucket: string, filePath: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};