import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FileText, Image, Clock, User, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { noteService, photoService } from '../services/supabaseService';
import type { Note, Photo } from '../types/database';

export function SupabaseNotesScreen() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'photos'>('notes');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [notesData, photosData] = await Promise.all([
        noteService.getAll(user.id),
        photoService.getAll(user.id)
      ]);
      
      setNotes(notesData);
      setPhotos(photosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return;
    
    try {
      await noteService.delete(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const deletePhoto = async (photoId: string, filePath: string) => {
    if (!user) return;
    
    try {
      await photoService.delete(photoId, filePath);
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-safe pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Your Notes & Photos</h1>
          <p className="text-muted-foreground">All your content stored securely in the cloud</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
          <Button
            variant={activeTab === 'notes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notes')}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Notes ({notes.length})
          </Button>
          <Button
            variant={activeTab === 'photos' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('photos')}
            className="flex-1"
          >
            <Image className="h-4 w-4 mr-2" />
            Photos ({photos.length})
          </Button>
        </div>

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
                  <p className="text-muted-foreground">Create your first note using the Instant Note tool</p>
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(note.created_at), 'MMM dd, yyyy - h:mm a')}
                          </div>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>Tags:</span>
                              {note.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            {photos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
                  <p className="text-muted-foreground">Capture your first photo using the Instant Pic tool</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={photo.file_path}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{photo.title}</h3>
                          {photo.description && (
                            <p className="text-sm text-muted-foreground mt-1">{photo.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePhoto(photo.id, photo.file_path)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{format(new Date(photo.created_at), 'MMM dd, yyyy')}</span>
                        <span>{(photo.file_size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      
                      {photo.tags && photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {photo.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
