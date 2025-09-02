import React, { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronRight, Plus, StickyNote, FileText, Image, AlertCircle } from 'lucide-react';
import { Task } from '../App';
import { NoteDialog } from './NoteDialog';
import { GhostTaskItem } from './GhostTaskItem';
import { cn } from './ui/utils';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddSubtask: (parentId: string) => void;
  level: number;
}

export function TaskItem({ task, onUpdateTask, onAddSubtask, level }: TaskItemProps) {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    onUpdateTask(task.id, { isExpanded: newExpandedState });
  };

  const toggleCompleted = () => {
    onUpdateTask(task.id, { completed: !task.completed });
  };

  const handleNoteUpdate = (note: { text: string; photo?: string } | undefined) => {
    onUpdateTask(task.id, { note });
  };

  const hasSubtasks = task.subtasks.length > 0;
  const hasNote = task.note && (task.note.text || task.note.photo);
  const isExpanded = task.isExpanded ?? false;

  // Get phase/category badges based on task name patterns
  const getTaskBadge = (taskName: string) => {
    const name = taskName.toLowerCase();
    if (name.includes('pre-production') || name.includes('script') || name.includes('schedule')) {
      return <Badge variant="secondary" className="bg-teal-100 text-teal-800 border-teal-200">pre-production</Badge>;
    }
    if (name.includes('production') || name.includes('shoot') || name.includes('film')) {
      return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">production</Badge>;
    }
    if (name.includes('post-production') || name.includes('edit') || name.includes('export')) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">post-production</Badge>;
    }
    return null;
  };

  const paddingLeft = level * 24 + 12;

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center gap-3 py-4 px-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 group",
          task.completed && "opacity-60",
          isExpanded && "bg-muted/20 border-border"
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Expand/Collapse button */}
        {hasSubtasks ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
            onClick={toggleExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        ) : (
          <div className="w-8" />
        )}

        {/* Completion checkbox - only show for subtasks (level > 0) */}
        {level > 0 ? (
          <Checkbox
            checked={task.completed}
            onCheckedChange={toggleCompleted}
            className="mt-0.5"
          />
        ) : (
          <div className="w-4" />
        )}

        {/* Task content */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className={cn(
            "truncate font-medium text-base",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.name}
          </span>
          
          {getTaskBadge(task.name)}
          
          {hasSubtasks && (
            <Badge variant="outline" className="text-sm px-2 py-1">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </Badge>
          )}
        </div>

        {/* Note indicator and actions */}
        <div className="flex items-center gap-2">
          {hasNote && (
            <div className="flex items-center gap-1">
              {task.note?.text && <FileText className="h-4 w-4 text-blue-500" />}
              {task.note?.photo && <Image className="h-4 w-4 text-green-500" />}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
            onClick={() => setIsNoteDialogOpen(true)}
          >
            <StickyNote className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subtasks */}
      {hasSubtasks && isExpanded && (
        <div className="space-y-2 mt-3 ml-8 pl-4 border-l-2 border-muted/30">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onUpdateTask={onUpdateTask}
              onAddSubtask={onAddSubtask}
              level={level + 1}
            />
          ))}
          
          {/* Ghost task for adding subtasks */}
          {level < 2 && (
            <GhostTaskItem
              onAddTask={() => onAddSubtask(task.id)}
              level={level + 1}
              label="Add subtask"
            />
          )}
        </div>
      )}

      {/* Note Dialog */}
      <NoteDialog
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        taskName={task.name}
        note={task.note}
        onSave={handleNoteUpdate}
      />
    </div>
  );
}