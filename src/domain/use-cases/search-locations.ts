/**
 * Use Case: Rechercher des localisations
 */

import { WeatherRepository } from '../repositories/weather-repository';
import { Location } from '../entities/weather';

export class SearchLocationsUseCase {
  constructor(private weatherRepository: WeatherRepository) {}

  /**
   * Recherche des localisations par nom
   */
  async execute(query: string): Promise<Location[]> {
    if (query.trim().length < 2) {
      return [];
    }

    try {
      return await this.weatherRepository.searchLocations(query);
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de localisation: ${error}`);
    }
  }
} 