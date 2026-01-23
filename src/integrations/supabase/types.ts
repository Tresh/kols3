export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      campaign_enrollments: {
        Row: {
          campaign_id: string
          completed_at: string | null
          creator_id: string
          id: string
          joined_at: string | null
          status: string | null
          xp_earned: number | null
        }
        Insert: {
          campaign_id: string
          completed_at?: string | null
          creator_id: string
          id?: string
          joined_at?: string | null
          status?: string | null
          xp_earned?: number | null
        }
        Update: {
          campaign_id?: string
          completed_at?: string | null
          creator_id?: string
          id?: string
          joined_at?: string | null
          status?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_enrollments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: string | null
          campaign_type: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          status: string | null
          timeline_end: string | null
          timeline_start: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: string | null
          campaign_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id: string
          status?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: string | null
          campaign_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          status?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          continents: string[] | null
          country: string | null
          created_at: string | null
          deliverables: string[] | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          languages: string[] | null
          min_budget: string | null
          niches: string[] | null
          past_work: Json | null
          payment_methods: string[] | null
          preferred_chain: string | null
          preferred_project_types: string[] | null
          profile_completed: boolean | null
          short_bio: string | null
          social_platforms: Json | null
          tier: string | null
          timezone: string | null
          total_followers: number | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          continents?: string[] | null
          country?: string | null
          created_at?: string | null
          deliverables?: string[] | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          languages?: string[] | null
          min_budget?: string | null
          niches?: string[] | null
          past_work?: Json | null
          payment_methods?: string[] | null
          preferred_chain?: string | null
          preferred_project_types?: string[] | null
          profile_completed?: boolean | null
          short_bio?: string | null
          social_platforms?: Json | null
          tier?: string | null
          timezone?: string | null
          total_followers?: number | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          continents?: string[] | null
          country?: string | null
          created_at?: string | null
          deliverables?: string[] | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          languages?: string[] | null
          min_budget?: string | null
          niches?: string[] | null
          past_work?: Json | null
          payment_methods?: string[] | null
          preferred_chain?: string | null
          preferred_project_types?: string[] | null
          profile_completed?: boolean | null
          short_bio?: string | null
          social_platforms?: Json | null
          tier?: string | null
          timezone?: string | null
          total_followers?: number | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          budget: string | null
          campaign_description: string
          created_at: string | null
          creator_id: string
          deliverables: string[] | null
          id: string
          notes: string | null
          project_id: string
          status: string | null
          timeline_end: string | null
          timeline_start: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: string | null
          campaign_description: string
          created_at?: string | null
          creator_id: string
          deliverables?: string[] | null
          id?: string
          notes?: string | null
          project_id: string
          status?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: string | null
          campaign_description?: string
          created_at?: string | null
          creator_id?: string
          deliverables?: string[] | null
          id?: string
          notes?: string | null
          project_id?: string
          status?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
          xp?: number | null
        }
        Relationships: []
      }
      task_submissions: {
        Row: {
          id: string
          proof_link: string | null
          proof_text: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          task_id: string
          updated_at: string | null
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          id?: string
          proof_link?: string | null
          proof_text?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          task_id: string
          updated_at?: string | null
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          id?: string
          proof_link?: string | null
          proof_text?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
          xp_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          campaign_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          is_active: boolean | null
          proof_description: string | null
          requires_proof: boolean | null
          task_type: string | null
          title: string
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          assigned_to?: string | null
          campaign_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          proof_description?: string | null
          requires_proof?: boolean | null
          task_type?: string | null
          title: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          assigned_to?: string | null
          campaign_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          proof_description?: string | null
          requires_proof?: boolean | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          source_id: string | null
          source_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          source_id?: string | null
          source_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          source_id?: string | null
          source_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_xp: {
        Args: {
          _amount: number
          _description?: string
          _source_id?: string
          _source_type?: string
          _type: string
          _user_id: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "kol"
        | "ambassador"
        | "project"
        | "hirer"
        | "admin"
        | "creator"
        | "marketer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "kol",
        "ambassador",
        "project",
        "hirer",
        "admin",
        "creator",
        "marketer",
      ],
    },
  },
} as const
