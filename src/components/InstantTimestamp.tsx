import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronLeft, Clock, Copy, Check, Calendar, MapPin, Save, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { TimestampData } from '../types';
import { storageService } from '../services/storage';

interface InstantTimestampProps {
  onBack: () => void;
}



export function InstantTimestamp({ onBack }: InstantTimestampProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [geolocation, setGeolocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [savedTimestamp, setSavedTimestamp] = useState<TimestampData | null>(null);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Get geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setIsLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get location');
          setIsLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setIsLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatOptions = [
    {
      id: 'datetime-full',
      label: 'Full Date & Time',
      value: currentTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    {
      id: 'datetime-short',
      label: 'Short Date & Time',
      value: currentTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      id: 'date-only',
      label: 'Date Only',
      value: currentTime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    {
      id: 'time-only',
      label: 'Time Only',
      value: currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    {
      id: 'iso',
      label: 'ISO Format',
      value: currentTime.toISOString()
    },
    {
      id: 'unix',
      label: 'Unix Timestamp',
      value: Math.floor(currentTime.getTime() / 1000).toString()
    },
    {
      id: 'relative',
      label: 'Relative Time',
      value: 'Now'
    }
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(id));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const saveTimestamp = () => {
    const timestampData: TimestampData = {
      id: Date.now().toString(),
      type: 'timestamp',
      timestamp: new Date(),
      geolocation,
      formatOptions: [...formatOptions],
      createdAt: new Date()
    };

    // Save using storage service
    storageService.saveInstantData(timestampData);

    setSavedTimestamp(timestampData);
    setShowSavedNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 3000);
  };

  const getLocationDisplay = () => {
    if (isLocationLoading) {
      return <span className="text-muted-foreground">Getting location...</span>;
    }
    
    if (locationError) {
      return <span className="text-red-500">{locationError}</span>;
    }
    
    if (geolocation) {
      return (
        <span className="text-green-600">
          {geolocation.latitude.toFixed(6)}, {geolocation.longitude.toFixed(6)}
        </span>
      );
    }
    
    return <span className="text-muted-foreground">Location unavailable</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Instant Timestamp
          </h1>
          <p className="text-muted-foreground">Generate and save timestamps with location data</p>
        </div>
      </div>

      {/* Location Status */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Location:</span>
            {getLocationDisplay()}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="mb-6">
        <Button 
          onClick={saveTimestamp}
          className="w-full"
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Current Timestamp
        </Button>
      </div>

      {/* Saved Notification */}
      {showSavedNotification && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Timestamp saved! You can view it in the Notes screen.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formatOptions.map((option) => (
          <Card key={option.id} className="cursor-pointer active:scale-95 transition-transform">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-base">{option.label}</span>
                <div className="flex items-center gap-2">
                  {option.id === 'relative' && (
                    <Badge variant="secondary">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                      Live
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(option.value, option.id)}
                    className="h-8 w-8 p-0"
                  >
                    {copiedItems.has(option.id) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-muted/30 rounded-lg p-3 font-mono text-sm break-all cursor-pointer"
                onClick={() => copyToClipboard(option.value, option.id)}
              >
                {option.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Updates every second</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}