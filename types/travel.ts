// Travel types for Terra Nova

export interface Country {
  code: string;          // ISO 3166-1 alpha-2 code
  name: string;
  region: 'europe' | 'asia' | 'africa' | 'north-america' | 'south-america' | 'oceania' | 'antarctica';
  lat: number;
  lng: number;
  trinket: TravelTrinket;
  specialEffect?: string; // e.g., "aurora" for Norway
}

export interface TravelTrinket {
  id: string;
  name: string;
  icon: string;           // Emoji or sprite key
  description: string;
}

export interface TravelDream {
  id: string;
  destination: string;    // Country code
  estimatedCost: number;  // in EUR
  fundedAmount: number;   // Current savings toward this trip
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  targetDate?: Date;
}

export interface TravelStats {
  visitedCountries: string[];  // Array of country codes
  totalCountries: number;
  trinkets: string[];          // Collected trinket IDs
  freedomProgress: number;     // 0-100 percentage toward travel goals
}

// Sample countries with coordinates for the world map
export const WORLD_COUNTRIES: Country[] = [
  // Europe
  { code: 'DE', name: 'Germany', region: 'europe', lat: 51.1657, lng: 10.4515, trinket: { id: 'trinket-de', name: 'Beer Stein', icon: '🍺', description: 'A traditional German beer mug' } },
  { code: 'FR', name: 'France', region: 'europe', lat: 46.2276, lng: 2.2137, trinket: { id: 'trinket-fr', name: 'Eiffel Tower', icon: '🗼', description: 'A miniature Eiffel Tower' } },
  { code: 'IT', name: 'Italy', region: 'europe', lat: 41.8719, lng: 12.5674, trinket: { id: 'trinket-it', name: 'Colosseum Model', icon: '🏛️', description: 'A tiny replica of the Roman Colosseum' } },
  { code: 'ES', name: 'Spain', region: 'europe', lat: 40.4637, lng: -3.7492, trinket: { id: 'trinket-es', name: 'Flamenco Fan', icon: '💃', description: 'A colorful Spanish fan' } },
  { code: 'GB', name: 'United Kingdom', region: 'europe', lat: 55.3781, lng: -3.4360, trinket: { id: 'trinket-gb', name: 'Big Ben Clock', icon: '🕐', description: 'A miniature Big Ben' } },
  { code: 'NL', name: 'Netherlands', region: 'europe', lat: 52.1326, lng: 5.2913, trinket: { id: 'trinket-nl', name: 'Wooden Clog', icon: '👞', description: 'Traditional Dutch wooden shoe' } },
  { code: 'CH', name: 'Switzerland', region: 'europe', lat: 46.8182, lng: 8.2275, trinket: { id: 'trinket-ch', name: 'Swiss Watch', icon: '⌚', description: 'A precision timepiece' } },
  { code: 'AT', name: 'Austria', region: 'europe', lat: 47.5162, lng: 14.5501, trinket: { id: 'trinket-at', name: 'Music Box', icon: '🎵', description: 'Plays a Mozart melody' } },
  { code: 'NO', name: 'Norway', region: 'europe', lat: 60.4720, lng: 8.4689, trinket: { id: 'trinket-no', name: 'Viking Helmet', icon: '⚔️', description: 'Miniature Viking helm' }, specialEffect: 'aurora' },
  { code: 'SE', name: 'Sweden', region: 'europe', lat: 60.1282, lng: 18.6435, trinket: { id: 'trinket-se', name: 'Dala Horse', icon: '🎠', description: 'Traditional painted horse' } },
  { code: 'PT', name: 'Portugal', region: 'europe', lat: 39.3999, lng: -8.2245, trinket: { id: 'trinket-pt', name: 'Azulejo Tile', icon: '🔷', description: 'Hand-painted ceramic tile' } },
  { code: 'GR', name: 'Greece', region: 'europe', lat: 39.0742, lng: 21.8243, trinket: { id: 'trinket-gr', name: 'Parthenon Pillar', icon: '🏛️', description: 'Marble column replica' } },
  { code: 'PL', name: 'Poland', region: 'europe', lat: 51.9194, lng: 19.1451, trinket: { id: 'trinket-pl', name: 'Amber Jewelry', icon: '💎', description: 'Baltic amber pendant' } },
  { code: 'CZ', name: 'Czech Republic', region: 'europe', lat: 49.8175, lng: 15.4730, trinket: { id: 'trinket-cz', name: 'Crystal Glass', icon: '🥂', description: 'Bohemian crystal' } },

  // Asia
  { code: 'JP', name: 'Japan', region: 'asia', lat: 36.2048, lng: 138.2529, trinket: { id: 'trinket-jp', name: 'Sushi Plate', icon: '🍣', description: 'A tiny sushi platter' } },
  { code: 'CN', name: 'China', region: 'asia', lat: 35.8617, lng: 104.1954, trinket: { id: 'trinket-cn', name: 'Dragon Figurine', icon: '🐉', description: 'Golden dragon statuette' } },
  { code: 'KR', name: 'South Korea', region: 'asia', lat: 35.9078, lng: 127.7669, trinket: { id: 'trinket-kr', name: 'K-pop Album', icon: '💿', description: 'Limited edition album' } },
  { code: 'TH', name: 'Thailand', region: 'asia', lat: 15.8700, lng: 100.9925, trinket: { id: 'trinket-th', name: 'Golden Buddha', icon: '🙏', description: 'Small Buddha statue' } },
  { code: 'VN', name: 'Vietnam', region: 'asia', lat: 14.0583, lng: 108.2772, trinket: { id: 'trinket-vn', name: 'Conical Hat', icon: '👒', description: 'Traditional nón lá' } },
  { code: 'ID', name: 'Indonesia', region: 'asia', lat: -0.7893, lng: 113.9213, trinket: { id: 'trinket-id', name: 'Batik Fabric', icon: '🎨', description: 'Hand-dyed cloth' } },
  { code: 'SG', name: 'Singapore', region: 'asia', lat: 1.3521, lng: 103.8198, trinket: { id: 'trinket-sg', name: 'Merlion', icon: '🦁', description: 'The iconic half-lion' } },
  { code: 'IN', name: 'India', region: 'asia', lat: 20.5937, lng: 78.9629, trinket: { id: 'trinket-in', name: 'Taj Mahal Model', icon: '🕌', description: 'Marble monument replica' } },
  { code: 'AE', name: 'UAE', region: 'asia', lat: 23.4241, lng: 53.8478, trinket: { id: 'trinket-ae', name: 'Burj Khalifa', icon: '🏙️', description: 'Miniature skyscraper' } },
  { code: 'TR', name: 'Turkey', region: 'asia', lat: 38.9637, lng: 35.2433, trinket: { id: 'trinket-tr', name: 'Evil Eye Charm', icon: '🧿', description: 'Protective amulet' } },

  // Americas
  { code: 'US', name: 'United States', region: 'north-america', lat: 37.0902, lng: -95.7129, trinket: { id: 'trinket-us', name: 'Statue of Liberty', icon: '🗽', description: 'Lady Liberty replica' } },
  { code: 'CA', name: 'Canada', region: 'north-america', lat: 56.1304, lng: -106.3468, trinket: { id: 'trinket-ca', name: 'Maple Leaf', icon: '🍁', description: 'Golden maple leaf' } },
  { code: 'MX', name: 'Mexico', region: 'north-america', lat: 23.6345, lng: -102.5528, trinket: { id: 'trinket-mx', name: 'Sombrero', icon: '🎩', description: 'Colorful sombrero' } },
  { code: 'BR', name: 'Brazil', region: 'south-america', lat: -14.2350, lng: -51.9253, trinket: { id: 'trinket-br', name: 'Christ the Redeemer', icon: '✝️', description: 'Famous statue replica' } },
  { code: 'AR', name: 'Argentina', region: 'south-america', lat: -38.4161, lng: -63.6167, trinket: { id: 'trinket-ar', name: 'Tango Shoes', icon: '👠', description: 'Red dancing shoes' } },
  { code: 'PE', name: 'Peru', region: 'south-america', lat: -9.1900, lng: -75.0152, trinket: { id: 'trinket-pe', name: 'Machu Picchu Stone', icon: '🗿', description: 'Ancient Incan relic' } },

  // Africa
  { code: 'EG', name: 'Egypt', region: 'africa', lat: 26.8206, lng: 30.8025, trinket: { id: 'trinket-eg', name: 'Pyramid Figurine', icon: '🏜️', description: 'Golden pyramid' } },
  { code: 'MA', name: 'Morocco', region: 'africa', lat: 31.7917, lng: -7.0926, trinket: { id: 'trinket-ma', name: 'Tagine Pot', icon: '🫕', description: 'Traditional cooking pot' } },
  { code: 'ZA', name: 'South Africa', region: 'africa', lat: -30.5595, lng: 22.9375, trinket: { id: 'trinket-za', name: 'Safari Binoculars', icon: '🔭', description: 'Wildlife watching gear' } },
  { code: 'KE', name: 'Kenya', region: 'africa', lat: -0.0236, lng: 37.9062, trinket: { id: 'trinket-ke', name: 'Masai Beads', icon: '📿', description: 'Colorful beaded jewelry' } },

  // Oceania
  { code: 'AU', name: 'Australia', region: 'oceania', lat: -25.2744, lng: 133.7751, trinket: { id: 'trinket-au', name: 'Kangaroo Plush', icon: '🦘', description: 'Cuddly kangaroo' } },
  { code: 'NZ', name: 'New Zealand', region: 'oceania', lat: -40.9006, lng: 174.8860, trinket: { id: 'trinket-nz', name: 'Kiwi Bird', icon: '🥝', description: 'Native bird figurine' } },
  { code: 'FJ', name: 'Fiji', region: 'oceania', lat: -17.7134, lng: 178.0650, trinket: { id: 'trinket-fj', name: 'Flower Lei', icon: '🌺', description: 'Island flower necklace' } },

  // Antarctica
  { code: 'AQ', name: 'Antarctica', region: 'antarctica', lat: -75.250973, lng: -0.071389, trinket: { id: 'trinket-aq', name: 'Penguin', icon: '🐧', description: 'Emperor penguin' } },
];

// Get country by code
export const getCountryByCode = (code: string): Country | undefined => {
  return WORLD_COUNTRIES.find(c => c.code === code);
};

// Get all regions
export const REGIONS = ['europe', 'asia', 'africa', 'north-america', 'south-america', 'oceania', 'antarctica'] as const;

// Calculate travel progress
export const calculateFreedomProgress = (
  capital: number, 
  travelDreams: TravelDream[]
): number => {
  const totalCost = travelDreams.reduce((sum, d) => sum + d.estimatedCost, 0);
  if (totalCost === 0) return 100;
  const funded = travelDreams.reduce((sum, d) => sum + d.fundedAmount, 0);
  return Math.min(Math.round((funded / totalCost) * 100), 100);
};
