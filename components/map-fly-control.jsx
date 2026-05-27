'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

/**
 * An internal Leaflet control that smoothly flies the map
 * to a new center whenever the `center` prop changes.
 */
export function FlyToLocation({ center, zoom = 13 }) {
  const map = useMap();

  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);

  return null;
}
