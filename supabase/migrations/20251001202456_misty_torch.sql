/*
  # Start-up Companion Database Schema

  1. New Tables
    - `user_details`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `business_name` (text)
      - `business_stage` (enum: idea, early, growth)
      - `industry` (text)
      - `location` (text)
      - `registered` (boolean)
      - `entity_type` (text)
      - `team_size` (integer)
      - `revenue_model` (text)
      - `funding_needed` (boolean)
      - `branding_status` (text)
      - `financial_status` (text)
      - `govt_scheme_interest` (boolean)
      - `legal_help_needed` (boolean)
      - `profile_picture_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `chat_sessions`
      - Session tracking for AI conversations

    - `ai_responses`
      - Store AI responses for PDF generation

  2. Storage Buckets
    - user-profile-pictures
    - biz-documents  
    - ai-response-docs

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create enum for business stage
CREATE TYPE business_stage_enum AS ENUM ('idea', 'early', 'growth');

-- Create user_details table
CREATE TABLE IF NOT EXISTS user_details (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  business_name text,
  business_stage business_stage_enum DEFAULT 'idea',
  industry text,
  location text,
  registered boolean DEFAULT false,
  entity_type text,
  team_size integer DEFAULT 1,
  revenue_model text,
  funding_needed boolean DEFAULT false,
  branding_status text,
  financial_status text,
  govt_scheme_interest boolean DEFAULT false,
  legal_help_needed boolean DEFAULT false,
  profile_picture_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text NOT NULL, -- 'legal', 'financial', 'branding', 'govt_scheme', 'main_dashboard'
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_responses table
CREATE TABLE IF NOT EXISTS ai_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  bot_type text NOT NULL,
  user_message text NOT NULL,
  ai_response text NOT NULL,
  is_satisfied boolean DEFAULT false,
  pdf_generated boolean DEFAULT false,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- Create biz_documents table for metadata
CREATE TABLE IF NOT EXISTS biz_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE biz_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_details
CREATE POLICY "Users can read own details"
  ON user_details
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own details"
  ON user_details
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own details"
  ON user_details
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for chat_sessions
CREATE POLICY "Users can read own chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_responses
CREATE POLICY "Users can read own ai responses"
  ON ai_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai responses"
  ON ai_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai responses"
  ON ai_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for biz_documents
CREATE POLICY "Users can read own documents"
  ON biz_documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON biz_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON biz_documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON biz_documents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('user-profile-pictures', 'user-profile-pictures', true),
  ('biz-documents', 'biz-documents', false),
  ('ai-response-docs', 'ai-response-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user-profile-pictures
CREATE POLICY "Users can upload own profile pictures"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'user-profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own profile pictures"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'user-profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own profile pictures"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'user-profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own profile pictures"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'user-profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for biz-documents
CREATE POLICY "Users can upload own biz documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'biz-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own biz documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'biz-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own biz documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'biz-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for ai-response-docs
CREATE POLICY "Users can upload own ai response docs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'ai-response-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own ai response docs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'ai-response-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own ai response docs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'ai-response-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_details_updated_at
  BEFORE UPDATE ON user_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();