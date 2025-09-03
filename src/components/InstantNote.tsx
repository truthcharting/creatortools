import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, MapPin, Clock, Save, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { noteService } from '../services/supabaseService';

interface InstantNoteProps {
  onBack: () => void;
}

export function InstantNote({ onBack }: InstantNoteProps) {
  const { user } = useAuth();
  const [noteText, setNoteText] = useState('');
  const [geolocation, setGeolocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [savedNote, setSavedNote] = useState<any>(null);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocationLoading(false);
        },
        (error) => {
          setLocationError('Location access denied');
          setIsLocationLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation not supported');
      setIsLocationLoading(false);
    }
  }, []);

  const saveNote = async () => {
    if (!noteText.trim() || !user) return;

    setIsSaving(true);
    try {
      const noteData = {
        user_id: user.id,
        title: noteText.trim().substring(0, 100) + (noteText.length > 100 ? '...' : ''),
        content: noteText.trim(),
        tags: [],
        project_id: null
      };

      const savedNote = await noteService.create(noteData);
      setSavedNote(savedNote);
      setShowSavedNotification(true);
      
      // Clear form after saving
      setTimeout(() => {
        setNoteText('');
        setSavedNote(null);
        setShowSavedNotification(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving note:', error);
      // You could add error handling UI here
    } finally {
      setIsSaving(false);
    }
  };

  const getLocationStatus = () => {
    if (isLocationLoading) {
      return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Getting location...</Badge>;
    }
    if (locationError) {
      return <Badge variant="destructive" className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {locationError}</Badge>;
    }
    if (geolocation) {
      return <Badge variant="default" className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Location captured</Badge>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background pt-safe pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Instant Note</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Status */}
        <div className="flex justify-center">
          {getLocationStatus()}
        </div>

        {/* Note Input */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Jot down your thoughts, ideas, or observations..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[200px] text-lg resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            
            {/* Save Button */}
            <Button 
              onClick={saveNote}
              disabled={!noteText.trim() || isSaving}
              className="w-full h-12 text-lg font-semibold"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>
          </CardContent>
        </Card>

        {/* Saved Notification */}
        {showSavedNotification && savedNote && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Note Saved to Cloud! ☁️</p>
                  <p className="text-sm text-green-600">
                    {format(new Date(), 'MMM dd, yyyy - h:mm a')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata Preview */}
        {noteText.trim() && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Note Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground mb-2">Content:</p>
                <p className="text-base">{noteText}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Time: {format(new Date(), 'MMM dd, yyyy - h:mm a')}</span>
                {geolocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location captured
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}