import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { TasksScreen } from './components/TasksScreen';
import { ProjectScreen } from './components/ProjectScreen';
import { NotesScreen } from './components/NotesScreen';
import { InstantTimestamp } from './components/InstantTimestamp';
import { InstantNote } from './components/InstantNote';
import { InstantPic } from './components/InstantPic';
import { InstantImageUpload } from './components/InstantImageUpload';
import { InstantReceipt } from './components/InstantReceipt';
import { InstantVoiceNote } from './components/InstantVoiceNote';
import { BottomNavigation } from './components/BottomNavigation';
import { LoginScreen } from './components/LoginScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { storageService } from './services/storage';

export interface Note {
  text: string;
  photo?: string;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  note?: Note;
  subtasks: Task[];
  isExpanded?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  instantData?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  template?: string;
  shootDays?: number;
  shootDates?: Date[];
}

function AppContent() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [currentView, setCurrentView] = useState<'home' | 'project' | 'notes' | 'tasks' | 'tool'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Load projects from storage on app start
  useEffect(() => {
    const savedProjects = storageService.getProjects();
    setProjects(savedProjects);
  }, []);

  const addProject = (project: Project) => {
    console.log('Adding project:', project);
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    storageService.saveProject(project);
    console.log('Projects after adding:', updatedProjects);
  };

  const updateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(updatedProjects);
    storageService.saveProject(updatedProject);
    
    // Also update the selectedProject if it's the same project
    if (selectedProject && selectedProject.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project');
  };

  const selectTool = (toolId: string) => {
    setSelectedTool(toolId);
    setCurrentView('tool');
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedTool(null);
  };

  const goToTasks = () => {
    setCurrentView('tasks');
  };

  const goToNotes = () => {
    setCurrentView('notes');
  };

  const goToProject = () => {
    if (selectedProject) {
      setCurrentView('project');
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeScreen 
            onSelectTool={selectTool}
          />
        );
      
      case 'tasks':
        return (
          <TasksScreen 
            projects={projects} 
            onAddProject={addProject}
            onSelectProject={selectProject}
          />
        );
      
      case 'project':
        return selectedProject ? (
          <ProjectScreen 
            project={selectedProject}
            onUpdateProject={updateProject}
            onGoHome={goToTasks}
          />
        ) : null;
      
      case 'notes':
        return (
          <NotesScreen 
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />
        );
      
      case 'tool':
        switch (selectedTool) {
          case 'timestamp':
            return <InstantTimestamp onBack={goHome} />;
          case 'note':
            return <InstantNote onBack={goHome} />;
          case 'pic':
            return <InstantPic onBack={goHome} />;
          case 'upload':
            return <InstantImageUpload onBack={goHome} />;
          case 'receipt':
            return <InstantReceipt onBack={goHome} />;
          case 'voice':
            return <InstantVoiceNote onBack={goHome} />;
          default:
            return <HomeScreen onSelectTool={selectTool} />;
        }
      
      default:
        return <HomeScreen onSelectTool={selectTool} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {renderCurrentView()}
      
      {currentView !== 'tool' && (
        <BottomNavigation 
          currentView={currentView}
          onGoHome={goHome}
          onGoToNotes={goToNotes}
          onGoToTasks={goToTasks}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}