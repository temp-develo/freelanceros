/*
  # Create proposal share links and email tracking tables

  1. New Tables
    - `proposal_share_links`
      - `id` (uuid, primary key)
      - `token` (text, unique)
      - `proposal_id` (uuid, references proposals)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)
      - `last_accessed_at` (timestamp)
      - `access_count` (integer)
    
    - `proposal_emails`
      - `id` (uuid, primary key)
      - `proposal_id` (uuid, references proposals)
      - `recipient_email` (text)
      - `subject` (text)
      - `tracking_token` (text, unique)
      - `sent_at` (timestamp)
      - `opened_at` (timestamp)
      - `click_count` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own share links and email tracking
*/

-- Create proposal_share_links table
CREATE TABLE IF NOT EXISTS proposal_share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_accessed_at timestamptz,
  access_count integer NOT NULL DEFAULT 0
);

-- Create proposal_emails table
CREATE TABLE IF NOT EXISTS proposal_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  tracking_token text UNIQUE NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  opened_at timestamptz,
  click_count integer NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE proposal_share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for proposal_share_links
-- Users can view their own share links
CREATE POLICY "Users can view their own share links"
  ON proposal_share_links
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- Users can create share links for their own proposals
CREATE POLICY "Users can create share links for their own proposals"
  ON proposal_share_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_share_links.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can update their own share links
CREATE POLICY "Users can update their own share links"
  ON proposal_share_links
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Users can delete their own share links
CREATE POLICY "Users can delete their own share links"
  ON proposal_share_links
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create policies for proposal_emails
-- Users can view email tracking for their own proposals
CREATE POLICY "Users can view email tracking for their own proposals"
  ON proposal_emails
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_emails.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can create email tracking for their own proposals
CREATE POLICY "Users can create email tracking for their own proposals"
  ON proposal_emails
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_emails.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can update email tracking for their own proposals
CREATE POLICY "Users can update email tracking for their own proposals"
  ON proposal_emails
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_emails.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS proposal_share_links_token_idx ON proposal_share_links(token);
CREATE INDEX IF NOT EXISTS proposal_share_links_proposal_id_idx ON proposal_share_links(proposal_id);
CREATE INDEX IF NOT EXISTS proposal_share_links_created_by_idx ON proposal_share_links(created_by);
CREATE INDEX IF NOT EXISTS proposal_emails_proposal_id_idx ON proposal_emails(proposal_id);
CREATE INDEX IF NOT EXISTS proposal_emails_tracking_token_idx ON proposal_emails(tracking_token);

-- Create function to update access_count and last_accessed_at
CREATE OR REPLACE FUNCTION update_share_link_access()
RETURNS TRIGGER AS $$
BEGIN
  NEW.access_count = NEW.access_count + 1;
  NEW.last_accessed_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating access stats
CREATE TRIGGER update_share_link_access_trigger
BEFORE UPDATE ON proposal_share_links
FOR EACH ROW
WHEN (NEW.access_count IS NOT DISTINCT FROM OLD.access_count)
EXECUTE FUNCTION update_share_link_access();