import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Signal } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface StatusDisplayProps {
  trackingCode: string;
  location: Location;
  isConnected: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ trackingCode, location, isConnected }) => {
  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Tracking Status</h3>
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className={isConnected ? "bg-tracking-status-success" : "bg-tracking-status-error"}
          >
            <Signal className="w-3 h-3 mr-1" />
            {isConnected ? "Live" : "Offline"}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-mono">{trackingCode}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>Updated {getTimeAgo(location.timestamp)}</span>
          </div>
          
          <div className="text-xs text-muted-foreground font-mono">
            {formatCoordinates(location.latitude, location.longitude)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatusDisplay;