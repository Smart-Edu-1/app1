export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activation_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_used?: boolean
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          about_text: string | null
          accent_color: string | null
          admin_password: string | null
          admin_username: string | null
          app_name: string
          contact_methods: Json | null
          contact_page_description: string | null
          contact_page_title: string | null
          created_at: string
          id: string
          monthly_price: number | null
          primary_color: string | null
          quarterly_price: number | null
          secondary_color: string | null
          subscription_plans: Json | null
          support_contacts: Json | null
          updated_at: string
          working_hours: Json | null
          working_hours_title: string | null
          yearly_price: number | null
        }
        Insert: {
          about_text?: string | null
          accent_color?: string | null
          admin_password?: string | null
          admin_username?: string | null
          app_name?: string
          contact_methods?: Json | null
          contact_page_description?: string | null
          contact_page_title?: string | null
          created_at?: string
          id?: string
          monthly_price?: number | null
          primary_color?: string | null
          quarterly_price?: number | null
          secondary_color?: string | null
          subscription_plans?: Json | null
          support_contacts?: Json | null
          updated_at?: string
          working_hours?: Json | null
          working_hours_title?: string | null
          yearly_price?: number | null
        }
        Update: {
          about_text?: string | null
          accent_color?: string | null
          admin_password?: string | null
          admin_username?: string | null
          app_name?: string
          contact_methods?: Json | null
          contact_page_description?: string | null
          contact_page_title?: string | null
          created_at?: string
          id?: string
          monthly_price?: number | null
          primary_color?: string | null
          quarterly_price?: number | null
          secondary_color?: string | null
          subscription_plans?: Json | null
          support_contacts?: Json | null
          updated_at?: string
          working_hours?: Json | null
          working_hours_title?: string | null
          yearly_price?: number | null
        }
        Relationships: []
      }
      distribution_centers: {
        Row: {
          address: string
          created_at: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          order_index: number
          phone: string
          updated_at: string
          working_hours: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          order_index?: number
          phone: string
          updated_at?: string
          working_hours: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          order_index?: number
          phone?: string
          updated_at?: string
          working_hours?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_free: boolean
          order_index: number
          title: string
          unit_id: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_free?: boolean
          order_index?: number
          title: string
          unit_id: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_free?: boolean
          order_index?: number
          title?: string
          unit_id?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activation_code: string | null
          created_at: string
          device_id: string | null
          expiry_date: string | null
          full_name: string
          id: string
          is_active: boolean
          is_admin: boolean
          is_logged_out: boolean | null
          password: string
          updated_at: string
          user_id: string | null
          username: string
        }
        Insert: {
          activation_code?: string | null
          created_at?: string
          device_id?: string | null
          expiry_date?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          is_admin?: boolean
          is_logged_out?: boolean | null
          password: string
          updated_at?: string
          user_id?: string | null
          username: string
        }
        Update: {
          activation_code?: string | null
          created_at?: string
          device_id?: string | null
          expiry_date?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          is_admin?: boolean
          is_logged_out?: boolean | null
          password?: string
          updated_at?: string
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          lesson_id: string | null
          questions: Json
          subject_id: string | null
          time_limit: number | null
          title: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lesson_id?: string | null
          questions?: Json
          subject_id?: string | null
          time_limit?: number | null
          title: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          lesson_id?: string | null
          questions?: Json
          subject_id?: string | null
          time_limit?: number | null
          title?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          order_index: number
          teacher_contact: string | null
          teacher_email: string | null
          teacher_phone: string | null
          teacher_whatsapp: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          order_index?: number
          teacher_contact?: string | null
          teacher_email?: string | null
          teacher_phone?: string | null
          teacher_whatsapp?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          order_index?: number
          teacher_contact?: string | null
          teacher_email?: string | null
          teacher_phone?: string | null
          teacher_whatsapp?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          order_index: number
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          order_index?: number
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          order_index?: number
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
