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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      cafe_proposals: {
        Row: {
          cafe_id: string
          created_at: string
          id: string
          match_id: string
          proposed_time: string
          rejection_reason: string | null
          user1_status: Database["public"]["Enums"]["proposal_status"]
          user2_status: Database["public"]["Enums"]["proposal_status"]
        }
        Insert: {
          cafe_id: string
          created_at?: string
          id?: string
          match_id: string
          proposed_time: string
          rejection_reason?: string | null
          user1_status?: Database["public"]["Enums"]["proposal_status"]
          user2_status?: Database["public"]["Enums"]["proposal_status"]
        }
        Update: {
          cafe_id?: string
          created_at?: string
          id?: string
          match_id?: string
          proposed_time?: string
          rejection_reason?: string | null
          user1_status?: Database["public"]["Enums"]["proposal_status"]
          user2_status?: Database["public"]["Enums"]["proposal_status"]
        }
        Relationships: [
          {
            foreignKeyName: "cafe_proposals_cafe_id_fkey"
            columns: ["cafe_id"]
            isOneToOne: false
            referencedRelation: "cafes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cafe_proposals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      cafes: {
        Row: {
          address: string
          commission_balance: number
          created_at: string
          id: string
          is_approved: boolean
          name: string
          rating_score: number
          user_id: string
        }
        Insert: {
          address?: string
          commission_balance?: number
          created_at?: string
          id?: string
          is_approved?: boolean
          name: string
          rating_score?: number
          user_id: string
        }
        Update: {
          address?: string
          commission_balance?: number
          created_at?: string
          id?: string
          is_approved?: boolean
          name?: string
          rating_score?: number
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          chat_unlocked: boolean
          created_at: string
          expires_at: string | null
          id: string
          status: Database["public"]["Enums"]["match_status"]
          user1_id: string
          user2_id: string
        }
        Insert: {
          chat_unlocked?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["match_status"]
          user1_id: string
          user2_id: string
        }
        Update: {
          chat_unlocked?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["match_status"]
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          match_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["payment_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          match_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type: Database["public"]["Enums"]["payment_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          match_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          type?: Database["public"]["Enums"]["payment_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          date_of_birth: string | null
          dating_prompt_answer: string | null
          email: string | null
          gender: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          name: string
          phone: string | null
          profile_picture_url: string | null
          religion: string | null
          updated_at: string
          user_id: string
          voice_intro_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          dating_prompt_answer?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          name?: string
          phone?: string | null
          profile_picture_url?: string | null
          religion?: string | null
          updated_at?: string
          user_id: string
          voice_intro_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          dating_prompt_answer?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          name?: string
          phone?: string | null
          profile_picture_url?: string | null
          religion?: string | null
          updated_at?: string
          user_id?: string
          voice_intro_url?: string | null
        }
        Relationships: []
      }
      sdp_tickets: {
        Row: {
          created_at: string
          id: string
          is_validated: boolean
          match_id: string
          ticket_code: string
          user_id: string
          validated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_validated?: boolean
          match_id: string
          ticket_code: string
          user_id: string
          validated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_validated?: boolean
          match_id?: string
          ticket_code?: string
          user_id?: string
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sdp_tickets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          issue_type: string
          message: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_type: string
          message: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_type?: string
          message?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      swipes: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["swipe_direction"]
          id: string
          swiped_id: string
          swiper_id: string
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["swipe_direction"]
          id?: string
          swiped_id: string
          swiper_id: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["swipe_direction"]
          id?: string
          swiped_id?: string
          swiper_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string
          id: string
          max_age: number | null
          min_age: number | null
          preferred_gender: string | null
          preferred_religion: string | null
          preferred_time_slots: Json | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          max_age?: number | null
          min_age?: number | null
          preferred_gender?: string | null
          preferred_religion?: string | null
          preferred_time_slots?: Json | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          id?: string
          max_age?: number | null
          min_age?: number | null
          preferred_gender?: string | null
          preferred_religion?: string | null
          preferred_time_slots?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "user" | "cafe" | "admin"
      match_status:
        | "pending_cafe_selection"
        | "cafe_proposed"
        | "cafe_rejected"
        | "awaiting_payment"
        | "confirmed"
        | "cancelled"
        | "expired"
        | "completed"
      payment_status: "pending" | "success" | "failed" | "forfeited"
      payment_type: "commitment" | "refund" | "commission"
      proposal_status: "pending" | "accepted" | "rejected"
      swipe_direction: "right" | "left"
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
      app_role: ["user", "cafe", "admin"],
      match_status: [
        "pending_cafe_selection",
        "cafe_proposed",
        "cafe_rejected",
        "awaiting_payment",
        "confirmed",
        "cancelled",
        "expired",
        "completed",
      ],
      payment_status: ["pending", "success", "failed", "forfeited"],
      payment_type: ["commitment", "refund", "commission"],
      proposal_status: ["pending", "accepted", "rejected"],
      swipe_direction: ["right", "left"],
    },
  },
} as const
