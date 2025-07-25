/**
 * Use Case: Récupérer les données météo
 * Logique métier centrale de l'application
 */

import { WeatherRepository } from '../repositories/weather-repository';
import { LocationRepository } from '../repositories/location-repository';
import { WeatherData, Location } from '../entities/weather';

export class GetWeatherDataUseCase {
  constructor(
    private weatherRepository: WeatherRepository,
    private locationRepository: LocationRepository
  ) {}

  /**
   * Récupère les données météo pour la position actuelle
   */
  async execute(): Promise<WeatherData> {
    try {
      const currentLocation = await this.locationRepository.getCurrentLocation();
      return await this.weatherRepository.getWeatherData(currentLocation);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des données météo: ${error}`);
    }
  }

  /**
   * Récupère les données météo pour une localisation spécifique
   */
  async executeForLocation(location: Location): Promise<WeatherData> {
    try {
      return await this.weatherRepository.getWeatherData(location);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des données météo pour ${location.city}: ${error}`);
    }
  }
} 