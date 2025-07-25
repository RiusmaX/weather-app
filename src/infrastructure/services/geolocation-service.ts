/**
 * Service de géolocalisation
 * Implémentation du LocationRepository
 */

import { LocationRepository } from '@/domain/repositories/location-repository';
import { Location } from '@/domain/entities/weather';
import { API_CONFIG } from '../config/api-config';
import axios from 'axios';

interface ReverseGeocodingResponse {
  name: string;
  local_names?: { [key: string]: string };
  country: string;
  state?: string;
}

export class GeolocationService implements LocationRepository {
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GEOLOCATION_NOT_SUPPORTED: La géolocalisation n\'est pas supportée par ce navigateur.'));
        return;
      }

      // Vérifier d'abord les permissions si l'API est disponible
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'denied') {
            reject(new Error('PERMISSION_DENIED: L\'accès à la géolocalisation a été refusé.'));
            return;
          }
        }).catch(() => {
          // Continuer même si la vérification des permissions échoue
        });
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log(`Géolocalisation réussie: ${latitude}, ${longitude}`);
            const location = await this.getLocationFromCoordinates(latitude, longitude);
            resolve(location);
          } catch (error) {
            reject(new Error(`Erreur lors de la récupération de la localisation: ${error}`));
          }
        },
        (error) => {
          let errorMessage = 'Erreur de géolocalisation inconnue.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'PERMISSION_DENIED: L\'accès à la géolocalisation a été refusé par l\'utilisateur.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'POSITION_UNAVAILABLE: Les informations de localisation ne sont pas disponibles.';
              break;
            case error.TIMEOUT:
              errorMessage = 'TIMEOUT: Délai d\'attente dépassé pour la géolocalisation.';
              break;
          }
          
          console.warn('Erreur de géolocalisation:', errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Augmenter le timeout à 15 secondes
          maximumAge: 300000, // Réduire à 5 minutes pour des données plus fraîches
        }
      );
    });
  }

  async getLocationFromCoordinates(latitude: number, longitude: number): Promise<Location> {
    try {
      const response = await axios.get<ReverseGeocodingResponse[]>(
        `${API_CONFIG.GEOCODING.BASE_URL}/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            limit: 1,
            appid: API_CONFIG.OPENWEATHER.API_KEY,
          },
        }
      );

      if (response.data.length === 0) {
        throw new Error('Aucune localisation trouvée pour ces coordonnées.');
      }

      const data = response.data[0];
      
      return {
        latitude,
        longitude,
        city: data.name,
        country: data.country,
        region: data.state,
      };
    } catch (error) {
      throw new Error(`Erreur lors de la géocodage inverse: ${error}`);
    }
  }
} 