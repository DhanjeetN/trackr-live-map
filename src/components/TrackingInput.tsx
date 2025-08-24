import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TrackingInputProps {
  onTrack: (code: string) => void;
  isLoading?: boolean;
  error?: string;
}

const TrackingInput: React.FC<TrackingInputProps> = ({ onTrack, isLoading, error }) => {
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      onTrack(trackingCode.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Live Tracker</h1>
        <p className="text-muted-foreground">Enter your tracking code to see real-time location</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter tracking code..."
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            className="tracking-input text-center text-lg font-mono"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={!trackingCode.trim() || isLoading}
          className="tracking-button w-full py-3 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
              Tracking...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Track Location
            </>
          )}
        </Button>
      </form>

      {error && (
        <Alert className="mt-4 border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

export default TrackingInput;