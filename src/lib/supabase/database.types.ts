// Supabase 데이터베이스 스키마 타입 정의
// 실제 Supabase 프로젝트 생성 후 supabase gen types typescript 명령으로 자동 생성 가능

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          age: number | null
          occupation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          age?: number | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          age?: number | null
          occupation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      financial_accounts: {
        Row: {
          id: string
          user_id: string
          account_type: string
          institution_name: string
          account_number: string
          balance: number
          currency: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_type: string
          institution_name: string
          account_number: string
          balance: number
          currency?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_type?: string
          institution_name?: string
          account_number?: string
          balance?: number
          currency?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          transaction_date: string
          amount: number
          category: string
          description: string
          merchant_name: string | null
          location: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          transaction_date: string
          amount: number
          category: string
          description: string
          merchant_name?: string | null
          location?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          transaction_date?: string
          amount?: number
          category?: string
          description?: string
          merchant_name?: string | null
          location?: Json | null
          created_at?: string
        }
      }
      financial_goals: {
        Row: {
          id: string
          user_id: string
          goal_type: string
          title: string
          description: string | null
          target_amount: number
          current_amount: number
          target_date: string
          priority: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_type: string
          title: string
          description?: string | null
          target_amount: number
          current_amount?: number
          target_date: string
          priority?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_type?: string
          title?: string
          description?: string | null
          target_amount?: number
          current_amount?: number
          target_date?: string
          priority?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      simulations: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          scenario_type: string
          simulation_period_years: number
          assumptions: Json
          events: Json
          results: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          scenario_type: string
          simulation_period_years: number
          assumptions: Json
          events: Json
          results?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          scenario_type?: string
          simulation_period_years?: number
          assumptions?: Json
          events?: Json
          results?: Json | null
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
