import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { availableTemplates, generateProjectFromTemplate } from '../services/templates';
import { ProjectTemplate } from '../types';
import { format } from 'date-fns';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: any) => void;
}

export function NewProjectDialog({ isOpen, onClose, onCreateProject }: NewProjectDialogProps) {
  const [step, setStep] = useState<'template' | 'details' | 'dates'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [shootDays, setShootDays] = useState<number>(1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleTemplateSelect = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setStep('details');
    }
  };

  const handleNext = () => {
    if (step === 'details') {
      if (selectedTemplate?.requiresShootDates) {
        setStep('dates');
      } else {
        createProject();
      }
    }
  };

  const handleBack = () => {
    if (step === 'dates') {
      setStep('details');
    } else if (step === 'details') {
      setStep('template');
    }
  };

  const createProject = () => {
    if (!selectedTemplate || !projectName.trim()) return;

    const project = generateProjectFromTemplate(
      selectedTemplate,
      projectName.trim(),
      selectedTemplate.requiresShootDays ? shootDays : undefined,
      selectedTemplate.requiresShootDates ? selectedDates : undefined
    );

    console.log('Creating project:', project);
    onCreateProject(project);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('template');
    setSelectedTemplate(null);
    setProjectName('');
    setShootDays(1);
    setSelectedDates([]);
    onClose();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
    
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      if (selectedDates.length < shootDays) {
        setSelectedDates([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
      }
    }
  };

  const removeDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateToRemove.toDateString()));
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.toDateString() === date.toDateString());
  };

  const renderTemplateStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-3">Choose a Template</h3>
        <p className="text-lg text-muted-foreground">Select a template to get started quickly</p>
      </div>
      
      <div className="grid gap-6">
        {availableTemplates.map((template) => (
          <Card 
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95 border-2 hover:border-primary/20"
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-xl">
                <span>{template.name}</span>
                {template.requiresShootDays && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">Shoot Days</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground leading-relaxed">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-3">Project Details</h3>
        <p className="text-lg text-muted-foreground">Configure your {selectedTemplate?.name} project</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="project-name" className="text-lg font-semibold mb-3 block">Project Name</Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className="mt-2 h-12 text-lg px-4"
          />
        </div>
        
        {selectedTemplate?.requiresShootDays && (
          <div>
            <Label htmlFor="shoot-days" className="text-lg font-semibold mb-3 block">Number of Shoot Days</Label>
            <Select value={shootDays.toString()} onValueChange={(value) => setShootDays(parseInt(value))}>
              <SelectTrigger className="mt-2 h-12 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                  <SelectItem key={day} value={day.toString()} className="text-lg py-3">
                    {day} {day === 1 ? 'day' : 'days'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

    const renderDatesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-3">Select Shoot Dates</h3>
        <p className="text-lg text-muted-foreground">Choose {shootDays} date{shootDays > 1 ? 's' : ''} for your shoot</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-lg font-semibold mb-3 block">Selected Dates ({selectedDates.length}/{shootDays})</Label>
          <div className="flex flex-wrap gap-3 mt-3">
            {selectedDates.map((date, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2 px-4 py-2 text-base">
                {format(date, 'MMM dd, yyyy')}
                <X 
                  className="h-4 w-4 cursor-pointer hover:text-destructive" 
                  onClick={() => removeDate(date)}
                />
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-lg font-semibold mb-3 block">Calendar</Label>
          <div className="border rounded-lg p-6 mt-3">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => {
                console.log('Calendar onSelect called with:', dates);
                if (dates) {
                  const limitedDates = dates.slice(0, shootDays);
                  setSelectedDates(limitedDates.sort((a, b) => a.getTime() - b.getTime()));
                }
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              className="w-full"
              classNames={{
                months: "flex flex-col sm:flex-row gap-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center text-lg font-semibold",
                caption_label: "text-lg font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button: "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-lg border",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-12 font-normal text-base",
                row: "flex w-full mt-2",
                cell: "h-12 w-12 text-center text-base p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors",
                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'template':
        return renderTemplateStep();
      case 'details':
        return renderDetailsStep();
      case 'dates':
        return renderDatesStep();
      default:
        return renderTemplateStep();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'template':
        return selectedTemplate !== null;
      case 'details':
        return projectName.trim().length > 0 && 
               (!selectedTemplate?.requiresShootDays || shootDays > 0);
      case 'dates':
        return selectedDates.length === shootDays;
      default:
        return false;
    }
  };

  const canCreateProject = () => {
    if (step === 'dates') {
      return selectedDates.length === shootDays;
    }
    return canProceed();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <Plus className="h-7 w-7" />
            New Project
          </DialogTitle>
        </DialogHeader>
        
        {renderStepContent()}
        
        <DialogFooter className="flex flex-col gap-4 pt-6">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 'template'}
              className="flex-1 h-12 text-lg font-semibold"
            >
              Back
            </Button>
            <Button 
              onClick={step === 'dates' ? createProject : handleNext}
              disabled={!canCreateProject()}
              className="flex-1 h-12 text-lg font-semibold"
            >
              {step === 'dates' ? 'Create Project' : 'Next'}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={resetAndClose}
            className="w-full h-12 text-lg font-semibold"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
