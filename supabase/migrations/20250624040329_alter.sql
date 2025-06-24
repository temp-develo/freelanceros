-- Add missing columns to proposal_emails table
ALTER TABLE proposal_emails
ADD COLUMN cc_email text,
ADD COLUMN message text NOT NULL DEFAULT '', -- Add a default for existing rows
ADD COLUMN click_tracking_token text UNIQUE,
ADD COLUMN share_token text REFERENCES proposal_share_links(token) ON DELETE SET NULL,
ADD COLUMN include_attachment boolean NOT NULL DEFAULT true,
ADD COLUMN status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'failed'));

-- Re-create policies for proposal_emails
-- Drop existing policies if they exist to ensure clean re-creation
DROP POLICY IF EXISTS "Users can view email tracking for their own proposals" ON proposal_emails;
DROP POLICY IF EXISTS "Users can create email tracking for their own proposals" ON proposal_emails;
DROP POLICY IF EXISTS "Users can update email tracking for their own proposals" ON proposal_emails;

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

-- Re-create indexes for better performance (if they failed to apply)
CREATE INDEX IF NOT EXISTS proposal_emails_proposal_id_idx ON proposal_emails(proposal_id);
CREATE INDEX IF NOT EXISTS proposal_emails_tracking_token_idx ON proposal_emails(tracking_token);
CREATE INDEX IF NOT EXISTS proposal_emails_click_tracking_token_idx ON proposal_emails(click_tracking_token);
CREATE INDEX IF NOT EXISTS proposal_emails_share_token_idx ON proposal_emails(share_token);
