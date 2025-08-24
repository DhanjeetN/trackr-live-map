import React, { useState, useRef, useCallback } from 'react';
import TrackingInput from '@/components/TrackingInput';
import MapContainer, { MapRef } from '@/components/MapContainer';
import StatusDisplay from '@/components/StatusDisplay';
import { useToast } from '@/hooks/use-toast';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

const Index = () => {
  const [trackingCode, setTrackingCode] = useState<string>('');
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const { toast } = useToast();

  // Simulate real-time location updates (this would connect to Supabase in production)
  const simulateLocationUpdates = useCallback((code: string) => {
    // Demo data for testing the interface
    const demoLocations = [
      { lat: 37.7749, lng: -122.4194 }, // San Francisco
      { lat: 37.7849, lng: -122.4094 },
      { lat: 37.7949, lng: -122.3994 },
      { lat: 37.8049, lng: -122.3894 },
    ];

    let index = 0;
    const updateInterval = setInterval(() => {
      if (index < demoLocations.length) {
        const newLocation: Location = {
          latitude: demoLocations[index].lat,
          longitude: demoLocations[index].lng,
          timestamp: new Date(),
        };
        
        setLocation(newLocation);
        mapRef.current?.updateLocation(newLocation);
        index++;
      } else {
        // Loop back to first location
        index = 0;
      }
    }, 3000);

    return () => clearInterval(updateInterval);
  }, []);

  const handleTrack = async (code: string) => {
    setError('');
    setIsLoading(true);
    
    try {
      // In a real app, this would connect to Supabase
      // For now, we'll simulate the tracking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: accept any code that starts with "DEMO"
      if (code.toUpperCase().startsWith('DEMO')) {
        setTrackingCode(code);
        
        // Initial location
        const initialLocation: Location = {
          latitude: 37.7749,
          longitude: -122.4194,
          timestamp: new Date(),
        };
        
        setLocation(initialLocation);
        setIsConnected(true);
        
        // Start simulating updates
        const cleanup = simulateLocationUpdates(code);
        
        toast({
          title: "Tracking Started",
          description: `Now tracking ${code} in real-time`,
        });
        
        // Store cleanup function for later use
        return cleanup;
      } else {
        throw new Error('Invalid tracking code. Try a code starting with "DEMO"');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {!location ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <TrackingInput 
              onTrack={handleTrack}
              isLoading={isLoading}
              error={error}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MapContainer 
                ref={mapRef}
                location={location}
                trackingCode={trackingCode}
              />
            </div>
            <div className="space-y-4">
              <StatusDisplay 
                trackingCode={trackingCode}
                location={location}
                isConnected={isConnected}
              />
              <TrackingInput 
                onTrack={handleTrack}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
