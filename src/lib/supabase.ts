import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pyvpjmssbtvwkzzvobgf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dnBqbXNzYnR2d2t6enZvYmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1Nzk5NzIsImV4cCI6MjA3MjE1NTk3Mn0.skaQAy4U1WUrLSJwOKd8ccbq43Y5Af3ArdgPCjUwf7A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  NOTES: 'notes',
  PHOTOS: 'photos',
  RECEIPTS: 'receipts',
  VOICE_NOTES: 'voice_notes',
  TIMESTAMPS: 'timestamps'
} as const

// Storage bucket names
export const STORAGE_BUCKETS = {
  PHOTOS: 'photos',
  RECEIPTS: 'receipts',
  VOICE_NOTES: 'voice_notes'
} as const
