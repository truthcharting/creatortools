import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from './ui/utils';

interface GhostTaskItemProps {
  onAddTask: () => void;
  level: number;
  label?: string;
}

export function GhostTaskItem({ onAddTask, level, label = "Add new task" }: GhostTaskItemProps) {
  const paddingLeft = level * 24 + 12;

  return (
    <div 
      className={cn(
        "flex items-center gap-3 py-4 px-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200 cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:shadow-sm"
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={onAddTask}
    >
      {/* Empty space for expand button */}
      <div className="w-8" />
      
      {/* Plus icon instead of checkbox */}
      <div className="w-4 h-4 flex items-center justify-center">
        <Plus className="h-4 w-4" />
      </div>
      
      {/* Ghost task content */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-sm italic font-medium">
          {label}
        </span>
      </div>
    </div>
  );
}