import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock, StickyNote, Camera, Receipt, Mic, Zap, Upload } from 'lucide-react';

interface HomeScreenProps {
  onSelectTool: (tool: string) => void;
}

export function HomeScreen({ onSelectTool }: HomeScreenProps) {
  const quickTools = [
    {
      id: 'timestamp',
      name: 'Instant Timestamp',
      description: 'Generate timestamps in various formats',
      icon: Clock,
      color: 'bg-blue-500',
      accent: 'text-blue-500'
    },
    {
      id: 'note',
      name: 'Instant Note',
      description: 'Quickly jot down thoughts and ideas',
      icon: StickyNote,
      color: 'bg-yellow-500',
      accent: 'text-yellow-500'
    },
    {
      id: 'pic',
      name: 'Instant Pic',
      description: 'Capture and save photos instantly',
      icon: Camera,
      color: 'bg-green-500',
      accent: 'text-green-500'
    },
    {
      id: 'upload',
      name: 'Instant Image Upload',
      description: 'Select images from your photo roll',
      icon: Upload,
      color: 'bg-teal-500',
      accent: 'text-teal-500'
    },
    {
      id: 'receipt',
      name: 'Instant Receipt',
      description: 'Scan and organize your receipts',
      icon: Receipt,
      color: 'bg-purple-500',
      accent: 'text-purple-500'
    },
    {
      id: 'voice',
      name: 'Instant Voice Note',
      description: 'Record quick voice memos',
      icon: Mic,
      color: 'bg-red-500',
      accent: 'text-red-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 pt-safe">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl">Quick Tools</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Instant access to productivity tools for capturing and organizing information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card 
              key={tool.id}
              className="cursor-pointer hover:shadow-lg active:scale-95 transition-all duration-200 group border-2 hover:border-muted-foreground/20"
              onClick={() => onSelectTool(tool.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="group-hover:text-primary transition-colors mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {tool.description}
                    </p>
                  </div>
                  <div className={`${tool.accent} group-hover:scale-105 transition-transform duration-200 shrink-0`}>
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">All tools work offline</span>
        </div>
      </div>
    </div>
  );
}