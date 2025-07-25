/**
 * Configuration des APIs externes
 */

export const API_CONFIG = {
  OPENWEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_URL: 'https://api.openweathermap.org/geo/1.0',
    MAP_URL: 'https://tile.openweathermap.org/map',
    API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '',
  },
  GEOCODING: {
    BASE_URL: 'https://api.openweathermap.org/geo/1.0',
  },
} as const;

export const DEFAULT_SETTINGS = {
  UNITS: 'metric', // metric, imperial, standard
  LANGUAGE: 'fr',
  FORECAST_DAYS: 5,
} as const; 