import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, FolderOpen } from 'lucide-react';
import { Project } from '../App';
import { NewProjectDialog } from './NewProjectDialog';

interface TasksScreenProps {
  projects: Project[];
  onAddProject: (name: string) => void;
  onSelectProject: (project: Project) => void;
}

export function TasksScreen({ projects, onAddProject, onSelectProject }: TasksScreenProps) {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  const handleCreateProject = (project: Project) => {
    onAddProject(project);
  };

  const getTaskCounts = (project: Project) => {
    const countTasks = (tasks: any[]): { total: number; completed: number } => {
      let total = 0;
      let completed = 0;
      
      for (const task of tasks) {
        total++;
        if (task.completed) completed++;
        
        if (task.subtasks && task.subtasks.length > 0) {
          const subtaskCounts = countTasks(task.subtasks);
          total += subtaskCounts.total;
          completed += subtaskCounts.completed;
        }
      }
      
      return { total, completed };
    };
    
    return countTasks(project.tasks);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-safe">
      <div className="flex items-center justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h1>Projects</h1>
          <p className="text-muted-foreground">Manage your project tasks and checklists</p>
        </div>
        
        <Button 
          className="flex items-center gap-2 shrink-0"
          onClick={() => setIsNewProjectDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first project</p>
          <Button onClick={() => setIsNewProjectDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const { total, completed } = getTaskCounts(project);
            const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            return (
              <Card 
                key={project.id} 
                className="cursor-pointer active:scale-95 transition-transform"
                onClick={() => onSelectProject(project)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Tasks: {completed}/{total}</span>
                      <span>{completionPercentage}% complete</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}