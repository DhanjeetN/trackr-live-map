import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface MapContainerProps {
  location?: Location;
  trackingCode?: string;
}

export interface MapRef {
  updateLocation: (location: Location) => void;
}

const MapContainer = forwardRef<MapRef, MapContainerProps>(({ location, trackingCode }, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    updateLocation: (newLocation: Location) => {
      if (mapRef.current && markerRef.current) {
        const latLng = L.latLng(newLocation.latitude, newLocation.longitude);
        
        // Smooth marker movement
        markerRef.current.setLatLng(latLng);
        
        // Center map on new location with smooth animation
        mapRef.current.flyTo(latLng, 15, {
          animate: true,
          duration: 1.5
        });

        // Update popup with timestamp
        markerRef.current.setPopupContent(
          `<div class="text-center">
            <strong>Tracking: ${trackingCode}</strong><br>
            <small>Updated: ${newLocation.timestamp.toLocaleTimeString()}</small>
          </div>`
        );
      }
    }
  }));

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([37.7749, -122.4194], 10); // Default to San Francisco

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapRef.current = map;

    // Initial location setup
    if (location) {
      const latLng = L.latLng(location.latitude, location.longitude);
      
      // Create custom marker icon with tracking colors
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: hsl(var(--location-marker));
            border: 3px solid white;
            box-shadow: 0 0 20px hsl(var(--location-marker) / 0.6);
            animation: pulse 2s infinite;
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);
      marker.bindPopup(
        `<div class="text-center">
          <strong>Tracking: ${trackingCode}</strong><br>
          <small>Updated: ${location.timestamp.toLocaleTimeString()}</small>
        </div>`
      );
      
      markerRef.current = marker;
      map.setView(latLng, 15);
    }

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="map-container w-full h-96 md:h-[500px] rounded-xl"
    />
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;