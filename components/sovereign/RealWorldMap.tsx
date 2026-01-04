'use client';

import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import { Country } from '@/types/travel';
import L from 'leaflet';
import { useEffect } from 'react';

// Custom component to handle map view changes
const MapController = ({ selectedCountry }: { selectedCountry: Country | null }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedCountry) {
      map.flyTo([selectedCountry.lat, selectedCountry.lng], 5, {
        duration: 1.5
      });
    }
  }, [selectedCountry, map]);
  return null;
}

const createCustomIcon = (isVisited: boolean, isSelected: boolean, color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 14px; 
        height: 14px; 
        background-color: ${isVisited ? color : '#333'}; 
        border: 2px solid ${isSelected ? '#fff' : '#888'}; 
        border-radius: 50%;
        box-shadow: ${isVisited ? `0 0 ${isSelected ? '15px' : '5px'} ${color}` : 'none'};
        transition: all 0.3s ease;
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const REGION_COLORS: Record<string, string> = {
  'europe': '#4a9eff',
  'asia': '#ff6b6b',
  'africa': '#ffd700',
  'north-america': '#00ff88',
  'south-america': '#ff88ff',
  'oceania': '#88ffff',
  'antarctica': '#ffffff',
};

const RealWorldMap = ({ 
  countries, 
  visitedCodes, 
  onSelectCountry, 
  selectedCountry 
}: { 
  countries: Country[], 
  visitedCodes: string[], 
  onSelectCountry: (c: Country) => void,
  selectedCountry: Country | null
}) => {
  return (
    <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        minZoom={2}
        style={{ height: '100%', width: '100%', background: '#0a0a1a' }}
        scrollWheelZoom={true}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      <MapController selectedCountry={selectedCountry} />

      {countries.map(country => {
        const isVisited = visitedCodes.includes(country.code);
        const isSelected = selectedCountry?.code === country.code;
        const color = REGION_COLORS[country.region] || '#fff';
        
        return (
            <Marker 
                key={country.code} 
                position={[country.lat, country.lng]}
                icon={createCustomIcon(isVisited, isSelected, color)}
                eventHandlers={{
                    click: () => onSelectCountry(country),
                }}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -10]} 
                opacity={1}
                permanent={isSelected}
              >
                <span className="font-bold text-xs">{country.trinket.icon} {country.name}</span>
              </Tooltip>
            </Marker>
        )
      })}
    </MapContainer>
  );
}

export default RealWorldMap;
