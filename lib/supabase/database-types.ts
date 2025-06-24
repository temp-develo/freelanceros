// Generated Supabase database types
// This file should be generated using: npx supabase gen types typescript --local

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          hourly_rate: number | null
          currency: string
          skills: string[]
          availability_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          hourly_rate?: number | null
          currency?: string
          skills?: string[]
          availability_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          hourly_rate?: number | null
          currency?: string
          skills?: string[]
          availability_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          company: string | null
          phone: string | null
          address: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          company?: string | null
          phone?: string | null
          address?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          company?: string | null
          phone?: string | null
          address?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          client_id: string
          name: string
          description: string | null
          status: string
          priority: string
          start_date: string
          end_date: string | null
          budget: number | null
          hourly_rate: number | null
          total_hours: number | null
          completed_hours: number | null
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          name: string
          description?: string | null
          status?: string
          priority?: string
          start_date: string
          end_date?: string | null
          budget?: number | null
          hourly_rate?: number | null
          total_hours?: number | null
          completed_hours?: number | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          name?: string
          description?: string | null
          status?: string
          priority?: string
          start_date?: string
          end_date?: string | null
          budget?: number | null
          hourly_rate?: number | null
          total_hours?: number | null
          completed_hours?: number | null
          progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          user_id: string
          client_id: string
          title: string
          description: string | null
          status: string
          amount: number
          currency: string
          valid_until: string | null
          sent_at: string | null
          viewed_at: string | null
          responded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          title: string
          description?: string | null
          status?: string
          amount?: number
          currency?: string
          valid_until?: string | null
          sent_at?: string | null
          viewed_at?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: string
          amount?: number
          currency?: string
          valid_until?: string | null
          sent_at?: string | null
          viewed_at?: string | null
          responded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proposal_sections: {
        Row: {
          id: string
          proposal_id: string
          title: string
          content: string | null
          order_position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          title: string
          content?: string | null
          order_position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          title?: string
          content?: string | null
          order_position?: number
          created_at?: string
          updated_at?: string
        }
      }
      proposal_items: {
        Row: {
          id: string
          proposal_id: string
          description: string
          quantity: number
          unit_price: number
          amount: number
          order_position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          description: string
          quantity?: number
          unit_price?: number
          amount?: number
          order_position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          amount?: number
          order_position?: number
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          client_id: string
          project_id: string | null
          invoice_number: string
          status: string
          amount: number
          currency: string
          due_date: string
          sent_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          project_id?: string | null
          invoice_number: string
          status?: string
          amount: number
          currency?: string
          due_date: string
          sent_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          project_id?: string | null
          invoice_number?: string
          status?: string
          amount?: number
          currency?: string
          due_date?: string
          sent_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          user_id: string
          project_id: string
          description: string
          start_time: string
          end_time: string | null
          duration: number
          hourly_rate: number | null
          billable: boolean
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          description: string
          start_time: string
          end_time?: string | null
          duration: number
          hourly_rate?: number | null
          billable?: boolean
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          description?: string
          start_time?: string
          end_time?: string | null
          duration?: number
          hourly_rate?: number | null
          billable?: boolean
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          due_date: string | null
          status: string
          priority: string
          progress: number
          estimated_hours: number | null
          completed_hours: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: string
          priority?: string
          progress?: number
          estimated_hours?: number | null
          completed_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: string
          priority?: string
          progress?: number
          estimated_hours?: number | null
          completed_hours?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          status: string
          priority: string
          due_date: string | null
          estimated_hours: number | null
          completed_hours: number | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          estimated_hours?: number | null
          completed_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          estimated_hours?: number | null
          completed_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}