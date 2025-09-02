import React from 'react';
import { Button } from './ui/button';
import { Zap, CheckSquare, FileText } from 'lucide-react';
import { cn } from './ui/utils';

interface BottomNavigationProps {
  currentView: 'home' | 'project' | 'notes' | 'tasks';
  onGoHome: () => void;
  onGoToNotes: () => void;
  onGoToTasks: () => void;
}

export function BottomNavigation({ 
  currentView, 
  onGoHome, 
  onGoToNotes, 
  onGoToTasks
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe">
      <div className="flex items-center justify-around px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center gap-2 h-auto py-3 px-4",
            currentView === 'home' && "text-primary"
          )}
          onClick={onGoHome}
        >
          <Zap className="h-6 w-6" />
          <span className="text-sm font-medium">Home</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center gap-2 h-auto py-3 px-4",
            (currentView === 'project' || currentView === 'tasks') && "text-primary"
          )}
          onClick={onGoToTasks}
        >
          <CheckSquare className="h-6 w-6" />
          <span className="text-sm font-medium">Tasks</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex flex-col items-center gap-2 h-auto py-3 px-4",
            currentView === 'notes' && "text-primary"
          )}
          onClick={onGoToNotes}
        >
          <FileText className="h-6 w-6" />
          <span className="text-sm font-medium">Notes</span>
        </Button>
      </div>
    </div>
  );
}