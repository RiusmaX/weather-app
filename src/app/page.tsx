'use client';

/**
 * Page principale de l'application météo
 * Point d'entrée de l'interface utilisateur
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeather } from '@/presentation/hooks/use-weather';
import { WeatherCard } from '@/presentation/components/weather-card';
import { ForecastCard } from '@/presentation/components/forecast-card';
import { LocationSearch } from '@/presentation/components/location-search';
import { WeatherMap } from '@/presentation/components/weather-map';
import { RefreshCw, AlertTriangle, Cloud, Sun, MapPin } from 'lucide-react';

export default function HomePage() {
  const {
    weatherData,
    isLoading,
    error,
    locations,
    isSearching,
    searchError,
    locationPermissionDenied,
    refreshWeather,
    searchLocations,
    selectLocation,
    clearError,
    requestLocationPermission,
  } = useWeather();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Cloud className="h-8 w-8 text-blue-500" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MétéoIA
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <LocationSearch
                onSearch={searchLocations}
                onSelect={selectLocation}
                locations={locations}
                isSearching={isSearching}
                searchError={searchError}
                className="hidden sm:block"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshWeather}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
              </Button>
            </div>
          </div>
          
          {/* Recherche mobile */}
          <div className="mt-4 sm:hidden">
            <LocationSearch
              onSearch={searchLocations}
              onSelect={selectLocation}
              locations={locations}
              isSearching={isSearching}
              searchError={searchError}
            />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Gestion des erreurs */}
        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={clearError}
                className="ml-4"
              >
                Fermer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* État de chargement */}
        {isLoading && !weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-12 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="w-full">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Affichage des données météo */}
        {weatherData && !isLoading && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherCard 
                weather={weatherData.current}
                className="lg:sticky lg:top-8"
              />
              
              <ForecastCard 
                forecasts={weatherData.forecast}
              />
            </div>
            
            {/* Carte météo */}
            <WeatherMap 
              location={weatherData.current.location}
              className="w-full"
            />
          </div>
        )}

        {/* État vide */}
        {!weatherData && !isLoading && (
          <div className="text-center py-12">
            {locationPermissionDenied ? (
              <>
                <MapPin className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Localisation requise</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Pour obtenir des prévisions personnalisées, autorisez la géolocalisation ou recherchez votre ville manuellement.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Button 
                    onClick={requestLocationPermission} 
                    className="flex items-center gap-2"
                    variant="default"
                  >
                    <MapPin className="h-4 w-4" />
                    Autoriser la géolocalisation
                  </Button>
                  <div className="text-sm text-muted-foreground">ou</div>
                  <div className="text-sm text-muted-foreground">
                    Utilisez la recherche ci-dessus pour trouver votre ville
                  </div>
                </div>
                
                {/* Suggestions de villes populaires */}
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium mb-4 text-muted-foreground">Ou choisissez parmi ces villes populaires :</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[
                      { city: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
                      { city: 'Lyon', country: 'FR', lat: 45.7640, lon: 4.8357 },
                      { city: 'Marseille', country: 'FR', lat: 43.2965, lon: 5.3698 },
                      { city: 'Toulouse', country: 'FR', lat: 43.6047, lon: 1.4442 },
                      { city: 'Nice', country: 'FR', lat: 43.7102, lon: 7.2620 },
                      { city: 'Bordeaux', country: 'FR', lat: 44.8378, lon: -0.5792 },
                      { city: 'Lille', country: 'FR', lat: 50.6292, lon: 3.0573 },
                      { city: 'Strasbourg', country: 'FR', lat: 48.5734, lon: 7.7521 }
                    ].map((city) => (
                      <Button
                        key={city.city}
                        variant="outline"
                        size="sm"
                        onClick={() => selectLocation({
                          latitude: city.lat,
                          longitude: city.lon,
                          city: city.city,
                          country: city.country,
                        })}
                        className="text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {city.city}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Sun className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Bienvenue sur MétéoIA</h2>
                <p className="text-muted-foreground mb-6">
                  Recherchez une ville ou autorisez la géolocalisation pour commencer
                </p>
                <Button onClick={refreshWeather} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Détecter ma position
                </Button>
              </>
            )}
          </div>
        )}

        {/* Informations supplémentaires */}
        {weatherData && (
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Données fournies par{' '}
              <a 
                href="https://openweathermap.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                OpenWeatherMap
              </a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
