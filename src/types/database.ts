export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  project_id?: string
  title: string
  content: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  file_path: string
  file_size: number
  mime_type: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: string
  user_id: string
  project_id?: string
  title: string
  amount: number
  currency: string
  merchant?: string
  category?: string
  date: string
  file_path?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface VoiceNote {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  file_path: string
  duration: number
  file_size: number
  created_at: string
  updated_at: string
}

export interface Timestamp {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  timestamp: string
  timezone?: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
      }
      notes: {
        Row: Note
        Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Note, 'id' | 'created_at' | 'updated_at'>>
      }
      photos: {
        Row: Photo
        Insert: Omit<Photo, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Photo, 'id' | 'created_at' | 'updated_at'>>
      }
      receipts: {
        Row: Receipt
        Insert: Omit<Receipt, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Receipt, 'id' | 'created_at' | 'updated_at'>>
      }
      voice_notes: {
        Row: VoiceNote
        Insert: Omit<VoiceNote, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<VoiceNote, 'id' | 'created_at' | 'updated_at'>>
      }
      timestamps: {
        Row: Timestamp
        Insert: Omit<Timestamp, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Timestamp, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
