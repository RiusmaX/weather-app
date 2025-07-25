/**
 * Interface du repository météo
 * Abstraction pour l'accès aux données météo
 */

import { WeatherData, Location, MapLayerData } from '../entities/weather';

export interface WeatherRepository {
  /**
   * Récupère les données météo actuelles et les prévisions pour une localisation
   */
  getWeatherData(location: Location): Promise<WeatherData>;

  /**
   * Recherche des localisation par nom de ville
   */
  searchLocations(query: string): Promise<Location[]>;

  /**
   * Récupère les données de carte météo pour une région et un type de données
   */
  getMapLayerData(
    bounds: { north: number; south: number; east: number; west: number },
    layerType: 'precipitation' | 'temperature' | 'wind' | 'clouds'
  ): Promise<MapLayerData>;
} 