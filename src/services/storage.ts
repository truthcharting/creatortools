import { InstantData, Project, Task, OfflineSyncData } from '../types';

// Storage keys
const STORAGE_KEYS = {
  TIMESTAMPS: 'creatorTools_timestamps',
  NOTES: 'creatorTools_notes',
  PHOTOS: 'creatorTools_photos',
  RECEIPTS: 'creatorTools_receipts',
  VOICE_NOTES: 'creatorTools_voiceNotes',
  PROJECTS: 'creatorTools_projects',
  OFFLINE_SYNC: 'creatorTools_offlineSync',
  USER_DATA: 'creatorTools_userData'
} as const;

// Base storage operations
class StorageService {
  private getItem<T>(key: string): T[] {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return [];
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }

  private addItem<T>(key: string, item: T): void {
    const items = this.getItem<T>(key);
    items.push(item);
    this.setItem(key, items);
  }

  private updateItem<T extends { id: string }>(key: string, updatedItem: T): void {
    const items = this.getItem<T>(key);
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.setItem(key, items);
    }
  }

  private deleteItem<T extends { id: string }>(key: string, id: string): void {
    const items = this.getItem<T>(key);
    const filteredItems = items.filter(item => item.id !== id);
    this.setItem(key, filteredItems);
  }

  // Instant data operations
  saveInstantData(data: InstantData): void {
    const key = this.getStorageKeyForType(data.type);
    this.addItem(key, data);
    
    // Add to offline sync queue for future Supabase upload
    this.addToOfflineSync({
      id: Date.now().toString(),
      type: 'create',
      entityType: 'instantData',
      entityId: data.id,
      data,
      timestamp: new Date(),
      synced: false
    });
  }

  getInstantData(type?: InstantData['type']): InstantData[] {
    if (type) {
      const key = this.getStorageKeyForType(type);
      return this.getItem<InstantData>(key);
    }
    
    // Get all instant data
    const allData: InstantData[] = [];
    Object.values(STORAGE_KEYS).forEach(key => {
      if (key !== STORAGE_KEYS.PROJECTS && key !== STORAGE_KEYS.OFFLINE_SYNC && key !== STORAGE_KEYS.USER_DATA) {
        allData.push(...this.getItem<InstantData>(key));
      }
    });
    
    return allData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Project operations
  saveProject(project: Project): void {
    const projects = this.getItem<Project>(STORAGE_KEYS.PROJECTS);
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex !== -1) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    this.setItem(STORAGE_KEYS.PROJECTS, projects);
    
    // Add to offline sync queue
    this.addToOfflineSync({
      id: Date.now().toString(),
      type: existingIndex !== -1 ? 'update' : 'create',
      entityType: 'project',
      entityId: project.id,
      data: project,
      timestamp: new Date(),
      synced: false
    });
  }

  getProjects(): Project[] {
    return this.getItem<Project>(STORAGE_KEYS.PROJECTS);
  }

  getProject(id: string): Project | null {
    const projects = this.getItem<Project>(STORAGE_KEYS.PROJECTS);
    return projects.find(p => p.id === id) || null;
  }

  deleteProject(id: string): void {
    const projects = this.getItem<Project>(STORAGE_KEYS.PROJECTS);
    const filteredProjects = projects.filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PROJECTS, filteredProjects);
    
    // Add to offline sync queue
    this.addToOfflineSync({
      id: Date.now().toString(),
      type: 'delete',
      entityType: 'project',
      entityId: id,
      data: null,
      timestamp: new Date(),
      synced: false
    });
  }

  // Task operations
  updateTask(projectId: string, task: Task): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const updateTaskInProject = (tasks: Task[]): Task[] => {
      return tasks.map(t => {
        if (t.id === task.id) {
          return task;
        }
        if (t.subtasks.length > 0) {
          return { ...t, subtasks: updateTaskInProject(t.subtasks) };
        }
        return t;
      });
    };

    const updatedProject = {
      ...project,
      tasks: updateTaskInProject(project.tasks),
      updatedAt: new Date()
    };

    this.saveProject(updatedProject);
  }

  // Offline sync operations
  private addToOfflineSync(syncData: OfflineSyncData): void {
    this.addItem(STORAGE_KEYS.OFFLINE_SYNC, syncData);
  }

  getOfflineSyncData(): OfflineSyncData[] {
    return this.getItem<OfflineSyncData>(STORAGE_KEYS.OFFLINE_SYNC);
  }

  markSyncComplete(id: string): void {
    const syncData = this.getItem<OfflineSyncData>(STORAGE_KEYS.OFFLINE_SYNC);
    const updatedData = syncData.map(item => 
      item.id === id ? { ...item, synced: true } : item
    );
    this.setItem(STORAGE_KEYS.OFFLINE_SYNC, updatedData);
  }

  // Utility methods
  private getStorageKeyForType(type: InstantData['type']): string {
    switch (type) {
      case 'timestamp':
        return STORAGE_KEYS.TIMESTAMPS;
      case 'note':
        return STORAGE_KEYS.NOTES;
      case 'photo':
        return STORAGE_KEYS.PHOTOS;
      case 'receipt':
        return STORAGE_KEYS.RECEIPTS;
      case 'voice':
        return STORAGE_KEYS.VOICE_NOTES;
      default:
        throw new Error(`Unknown instant data type: ${type}`);
    }
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; total: number } {
    const used = JSON.stringify(localStorage).length;
    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
    const available = total - used;
    
    return { used, available, total };
  }
}

// Export singleton instance
export const storageService = new StorageService();
