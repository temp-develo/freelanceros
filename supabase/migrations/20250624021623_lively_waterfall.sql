/*
  # Create proposals table and related tables

  1. New Tables
    - `proposals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `client_id` (uuid, references clients)
      - `title` (text)
      - `description` (text)
      - `status` (text, default 'draft')
      - `amount` (decimal)
      - `currency` (text, default 'USD')
      - `valid_until` (timestamp)
      - `sent_at` (timestamp)
      - `viewed_at` (timestamp)
      - `responded_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `proposal_sections`
      - `id` (uuid, primary key)
      - `proposal_id` (uuid, references proposals)
      - `title` (text)
      - `content` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `proposal_items`
      - `id` (uuid, primary key)
      - `proposal_id` (uuid, references proposals)
      - `description` (text)
      - `quantity` (decimal)
      - `unit_price` (decimal)
      - `amount` (decimal)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own proposals
    - Add policies for clients to view proposals shared with them
*/

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  amount decimal(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  valid_until timestamptz,
  sent_at timestamptz,
  viewed_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create proposal_sections table
CREATE TABLE IF NOT EXISTS proposal_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create proposal_items table
CREATE TABLE IF NOT EXISTS proposal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  unit_price decimal(12,2) NOT NULL DEFAULT 0,
  amount decimal(12,2) NOT NULL DEFAULT 0,
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_items ENABLE ROW LEVEL SECURITY;

-- Create policies for proposals
-- Users can view their own proposals
CREATE POLICY "Users can view their own proposals"
  ON proposals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own proposals
CREATE POLICY "Users can create their own proposals"
  ON proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own proposals
CREATE POLICY "Users can update their own proposals"
  ON proposals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own proposals
CREATE POLICY "Users can delete their own proposals"
  ON proposals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for proposal_sections
-- Users can view sections of their own proposals
CREATE POLICY "Users can view sections of their own proposals"
  ON proposal_sections
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_sections.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can create sections for their own proposals
CREATE POLICY "Users can create sections for their own proposals"
  ON proposal_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_sections.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can update sections of their own proposals
CREATE POLICY "Users can update sections of their own proposals"
  ON proposal_sections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_sections.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can delete sections of their own proposals
CREATE POLICY "Users can delete sections of their own proposals"
  ON proposal_sections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_sections.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Create policies for proposal_items
-- Users can view items of their own proposals
CREATE POLICY "Users can view items of their own proposals"
  ON proposal_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_items.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can create items for their own proposals
CREATE POLICY "Users can create items for their own proposals"
  ON proposal_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_items.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can update items of their own proposals
CREATE POLICY "Users can update items of their own proposals"
  ON proposal_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_items.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Users can delete items of their own proposals
CREATE POLICY "Users can delete items of their own proposals"
  ON proposal_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proposals
      WHERE proposals.id = proposal_items.proposal_id
      AND proposals.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposal_sections_updated_at
BEFORE UPDATE ON proposal_sections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposal_items_updated_at
BEFORE UPDATE ON proposal_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS proposals_user_id_idx ON proposals(user_id);
CREATE INDEX IF NOT EXISTS proposals_client_id_idx ON proposals(client_id);
CREATE INDEX IF NOT EXISTS proposals_status_idx ON proposals(status);
CREATE INDEX IF NOT EXISTS proposal_sections_proposal_id_idx ON proposal_sections(proposal_id);
CREATE INDEX IF NOT EXISTS proposal_items_proposal_id_idx ON proposal_items(proposal_id);