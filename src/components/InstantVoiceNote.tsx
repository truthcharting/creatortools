import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Mic, MicOff, Play, Pause, Square, Check, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { VoiceNoteData } from '../types';
import { storageService } from '../services/storage';

interface InstantVoiceNoteProps {
  onBack: () => void;
}

export function InstantVoiceNote({ onBack }: InstantVoiceNoteProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [geolocation, setGeolocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveVoiceNote = () => {
    if (!audioBlob) return;

    const voiceNoteData: VoiceNoteData = {
      id: `voice-${Date.now()}`,
      type: 'voice',
      audioBlob: audioBlob,
      duration: recordingTime,
      timestamp: new Date(),
      geolocation,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    storageService.saveInstantData(voiceNoteData);
    setShowSavedNotification(true);
    
    // Clear recording after saving
    setTimeout(() => {
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
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
          <h1 className="text-xl font-bold">Instant Voice Note</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Status */}
        <div className="flex justify-center">
          {getLocationStatus()}
        </div>

        {/* Recording Interface */}
        <Card className="border-2 border-red-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mic className="h-5 w-5 text-red-600" />
              Voice Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Timer */}
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-red-600">
                {formatTime(recordingTime)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isRecording ? 'Recording...' : audioBlob ? 'Recording saved' : 'Ready to record'}
              </p>
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center gap-4">
              {!isRecording && !audioBlob && (
                <Button 
                  onClick={startRecording}
                  className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
                  disabled={isLocationLoading}
                >
                  <Mic className="h-8 w-8" />
                </Button>
              )}

              {isRecording && (
                <Button 
                  onClick={stopRecording}
                  className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <Square className="h-8 w-8" />
                </Button>
              )}

              {audioBlob && !isRecording && (
                <>
                  <Button 
                    onClick={isPlaying ? pauseRecording : playRecording}
                    className="h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  
                  <Button 
                    onClick={startRecording}
                    className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700"
                  >
                    <Mic className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Hidden audio element for playback */}
            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        {audioBlob && (
          <Card className="border-2 border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Save Voice Note</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={saveVoiceNote}
                className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
              >
                <Check className="h-5 w-5 mr-2" />
                Save Voice Note ({formatTime(recordingTime)})
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
                  <p className="font-semibold text-green-800">Voice Note Saved!</p>
                  <p className="text-sm text-green-600">
                    {format(new Date(), 'MMM dd, yyyy - h:mm a')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="border-dashed border-red-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Voice Recording</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Tap the microphone to start recording</p>
            <p>• Tap the square to stop recording</p>
            <p>• Use play/pause to review your recording</p>
            <p>• Voice notes include timestamp and location data</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}