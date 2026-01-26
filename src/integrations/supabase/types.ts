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
      campaign_participants: {
        Row: {
          campaign_id: string
          completed_at: string | null
          id: string
          joined_at: string
          status: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          completed_at?: string | null
          id?: string
          joined_at?: string
          status?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          completed_at?: string | null
          id?: string
          joined_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participants_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget_currency: string | null
          budget_total: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_public: boolean | null
          max_participants: number | null
          owner_user_id: string
          requirements: Json | null
          rewards: Json | null
          start_date: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          budget_currency?: string | null
          budget_total?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          owner_user_id: string
          requirements?: Json | null
          rewards?: Json | null
          start_date?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          budget_currency?: string | null
          budget_total?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          owner_user_id?: string
          requirements?: Json | null
          rewards?: Json | null
          start_date?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      creator_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          discord_handle: string | null
          display_name: string | null
          email: string | null
          id: string
          languages: string[] | null
          niches: string[] | null
          profile_completed: boolean | null
          regions: string[] | null
          telegram_handle: string | null
          tier: string | null
          twitter_followers: number | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
          youtube_subscribers: number | null
          youtube_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          discord_handle?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          languages?: string[] | null
          niches?: string[] | null
          profile_completed?: boolean | null
          regions?: string[] | null
          telegram_handle?: string | null
          tier?: string | null
          twitter_followers?: number | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          youtube_subscribers?: number | null
          youtube_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          discord_handle?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          languages?: string[] | null
          niches?: string[] | null
          profile_completed?: boolean | null
          regions?: string[] | null
          telegram_handle?: string | null
          tier?: string | null
          twitter_followers?: number | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          youtube_subscribers?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          budget_amount: number | null
          budget_currency: string | null
          created_at: string
          creator_id: string
          deadline: string | null
          deliverables: Json | null
          description: string | null
          id: string
          project_user_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          budget_amount?: number | null
          budget_currency?: string | null
          created_at?: string
          creator_id: string
          deadline?: string | null
          deliverables?: Json | null
          description?: string | null
          id?: string
          project_user_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          budget_amount?: number | null
          budget_currency?: string | null
          created_at?: string
          creator_id?: string
          deadline?: string | null
          deliverables?: Json | null
          description?: string | null
          id?: string
          project_user_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      tasks: {
        Row: {
          assigned_user_id: string
          campaign_id: string | null
          created_at: string
          deliverable_type: string | null
          description: string | null
          due_date: string | null
          id: string
          offer_id: string | null
          proof_notes: string | null
          proof_url: string | null
          reviewed_at: string | null
          status: string
          submitted_at: string | null
          title: string
          token_reward: number | null
          updated_at: string
          xp_reward: number | null
        }
        Insert: {
          assigned_user_id: string
          campaign_id?: string | null
          created_at?: string
          deliverable_type?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          offer_id?: string | null
          proof_notes?: string | null
          proof_url?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string | null
          title: string
          token_reward?: number | null
          updated_at?: string
          xp_reward?: number | null
        }
        Update: {
          assigned_user_id?: string
          campaign_id?: string | null
          created_at?: string
          deliverable_type?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          offer_id?: string | null
          proof_notes?: string | null
          proof_url?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string | null
          title?: string
          token_reward?: number | null
          updated_at?: string
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
          {
            foreignKeyName: "tasks_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
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
          created_at: string
          id: string
          reason: string
          source_id: string | null
          source_type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          source_id?: string | null
          source_type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          source_id?: string | null
          source_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
