/**
 * Interface du repository de géolocalisation
 */

import { Location } from '../entities/weather';

export interface LocationRepository {
  /**
   * Récupère la position actuelle de l'utilisateur
   */
  getCurrentLocation(): Promise<Location>;

  /**
   * Récupère les informations de localisation à partir de coordonnées
   */
  getLocationFromCoordinates(latitude: number, longitude: number): Promise<Location>;
} 