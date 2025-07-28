import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 데이터베이스 타입 정의
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          height: number | null
          birth_date: string | null
          gender: 'male' | 'female' | 'other' | null
          fitness_level: 'beginner' | 'intermediate' | 'advanced'
          primary_goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance'
          target_weight: number | null
          available_days_per_week: number
          preferred_workout_duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          height?: number | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced'
          primary_goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance'
          target_weight?: number | null
          available_days_per_week?: number
          preferred_workout_duration?: number
        }
        Update: {
          email?: string
          full_name?: string | null
          height?: number | null
          birth_date?: string | null
          gender?: 'male' | 'female' | 'other' | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced'
          primary_goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance'
          target_weight?: number | null
          available_days_per_week?: number
          preferred_workout_duration?: number
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          workout_date: string
          start_time: string | null
          end_time: string | null
          total_duration: number | null
          title: string | null
          notes: string | null
          total_calories_burned: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          workout_date?: string
          start_time?: string | null
          end_time?: string | null
          total_duration?: number | null
          title?: string | null
          notes?: string | null
          total_calories_burned?: number
        }
        Update: {
          workout_date?: string
          start_time?: string | null
          end_time?: string | null
          total_duration?: number | null
          title?: string | null
          notes?: string | null
          total_calories_burned?: number
        }
      }
      weight_records: {
        Row: {
          id: string
          user_id: string
          record_date: string
          weight: number
          bmi: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          record_date?: string
          weight: number
          notes?: string | null
        }
        Update: {
          record_date?: string
          weight?: number
          notes?: string | null
        }
      }
    }
  }
}