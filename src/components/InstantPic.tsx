import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Camera, Check, X, Download, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { PhotoData } from '../types';
import { storageService } from '../services/storage';

interface InstantPicProps {
  onBack: () => void;
}

export function InstantPic({ onBack }: InstantPicProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [geolocation, setGeolocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const capturePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newPhotos.push(e.target.result as string);
              setPhotos(prev => [...prev, ...newPhotos]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const savePhotos = () => {
    if (photos.length === 0) return;

    const photoData: PhotoData = {
      id: `photo-${Date.now()}`,
      type: 'photo',
      photos: photos,
      timestamp: new Date(),
      geolocation,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    storageService.saveInstantData(photoData);
    setShowSavedNotification(true);
    
    // Clear photos after saving
    setTimeout(() => {
      setPhotos([]);
      setShowSavedNotification(false);
    }, 2000);
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
          <h1 className="text-xl font-bold">Instant Pic</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Status */}
        <div className="flex justify-center">
          {getLocationStatus()}
        </div>

        {/* Camera Interface */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Capture Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Button */}
            <Button 
              onClick={capturePhoto}
              className="w-full h-16 text-lg font-semibold"
              disabled={isCapturing}
            >
              <Camera className="h-6 w-6 mr-2" />
              {isCapturing ? 'Capturing...' : 'Take Photo'}
            </Button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Photo Count */}
            {photos.length > 0 && (
              <div className="text-center">
                <Badge variant="outline" className="text-base px-4 py-2">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Preview */}
        {photos.length > 0 && (
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Captured Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Captured photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <Button 
                onClick={savePhotos}
                className="w-full h-12 text-lg font-semibold"
              >
                <Download className="h-5 w-5 mr-2" />
                Save Photos ({photos.length})
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Saved Notification */}
        {showSavedNotification && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Photos Saved!</p>
                  <p className="text-sm text-green-600">
                    {format(new Date(), 'MMM dd, yyyy - h:mm a')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Tap "Take Photo" to capture images</p>
            <p>• You can capture multiple photos</p>
            <p>• Photos are automatically saved with timestamp and location</p>
            <p>• View all captured photos in the Notes screen</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}