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
      airline: {
        Row: {
          code: string
          id: string
          logo: string | null
          name: string
        }
        Insert: {
          code: string
          id?: string
          logo?: string | null
          name: string
        }
        Update: {
          code?: string
          id?: string
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      airport: {
        Row: {
          airport_code: string
          city: string
          location: string
          name: string
        }
        Insert: {
          airport_code: string
          city: string
          location: string
          name: string
        }
        Update: {
          airport_code?: string
          city?: string
          location?: string
          name?: string
        }
        Relationships: []
      }
      baggage_allowance: {
        Row: {
          cabin_baggage: string
          checked_baggage: string
          extra_baggage_fee: number
          id: string
        }
        Insert: {
          cabin_baggage: string
          checked_baggage: string
          extra_baggage_fee: number
          id?: string
        }
        Update: {
          cabin_baggage?: string
          checked_baggage?: string
          extra_baggage_fee?: number
          id?: string
        }
        Relationships: []
      }
      booking: {
        Row: {
          baggage_allowance_id: string | null
          booking_date: string
          created_at: string
          flight_id: string
          id: string
          passenger_id: string
          seat_number: string
          status: string
          total_price: number
        }
        Insert: {
          baggage_allowance_id?: string | null
          booking_date?: string
          created_at?: string
          flight_id: string
          id?: string
          passenger_id: string
          seat_number: string
          status?: string
          total_price: number
        }
        Update: {
          baggage_allowance_id?: string | null
          booking_date?: string
          created_at?: string
          flight_id?: string
          id?: string
          passenger_id?: string
          seat_number?: string
          status?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_baggage_allowance_id_fkey"
            columns: ["baggage_allowance_id"]
            isOneToOne: false
            referencedRelation: "baggage_allowance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flight"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passenger"
            referencedColumns: ["id"]
          },
        ]
      }
      flight: {
        Row: {
          aircraft: string
          airline_id: string
          arrival_time: string
          available_seats: number
          created_at: string
          departure_time: string
          destination_airport: string
          flight_number: string
          id: string
          price: number
          source_airport: string
          status: string
          total_seats: number
        }
        Insert: {
          aircraft: string
          airline_id: string
          arrival_time: string
          available_seats: number
          created_at?: string
          departure_time: string
          destination_airport: string
          flight_number: string
          id?: string
          price: number
          source_airport: string
          status?: string
          total_seats: number
        }
        Update: {
          aircraft?: string
          airline_id?: string
          arrival_time?: string
          available_seats?: number
          created_at?: string
          departure_time?: string
          destination_airport?: string
          flight_number?: string
          id?: string
          price?: number
          source_airport?: string
          status?: string
          total_seats?: number
        }
        Relationships: [
          {
            foreignKeyName: "flight_airline_id_fkey"
            columns: ["airline_id"]
            isOneToOne: false
            referencedRelation: "airline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_destination_airport_fkey"
            columns: ["destination_airport"]
            isOneToOne: false
            referencedRelation: "airport"
            referencedColumns: ["airport_code"]
          },
          {
            foreignKeyName: "flight_source_airport_fkey"
            columns: ["source_airport"]
            isOneToOne: false
            referencedRelation: "airport"
            referencedColumns: ["airport_code"]
          },
        ]
      }
      passenger: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          passport_number: string | null
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          passport_number?: string | null
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          passport_number?: string | null
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ticket: {
        Row: {
          booking_id: string
          id: string
          issue_date: string
          status: string
        }
        Insert: {
          booking_id: string
          id?: string
          issue_date?: string
          status?: string
        }
        Update: {
          booking_id?: string
          id?: string
          issue_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
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
