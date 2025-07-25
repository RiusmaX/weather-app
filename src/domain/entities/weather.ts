/**
 * Entités du domaine météo
 * Suivant les principes DDD (Domain Driven Design)
 */

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  region?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  location: Location;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  windSpeed: number;
  windDirection: number;
  condition: WeatherCondition;
  timestamp: Date;
}

export interface WeatherForecast {
  date: Date;
  temperature: {
    min: number;
    max: number;
  };
  condition: WeatherCondition;
  precipitationChance: number;
  windSpeed: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: WeatherForecast[];
  alerts?: WeatherAlert[];
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  startTime: Date;
  endTime: Date;
}

export interface MapLayerData {
  type: 'precipitation' | 'temperature' | 'wind' | 'clouds';
  data: number[][];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  timestamp: Date;
} 