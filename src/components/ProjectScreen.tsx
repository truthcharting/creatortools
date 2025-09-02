import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Plus } from 'lucide-react';
import { Project, Task } from '../App';
import { TaskItem } from './TaskItem';
import { GhostTaskItem } from './GhostTaskItem';

interface ProjectScreenProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onGoHome: () => void;
}

export function ProjectScreen({ project, onUpdateProject, onGoHome }: ProjectScreenProps) {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);

  const addTask = (name: string, parentId: string | null = null) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      completed: false,
      subtasks: []
    };

    const addToTasks = (tasks: Task[]): Task[] => {
      if (!parentId) {
        return [...tasks, newTask];
      }
      
      return tasks.map(task => {
        if (task.id === parentId) {
          return {
            ...task,
            subtasks: [...task.subtasks, newTask]
          };
        }
        
        if (task.subtasks.length > 0) {
          return {
            ...task,
            subtasks: addToTasks(task.subtasks)
          };
        }
        
        return task;
      });
    };

    const updatedProject = {
      ...project,
      tasks: addToTasks(project.tasks)
    };
    
    onUpdateProject(updatedProject);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updateInTasks = (tasks: Task[]): Task[] => {
      return tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        
        if (task.subtasks.length > 0) {
          return {
            ...task,
            subtasks: updateInTasks(task.subtasks)
          };
        }
        
        return task;
      });
    };

    const updatedProject = {
      ...project,
      tasks: updateInTasks(project.tasks)
    };
    
    onUpdateProject(updatedProject);
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask(newTaskName.trim(), parentTaskId);
      setNewTaskName('');
      setParentTaskId(null);
      setIsAddTaskDialogOpen(false);
    }
  };

  const openAddTaskDialog = (parentId: string | null = null) => {
    setParentTaskId(parentId);
    setIsAddTaskDialogOpen(true);
  };

  const getTaskCounts = () => {
    const countTasks = (tasks: Task[]): { total: number; completed: number } => {
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

  const { total, completed } = getTaskCounts();

  return (
    <div className="max-w-4xl mx-auto p-4 pt-safe">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onGoHome}
          className="flex items-center gap-2 shrink-0 h-10 px-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold truncate mb-1">{project.name}</h1>
          <p className="text-lg text-muted-foreground">{completed}/{total} tasks completed</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Tasks ({total})</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-3">
          {project.tasks.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks yet. Add your first task to get started.</p>
              </div>
              <GhostTaskItem
                onAddTask={() => openAddTaskDialog()}
                level={0}
                label="Add your first task"
              />
            </div>
          ) : (
            <>
              {project.tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdateTask={updateTask}
                  onAddSubtask={openAddTaskDialog}
                  level={0}
                />
              ))}
              
              {/* Ghost task for adding main tasks */}
              <GhostTaskItem
                onAddTask={() => openAddTaskDialog()}
                level={0}
                label="Add new task"
              />
            </>
          )}
        </div>
      </div>

      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {parentTaskId ? 'Add Subtask' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="task-name">Task Name</Label>
              <Input
                id="task-name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter task name..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddTaskDialogOpen(false);
              setParentTaskId(null);
              setNewTaskName('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} disabled={!newTaskName.trim()}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}