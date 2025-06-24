-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create proposal_emails table with expanded fields
CREATE TABLE IF NOT EXISTS proposal_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  cc_email text,
  subject text NOT NULL,
  message text NOT NULL,
  tracking_token text UNIQUE,
  click_tracking_token text UNIQUE,
  share_token text REFERENCES proposal_share_links(token) ON DELETE SET NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  opened_at timestamptz,
  click_count integer NOT NULL DEFAULT 0,
  include_attachment boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'failed'))
);

-- Enable Row Level Security
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for email_templates
-- Users can view their own templates
CREATE POLICY "Users can view their own templates"
  ON email_templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own templates
CREATE POLICY "Users can create their own templates"
  ON email_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own templates
CREATE POLICY "Users can update their own templates"
  ON email_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own templates
CREATE POLICY "Users can delete their own templates"
  ON email_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_email_template_updated_at
BEFORE UPDATE ON email_templates
FOR EACH ROW
EXECUTE FUNCTION update_email_template_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS email_templates_user_id_idx ON email_templates(user_id);
CREATE INDEX IF NOT EXISTS email_templates_is_default_idx ON email_templates(is_default);
CREATE INDEX IF NOT EXISTS proposal_emails_proposal_id_idx ON proposal_emails(proposal_id);
CREATE INDEX IF NOT EXISTS proposal_emails_tracking_token_idx ON proposal_emails(tracking_token);
CREATE INDEX IF NOT EXISTS proposal_emails_click_tracking_token_idx ON proposal_emails(click_tracking_token);
CREATE INDEX IF NOT EXISTS proposal_emails_share_token_idx ON proposal_emails(share_token);

-- Create function to ensure only one default template per user
CREATE OR REPLACE FUNCTION ensure_single_default_template()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE email_templates
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default template management
CREATE TRIGGER ensure_single_default_template_trigger
BEFORE INSERT OR UPDATE ON email_templates
FOR EACH ROW
WHEN (NEW.is_default = true)
EXECUTE FUNCTION ensure_single_default_template();

-- Create function to increment a counter
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql;