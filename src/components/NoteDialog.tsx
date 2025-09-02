import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Note } from '../App';

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  note?: Note;
  onSave: (note: Note | undefined) => void;
}

export function NoteDialog({ isOpen, onClose, taskName, note, onSave }: NoteDialogProps) {
  const [noteText, setNoteText] = useState(note?.text || '');
  const [notePhoto, setNotePhoto] = useState(note?.photo || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNotePhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!noteText.trim() && !notePhoto) {
      onSave(undefined);
    } else {
      onSave({
        text: noteText.trim(),
        photo: notePhoto || undefined
      });
    }
    onClose();
  };

  const handleDelete = () => {
    onSave(undefined);
    onClose();
  };

  const resetForm = () => {
    setNoteText(note?.text || '');
    setNotePhoto(note?.photo || '');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const removePhoto = () => {
    setNotePhoto('');
  };

  const hasContent = noteText.trim() || notePhoto;
  const hasOriginalNote = note && (note.text || note.photo);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Note for "{taskName}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Text Note Section */}
          <div className="space-y-3">
            <Label htmlFor="note-text">Text Note</Label>
            <Textarea
              id="note-text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your notes here..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <Separator />

          {/* Photo Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Photo Attachment</Label>
              {!notePhoto && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
              )}
            </div>

            {notePhoto ? (
              <div className="relative">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <ImageWithFallback
                    src={notePhoto}
                    alt="Task note attachment"
                    className="max-w-full h-auto max-h-64 object-contain mx-auto rounded"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No photo attached</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Current Note Preview */}
          {hasContent && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Preview</Label>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  {noteText && (
                    <div>
                      <p className="text-sm">{noteText}</p>
                    </div>
                  )}
                  {notePhoto && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Photo attached
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {hasOriginalNote && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              Delete Note
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {hasContent ? 'Save Note' : 'Remove Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}