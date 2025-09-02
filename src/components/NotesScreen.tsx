import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FileText, Image, Folder, ChevronLeft, Circle } from 'lucide-react';
import { Project, Task } from '../App';

interface NotesScreenProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
}

export function NotesScreen({ projects, selectedProject, onSelectProject }: NotesScreenProps) {
  const [viewSelectedProject, setViewSelectedProject] = useState<Project | null>(selectedProject);

  const renderTaskWithNotes = (task: Task, level: number = 0) => {
    const hasNote = task.note && (task.note.text || task.note.photo);
    const hasSubtasks = task.subtasks.length > 0;
    
    return (
      <div key={task.id} className="space-y-3">
        <div className={`flex items-start gap-3 ${level > 0 ? 'ml-6' : ''}`}>
          <Circle className={`h-2 w-2 mt-2 shrink-0 ${level === 0 ? 'fill-foreground' : 'fill-muted-foreground'}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${level === 0 ? 'font-medium' : ''} ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.name}
              </span>
              {task.completed && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  completed
                </Badge>
              )}
              {hasNote && (
                <div className="flex items-center gap-1">
                  {task.note?.text && <FileText className="h-3 w-3 text-blue-500" />}
                  {task.note?.photo && <Image className="h-3 w-3 text-green-500" />}
                </div>
              )}
            </div>
            
            {hasNote && (
              <div className="mt-2 space-y-3">
                {task.note?.text && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>Note</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{task.note.text}</p>
                  </div>
                )}
                
                {task.note?.photo && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      <Image className="h-3 w-3" />
                      <span>Photo</span>
                    </div>
                    <ImageWithFallback
                      src={task.note.photo}
                      alt={`Note attachment for ${task.name}`}
                      className="max-w-full h-auto max-h-48 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {hasSubtasks && (
          <div className="space-y-3">
            {task.subtasks.map((subtask) => renderTaskWithNotes(subtask, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderProjectTasks = (project: Project) => {
    if (project.tasks.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2" />
          <p>No tasks in this project yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {project.tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardContent className="p-4">
              {renderTaskWithNotes(task, 0)}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-safe">
      {!viewSelectedProject ? (
        <div className="space-y-6">
          <div className="mb-6">
            <h1 className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Notes & Attachments
            </h1>
            <p className="text-muted-foreground">Select a project to view all tasks and notes</p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">No projects yet</h3>
              <p className="text-muted-foreground">Create a project to start adding tasks and notes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => {
                const totalTasks = project.tasks.reduce((count, task) => {
                  return count + 1 + task.subtasks.length;
                }, 0);
                
                const tasksWithNotes = project.tasks.reduce((count, task) => {
                  let taskCount = 0;
                  if (task.note && (task.note.text || task.note.photo)) taskCount++;
                  taskCount += task.subtasks.filter(subtask => 
                    subtask.note && (subtask.note.text || subtask.note.photo)
                  ).length;
                  return count + taskCount;
                }, 0);
                
                return (
                  <Card 
                    key={project.id} 
                    className="cursor-pointer active:scale-95 transition-transform"
                    onClick={() => {
                      setViewSelectedProject(project);
                      onSelectProject(project);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Folder className="h-5 w-5" />
                        <span className="truncate">{project.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>{totalTasks} total tasks</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{tasksWithNotes} with notes</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setViewSelectedProject(null)}
              className="flex items-center gap-2 shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-2 truncate">
                <FileText className="h-6 w-6 shrink-0" />
                {viewSelectedProject.name}
              </h1>
              <p className="text-muted-foreground">All tasks and their notes</p>
            </div>
          </div>

          {renderProjectTasks(viewSelectedProject)}
        </div>
      )}
    </div>
  );
}