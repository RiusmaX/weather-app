/**
 * Hook pour gérer l'état et la logique météo
 * Couche de présentation - interface entre UI et use cases
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { WeatherData, Location } from '@/domain/entities/weather';
import { GetWeatherDataUseCase } from '@/domain/use-cases/get-weather-data';
import { SearchLocationsUseCase } from '@/domain/use-cases/search-locations';
import { OpenWeatherService } from '@/infrastructure/services/openweather-service';
import { GeolocationService } from '@/infrastructure/services/geolocation-service';

interface UseWeatherState {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  locations: Location[];
  isSearching: boolean;
  searchError: string | null;
  locationPermissionDenied: boolean;
}

interface UseWeatherActions {
  refreshWeather: () => Promise<void>;
  searchLocations: (query: string) => Promise<void>;
  selectLocation: (location: Location) => Promise<void>;
  clearError: () => void;
  requestLocationPermission: () => Promise<void>;
}

export type UseWeatherReturn = UseWeatherState & UseWeatherActions;

export function useWeather(): UseWeatherReturn {
  const [state, setState] = useState<UseWeatherState>({
    weatherData: null,
    isLoading: true,
    error: null,
    locations: [],
    isSearching: false,
    searchError: null,
    locationPermissionDenied: false,
  });

  // Mémoriser les services pour éviter la recréation à chaque render
  const services = useMemo(() => {
    const weatherService = new OpenWeatherService();
    const locationService = new GeolocationService();
    return {
      getWeatherDataUseCase: new GetWeatherDataUseCase(weatherService, locationService),
      searchLocationsUseCase: new SearchLocationsUseCase(weatherService),
    };
  }, []);

  const requestLocationPermission = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      locationPermissionDenied: false 
    }));
    
    try {
      const weatherData = await services.getWeatherDataUseCase.execute();
      setState(prev => ({ 
        ...prev, 
        weatherData, 
        isLoading: false,
        error: null,
        locationPermissionDenied: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      // Détecter si c'est un refus de géolocalisation
      const isPermissionDenied = errorMessage.includes('refusé') || 
                                errorMessage.includes('denied') ||
                                errorMessage.includes('PERMISSION_DENIED');
      
      setState(prev => ({ 
        ...prev, 
        error: isPermissionDenied 
          ? 'Géolocalisation refusée. Utilisez la recherche pour trouver votre ville.'
          : errorMessage,
        isLoading: false,
        locationPermissionDenied: isPermissionDenied
      }));
    }
  }, [services.getWeatherDataUseCase]);

  const refreshWeather = useCallback(async () => {
    await requestLocationPermission();
  }, [requestLocationPermission]);

  const searchLocations = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setState(prev => ({ ...prev, locations: [], searchError: null }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true, searchError: null }));
    
    try {
      const locations = await services.searchLocationsUseCase.execute(query);
      setState(prev => ({ 
        ...prev, 
        locations, 
        isSearching: false,
        searchError: null 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        searchError: error instanceof Error ? error.message : 'Erreur de recherche',
        isSearching: false,
        locations: []
      }));
    }
  }, [services.searchLocationsUseCase]);

  const selectLocation = useCallback(async (location: Location) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const weatherData = await services.getWeatherDataUseCase.executeForLocation(location);
      setState(prev => ({ 
        ...prev, 
        weatherData, 
        isLoading: false,
        error: null,
        locations: [], // Nettoyer la liste de recherche
        locationPermissionDenied: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      }));
    }
  }, [services.getWeatherDataUseCase]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null, searchError: null }));
  }, []);

  // Tentative automatique de géolocalisation au montage - UNE SEULE FOIS
  useEffect(() => {
    let isMounted = true;

    const attemptGeolocation = async () => {
      // Vérifier d'abord si la géolocalisation est supportée
      if (!navigator.geolocation) {
        if (isMounted) {
          setState(prev => ({ 
            ...prev, 
            error: 'Géolocalisation non supportée. Utilisez la recherche pour trouver votre ville.',
            isLoading: false,
            locationPermissionDenied: true
          }));
        }
        return;
      }

      // Tentative de géolocalisation automatique
      try {
        const weatherData = await services.getWeatherDataUseCase.execute();
        if (isMounted) {
          setState(prev => ({ 
            ...prev, 
            weatherData, 
            isLoading: false,
            error: null,
            locationPermissionDenied: false
          }));
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
          const isPermissionDenied = errorMessage.includes('refusé') || 
                                    errorMessage.includes('denied') ||
                                    errorMessage.includes('PERMISSION_DENIED');
          
          setState(prev => ({ 
            ...prev, 
            error: isPermissionDenied 
              ? 'Géolocalisation refusée. Utilisez la recherche pour trouver votre ville.'
              : errorMessage,
            isLoading: false,
            locationPermissionDenied: isPermissionDenied
          }));
        }
      }
    };

    attemptGeolocation();

    // Nettoyage pour éviter les mises à jour d'état sur un composant démonté
    return () => {
      isMounted = false;
    };
  }, []); // Dépendances vides - ne s'exécute qu'une seule fois au montage

  return {
    ...state,
    refreshWeather,
    searchLocations,
    selectLocation,
    clearError,
    requestLocationPermission,
  };
} 