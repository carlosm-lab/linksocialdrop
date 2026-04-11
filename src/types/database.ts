export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      link_clicks: {
        Row: {
          browser: string | null;
          clicked_at: string | null;
          country: string | null;
          device: string | null;
          id: string;
          link_id: string;
          referrer: string | null;
          user_id: string;
        };
        Insert: {
          browser?: string | null;
          clicked_at?: string | null;
          country?: string | null;
          device?: string | null;
          id?: string;
          link_id: string;
          referrer?: string | null;
          user_id: string;
        };
        Update: {
          browser?: string | null;
          clicked_at?: string | null;
          country?: string | null;
          device?: string | null;
          id?: string;
          link_id?: string;
          referrer?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "link_clicks_link_id_fkey";
            columns: ["link_id"];
            isOneToOne: false;
            referencedRelation: "links";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "link_clicks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      links: {
        Row: {
          bg_color: string | null;
          created_at: string | null;
          icon: string | null;
          id: string;
          position: number | null;
          text_color: string | null;
          title: string;
          updated_at: string | null;
          url: string;
          user_id: string;
          visible: boolean | null;
        };
        Insert: {
          bg_color?: string | null;
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          position?: number | null;
          text_color?: string | null;
          title: string;
          updated_at?: string | null;
          url: string;
          user_id: string;
          visible?: boolean | null;
        };
        Update: {
          bg_color?: string | null;
          created_at?: string | null;
          icon?: string | null;
          id?: string;
          position?: number | null;
          text_color?: string | null;
          title?: string;
          updated_at?: string | null;
          url?: string;
          user_id?: string;
          visible?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "links_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      page_views: {
        Row: {
          browser: string | null;
          country: string | null;
          device: string | null;
          id: string;
          profile_id: string;
          referrer: string | null;
          viewed_at: string | null;
        };
        Insert: {
          browser?: string | null;
          country?: string | null;
          device?: string | null;
          id?: string;
          profile_id: string;
          referrer?: string | null;
          viewed_at?: string | null;
        };
        Update: {
          browser?: string | null;
          country?: string | null;
          device?: string | null;
          id?: string;
          profile_id?: string;
          referrer?: string | null;
          viewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "page_views_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          accent_color: string | null;
          active_theme_id: string | null;
          avatar_url: string | null;
          background_color: string | null;
          bio: string | null;
          button_style: string | null;
          created_at: string | null;
          font_family: string | null;
          full_name: string | null;
          id: string;
          is_public: boolean | null;
          layout_mode: string | null;
          show_logo: boolean | null;
          theme: string | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          accent_color?: string | null;
          active_theme_id?: string | null;
          avatar_url?: string | null;
          background_color?: string | null;
          bio?: string | null;
          button_style?: string | null;
          created_at?: string | null;
          font_family?: string | null;
          full_name?: string | null;
          id: string;
          is_public?: boolean | null;
          layout_mode?: string | null;
          show_logo?: boolean | null;
          theme?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          accent_color?: string | null;
          active_theme_id?: string | null;
          avatar_url?: string | null;
          background_color?: string | null;
          bio?: string | null;
          button_style?: string | null;
          created_at?: string | null;
          font_family?: string | null;
          full_name?: string | null;
          id?: string;
          is_public?: boolean | null;
          layout_mode?: string | null;
          show_logo?: boolean | null;
          theme?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_active_theme_id_fkey";
            columns: ["active_theme_id"];
            isOneToOne: false;
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
        ];
      };
      support_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          read: boolean;
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          read?: boolean;
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          read?: boolean;
          subject?: string;
        };
        Relationships: [];
      };
      themes: {
        Row: {
          config: Json;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          preview_image_url: string | null;
          price: number;
          slug: string;
        };
        Insert: {
          config?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          preview_image_url?: string | null;
          price?: number;
          slug: string;
        };
        Update: {
          config?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          preview_image_url?: string | null;
          price?: number;
          slug?: string;
        };
        Relationships: [];
      };
      user_themes: {
        Row: {
          id: string;
          is_active: boolean;
          purchased_at: string;
          theme_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          is_active?: boolean;
          purchased_at?: string;
          theme_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          is_active?: boolean;
          purchased_at?: string;
          theme_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_themes_theme_id_fkey";
            columns: ["theme_id"];
            isOneToOne: false;
            referencedRelation: "themes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_themes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_link_leaderboard: {
        Args: { p_user_id: string };
        Returns: {
          clicks: number;
          link_id: string;
          title: string;
          url: string;
        }[];
      };
      reorder_links: {
        Args: { p_links: Json; p_user_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
