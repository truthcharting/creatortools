// Base interfaces for all instant tools
export interface BaseInstantData {
  id: string;
  createdAt: Date;
  geolocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
  projectId?: string; // Optional assignment to project
}

// Timestamp specific data
export interface TimestampData extends BaseInstantData {
  type: 'timestamp';
  timestamp: Date;
  formatOptions: Array<{
    id: string;
    label: string;
    value: string;
  }>;
}

// Note specific data
export interface NoteData extends BaseInstantData {
  type: 'note';
  text: string;
  title?: string;
}

// Photo specific data
export interface PhotoData extends BaseInstantData {
  type: 'photo';
  images: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
  }>;
}

// Receipt specific data
export interface ReceiptData extends BaseInstantData {
  type: 'receipt';
  images: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
  }>;
  amount?: number;
  vendor?: string;
  category?: string;
}

// Voice note specific data
export interface VoiceNoteData extends BaseInstantData {
  type: 'voice';
  audioUrl: string;
  duration: number;
  filename: string;
  transcription?: string;
}

// Union type for all instant data
export type InstantData = TimestampData | NoteData | PhotoData | ReceiptData | VoiceNoteData;

// Task interfaces
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  note?: NoteData;
  photos?: PhotoData[];
  subtasks: Task[];
  isExpanded?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Project interfaces
export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  instantData: InstantData[]; // All instant data assigned to this project
  createdAt: Date;
  updatedAt: Date;
  template?: string; // For template-based projects
  shootDays?: number;
  shootDates?: Date[];
}

// Template interfaces
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[];
  requiresShootDays?: boolean;
  requiresShootDates?: boolean;
}

// User interface (for future Supabase integration)
export interface User {
  id: string;
  email: string;
  name: string;
  projects: Project[];
  createdAt: Date;
}

// Offline sync interface
export interface OfflineSyncData {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'project' | 'task' | 'instantData';
  entityId: string;
  data: any;
  timestamp: Date;
  synced: boolean;
}
