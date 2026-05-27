'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

// Dynamic imports to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
// This component lets us fly the map to a new location imperatively
const FlyToLocation = dynamic(
  () => import('./map-fly-control').then((m) => m.FlyToLocation),
  { ssr: false }
);

function MapContent({ helpers, center, zoom = 13 }) {
  const [leafletIcon, setLeafletIcon] = useState(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:36px;height:36px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      setLeafletIcon(icon);
    });
  }, []);

  if (!leafletIcon) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-secondary/30 rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToLocation center={center} zoom={zoom} />
      {helpers.map((helper) =>
        helper.location ? (
          <Marker
            key={helper.id}
            position={[helper.location.lat, helper.location.lng]}
            icon={leafletIcon}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '120px' }}>
                <p style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{helper.name}</p>
                <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px 0' }}>{helper.profession}</p>
                <p style={{ color: '#f97316', fontSize: '13px', margin: 0 }}>⭐ {helper.rating}</p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

export function MapView({ helpers, center: initialCenter = [28.6139, 77.209], zoom = 13, showSearch = true }) {
  const [center, setCenter] = useState(initialCenter);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationLabel, setLocationLabel] = useState('');
  const debounceRef = useRef(null);

  // Fetch suggestions from Nominatim as user types
  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim() || q.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const selectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setCenter([lat, lon]);
    setLocationLabel(place.display_name.split(',').slice(0, 2).join(', '));
    setQuery(place.display_name.split(',').slice(0, 2).join(', '));
    setSuggestions([]);
  };

  const clearSearch = () => {
    setQuery('');
    setLocationLabel('');
    setSuggestions([]);
    setCenter(initialCenter);
  };

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      {/* Location Search Overlay */}
      {showSearch && (
        <div className="absolute top-3 left-3 right-3 z-[1000]">
          <div className="relative">
            <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-xl border border-border shadow-lg px-3 py-2">
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
              ) : (
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <input
                type="text"
                value={query}
                onChange={handleInput}
                placeholder="Search location (e.g. Mumbai, Delhi…)"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
              />
              {query && (
                <button onClick={clearSearch} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-xl overflow-hidden">
                {suggestions.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => selectSuggestion(place)}
                    className="w-full flex items-start gap-2 px-4 py-2.5 text-left hover:bg-secondary transition-colors border-b border-border last:border-0"
                  >
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {place.display_name.split(',').slice(0, 2).join(', ')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {place.display_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current location label */}
          {locationLabel && (
            <div className="flex items-center gap-1 mt-2 px-1">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-xs text-foreground/80 truncate">{locationLabel}</span>
            </div>
          )}
        </div>
      )}

      <MapContent helpers={helpers} center={center} zoom={zoom} />
    </div>
  );
}
