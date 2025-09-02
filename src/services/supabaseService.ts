import { supabase, TABLES, STORAGE_BUCKETS } from '../lib/supabase'
import type { 
  Project, 
  Task, 
  Note, 
  Photo, 
  Receipt, 
  VoiceNote, 
  Timestamp,
  Database 
} from '../types/database'

// Project operations
export const projectService = {
  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .insert(project)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from(TABLES.PROJECTS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.PROJECTS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Task operations
export const taskService = {
  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll(userId: string, projectId?: string): Promise<Task[]> {
    let query = supabase
      .from(TABLES.TASKS)
      .select('*')
      .eq('user_id', userId)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.TASKS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Note operations
export const noteService = {
  async create(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note | null> {
    const { data, error } = await supabase
      .from(TABLES.NOTES)
      .insert(note)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll(userId: string, projectId?: string): Promise<Note[]> {
    let query = supabase
      .from(TABLES.NOTES)
      .select('*')
      .eq('user_id', userId)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<Note>): Promise<Note | null> {
    const { data, error } = await supabase
      .from(TABLES.NOTES)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.NOTES)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Photo operations
export const photoService = {
  async upload(file: File, userId: string, projectId?: string): Promise<Photo | null> {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${userId}/${fileName}`
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.PHOTOS)
      .upload(filePath, file)
    
    if (uploadError) throw uploadError
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.PHOTOS)
      .getPublicUrl(filePath)
    
    // Create database record
    const photo: Omit<Photo, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      project_id: projectId,
      title: file.name,
      file_path: publicUrl,
      file_size: file.size,
      mime_type: file.type,
    }
    
    const { data, error } = await supabase
      .from(TABLES.PHOTOS)
      .insert(photo)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll(userId: string, projectId?: string): Promise<Photo[]> {
    let query = supabase
      .from(TABLES.PHOTOS)
      .select('*')
      .eq('user_id', userId)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async delete(id: string, filePath: string): Promise<void> {
    // Delete from storage
    const pathParts = filePath.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const userId = pathParts[pathParts.length - 2]
    
    await supabase.storage
      .from(STORAGE_BUCKETS.PHOTOS)
      .remove([`${userId}/${fileName}`])
    
    // Delete from database
    const { error } = await supabase
      .from(TABLES.PHOTOS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Receipt operations
export const receiptService = {
  async create(receipt: Omit<Receipt, 'id' | 'created_at' | 'updated_at'>): Promise<Receipt | null> {
    const { data, error } = await supabase
      .from(TABLES.RECEIPTS)
      .insert(receipt)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll(userId: string, projectId?: string): Promise<Receipt[]> {
    let query = supabase
      .from(TABLES.RECEIPTS)
      .select('*')
      .eq('user_id', userId)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<Receipt>): Promise<Receipt | null> {
    const { data, error } = await supabase
      .from(TABLES.RECEIPTS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.RECEIPTS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Voice Note operations
export const voiceNoteService = {
  async upload(file: File, userId: string, projectId?: string): Promise<VoiceNote | null> {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${userId}/${fileName}`
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.VOICE_NOTES)
      .upload(filePath, file)
    
    if (uploadError) throw uploadError
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.VOICE_NOTES)
      .getPublicUrl(filePath)
    
    // Create database record
    const voiceNote: Omit<VoiceNote, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      project_id: projectId,
      title: file.name,
      file_path: publicUrl,
      duration: 0, // You might want to extract this from the audio file
      file_size: file.size,
    }
    
    const { data, error } = await supabase
      .from(TABLES.VOICE_NOTES)
      .insert(voiceNote)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll(userId: string, projectId?: string): Promise<VoiceNote[]> {
    let query = supabase
      .from(TABLES.VOICE_NOTES)
      .select('*')
      .eq('user_id', userId)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async delete(id: string, filePath: string): Promise<void> {
    // Delete from storage
    const pathParts = filePath.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const userId = pathParts[pathParts.length - 2]
    
    await supabase.storage
      .from(STORAGE_BUCKETS.VOICE_NOTES)
      .remove([`${userId}/${fileName}`])
    
    // Delete from database
    const { error } = await supabase
      .from(TABLES.VOICE_NOTES)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Timestamp operations
export const timestampService = {
  async create(timestamp: Omit<Timestamp, 'id' | 'created_at' | 'updated_at'>): Promise<Timestamp | null> {
    const { data, error } = await supabase
      .from(TABLES.TIMESTAMPS)
      .insert(timestamp)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll(userId: string, projectId?: string): Promise<Timestamp[]> {
    let query = supabase
      .from(TABLES.TIMESTAMPS)
      .select('*')
      .eq('user_id', userId)
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<Timestamp>): Promise<Timestamp | null> {
    const { data, error } = await supabase
      .from(TABLES.TIMESTAMPS)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.TIMESTAMPS)
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
