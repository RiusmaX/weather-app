/**
 * Implémentation du service OpenWeatherMap
 * Infrastructure layer - accès aux données externes
 */

import axios, { AxiosInstance } from 'axios';
import { WeatherRepository } from '@/domain/repositories/weather-repository';
import { WeatherData, Location, MapLayerData, CurrentWeather, WeatherForecast } from '@/domain/entities/weather';
import { API_CONFIG, DEFAULT_SETTINGS } from '../config/api-config';

interface OpenWeatherResponse {
  coord: { lat: number; lon: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  uvi?: number;
  dt: number;
  sys: {
    country: string;
  };
  name: string;
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
    wind: {
      speed: number;
    };
  }>;
}

interface GeocodingResponse {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export class OpenWeatherService implements WeatherRepository {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour gérer les erreurs de manière cohérente
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new Error('Clé API invalide. Veuillez vérifier votre configuration.');
        }
        if (error.response?.status === 404) {
          throw new Error('Localisation non trouvée.');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
        }
        throw new Error(`Erreur API: ${error.message}`);
      }
    );
  }

  async getWeatherData(location: Location): Promise<WeatherData> {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        this.getCurrentWeather(location),
        this.getForecast(location),
      ]);

      return {
        current: currentResponse,
        forecast: forecastResponse,
        alerts: [], // OpenWeatherMap alerts nécessitent un abonnement payant
      };
    } catch (error) {
      throw new Error(`Impossible de récupérer les données météo: ${error}`);
    }
  }

  private async getCurrentWeather(location: Location): Promise<CurrentWeather> {
    const response = await this.api.get<OpenWeatherResponse>(
      `${API_CONFIG.OPENWEATHER.BASE_URL}/weather`,
      {
        params: {
          lat: location.latitude,
          lon: location.longitude,
          appid: API_CONFIG.OPENWEATHER.API_KEY,
          units: DEFAULT_SETTINGS.UNITS,
          lang: DEFAULT_SETTINGS.LANGUAGE,
        },
      }
    );

    const data = response.data;
    
    return {
      location,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convertir en km
      uvIndex: data.uvi || 0,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convertir m/s en km/h
      windDirection: data.wind.deg,
      condition: {
        id: data.weather[0].id,
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      timestamp: new Date(data.dt * 1000),
    };
  }

  private async getForecast(location: Location): Promise<WeatherForecast[]> {
    const response = await this.api.get<OpenWeatherForecastResponse>(
      `${API_CONFIG.OPENWEATHER.BASE_URL}/forecast`,
      {
        params: {
          lat: location.latitude,
          lon: location.longitude,
          appid: API_CONFIG.OPENWEATHER.API_KEY,
          units: DEFAULT_SETTINGS.UNITS,
          lang: DEFAULT_SETTINGS.LANGUAGE,
        },
      }
    );

    // Grouper les prévisions par jour
    const dailyForecasts = new Map<string, WeatherForecast>();
    
    response.data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyForecasts.has(dateKey)) {
        dailyForecasts.set(dateKey, {
          date,
          temperature: {
            min: Math.round(item.main.temp_min),
            max: Math.round(item.main.temp_max),
          },
          condition: {
            id: item.weather[0].id,
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          },
          precipitationChance: Math.round(item.pop * 100),
          windSpeed: Math.round(item.wind.speed * 3.6),
        });
      } else {
        // Mettre à jour les températures min/max
        const existing = dailyForecasts.get(dateKey)!;
        existing.temperature.min = Math.min(existing.temperature.min, Math.round(item.main.temp_min));
        existing.temperature.max = Math.max(existing.temperature.max, Math.round(item.main.temp_max));
      }
    });

    return Array.from(dailyForecasts.values()).slice(0, DEFAULT_SETTINGS.FORECAST_DAYS);
  }

  async searchLocations(query: string): Promise<Location[]> {
    try {
      const response = await this.api.get<GeocodingResponse[]>(
        `${API_CONFIG.GEOCODING.BASE_URL}/direct`,
        {
          params: {
            q: query,
            limit: 5,
            appid: API_CONFIG.OPENWEATHER.API_KEY,
          },
        }
      );

      return response.data.map((item) => ({
        latitude: item.lat,
        longitude: item.lon,
        city: item.name,
        country: item.country,
        region: item.state,
      }));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de localisation: ${error}`);
    }
  }

  async getMapLayerData(
    bounds: { north: number; south: number; east: number; west: number },
    layerType: 'precipitation' | 'temperature' | 'wind' | 'clouds'
  ): Promise<MapLayerData> {
    // Implémentation simplifiée - pour une version complète, 
    // il faudrait utiliser l'API de cartes météo d'OpenWeatherMap
    return {
      type: layerType,
      data: [], // Données de carte vides pour l'instant
      bounds,
      timestamp: new Date(),
    };
  }
} 