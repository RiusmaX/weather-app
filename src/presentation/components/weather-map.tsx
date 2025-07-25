/**
 * Composant de carte météo interactive avec filtres avancés
 * Utilise Leaflet pour afficher les données météo sur une carte
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Location } from '@/domain/entities/weather';
import { 
  Map, 
  Layers, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye, 
  Settings,
  Info,
  ToggleLeft,
  ToggleRight,
  Sliders
} from 'lucide-react';

// Import dynamique de Leaflet pour éviter les erreurs SSR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let L: any = null;
let leafletLoaded = false;

interface WeatherMapProps {
  location: Location;
  className?: string;
}

type MapLayer = 'precipitation' | 'temperature' | 'wind' | 'clouds';

interface LayerState {
  isActive: boolean;
  opacity: number;
}

export function WeatherMap({ location, className }: WeatherMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerInstancesRef = useRef<Record<MapLayer, any>>({
    precipitation: null,
    temperature: null,
    wind: null,
    clouds: null
  });
  
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadingMap, setLoadingMap] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [layerStates, setLayerStates] = useState<Record<MapLayer, LayerState>>({
    precipitation: { isActive: true, opacity: 0.7 },
    temperature: { isActive: false, opacity: 0.6 },
    wind: { isActive: false, opacity: 0.8 },
    clouds: { isActive: false, opacity: 0.5 }
  });

  // Charger Leaflet dynamiquement
  useEffect(() => {
    if (!leafletLoaded) {
      import('leaflet').then((leaflet) => {
        L = leaflet.default;
        
        // Configuration des icônes par défaut
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        leafletLoaded = true;
        setIsMapLoaded(true);
        setLoadingMap(false);
      }).catch((error) => {
        console.error('Erreur lors du chargement de Leaflet:', error);
        setLoadingMap(false);
      });
    } else {
      setIsMapLoaded(true);
      setLoadingMap(false);
    }
  }, []);

  // Initialiser la carte
  useEffect(() => {
    if (!isMapLoaded || !L || !mapRef.current || mapInstanceRef.current) {
      return;
    }

    // Créer la carte
    mapInstanceRef.current = L.map(mapRef.current).setView(
      [location.latitude, location.longitude],
      10
    );

    // Ajouter la couche de base (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);

    // Ajouter un marqueur pour la localisation
    L.marker([location.latitude, location.longitude])
      .addTo(mapInstanceRef.current)
      .bindPopup(`<b>${location.city}</b><br/>${location.country}`)
      .openPopup();

    // Nettoyage lors du démontage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapLoaded, location]);

  // Fonction pour mettre à jour une couche spécifique
  const updateWeatherLayer = useCallback((layerType: MapLayer, isActive: boolean, opacity: number) => {
    if (!mapInstanceRef.current || !L) return;

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) return;

    // Mapping des noms de couches vers les noms OpenWeatherMap
    const layerMapping: Record<MapLayer, string> = {
      precipitation: 'precipitation_new',
      temperature: 'temp_new',  // OpenWeatherMap utilise 'temp_new'
      wind: 'wind_new',
      clouds: 'clouds_new'
    };

    // Supprimer l'ancienne couche si elle existe
    if (layerInstancesRef.current[layerType]) {
      mapInstanceRef.current.removeLayer(layerInstancesRef.current[layerType]);
      layerInstancesRef.current[layerType] = null;
    }

    // Ajouter la nouvelle couche si elle est active
    if (isActive) {
      const weatherLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/${layerMapping[layerType]}/{z}/{x}/{y}.png?appid=${apiKey}`,
        {
          attribution: 'Weather data © OpenWeatherMap',
          opacity: opacity,
          isWeatherLayer: true,
        }
      );
      
      weatherLayer.addTo(mapInstanceRef.current);
      layerInstancesRef.current[layerType] = weatherLayer;
      
      // Log pour debug
      console.log(`Couche ${layerType} ajoutée avec opacité ${opacity}`);
    }
  }, []);

  // Mettre à jour les couches quand les états changent
  useEffect(() => {
    if (!isMapLoaded) return;

    Object.entries(layerStates).forEach(([layerType, state]) => {
      updateWeatherLayer(layerType as MapLayer, state.isActive, state.opacity);
    });
  }, [layerStates, isMapLoaded, updateWeatherLayer]);

  const layerOptions = [
    {
      key: 'precipitation' as MapLayer,
      label: 'Précipitations',
      icon: CloudRain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      cssColor: '#3b82f6', // Couleur CSS équivalente
      description: 'Pluie, neige et grêle',
      unit: 'mm/h'
    },
    {
      key: 'temperature' as MapLayer,
      label: 'Température',
      icon: Thermometer,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      cssColor: '#ef4444', // Couleur CSS équivalente
      description: 'Température de surface',
      unit: '°C'
    },
    {
      key: 'wind' as MapLayer,
      label: 'Vent',
      icon: Wind,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      cssColor: '#4b5563', // Couleur CSS équivalente
      description: 'Vitesse et direction du vent',
      unit: 'km/h'
    },
    {
      key: 'clouds' as MapLayer,
      label: 'Nuages',
      icon: Eye,
      color: 'text-gray-400',
      bgColor: 'bg-gray-50',
      cssColor: '#9ca3af', // Couleur CSS équivalente
      description: 'Couverture nuageuse',
      unit: '%'
    },
  ];

  const toggleLayer = useCallback((layerKey: MapLayer) => {
    setLayerStates(prev => ({
      ...prev,
      [layerKey]: {
        ...prev[layerKey],
        isActive: !prev[layerKey].isActive
      }
    }));
  }, []);

  const updateOpacity = useCallback((layerKey: MapLayer, opacity: number) => {
    setLayerStates(prev => ({
      ...prev,
      [layerKey]: {
        ...prev[layerKey],
        opacity
      }
    }));
  }, []);

  if (loadingMap) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Carte météo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Chargement de la carte...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isMapLoaded) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Carte météo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Impossible de charger la carte interactive
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Veuillez rafraîchir la page ou vérifier votre connexion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Carte météo interactive
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {Object.values(layerStates).filter(state => state.isActive).length} couches actives
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowControls(!showControls)}
              className={`flex items-center gap-1 transition-all duration-300 ${
                showControls ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
              }`}
            >
              <Settings className="h-4 w-4" />
              {showControls ? 'Masquer filtres' : 'Afficher filtres'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Contrôles des filtres */}
        {showControls && (
          <div className="mb-6 space-y-6">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
              <span>Filtres Météorologiques</span>
              <Badge variant="outline" className="ml-auto">
                {Object.values(layerStates).filter(state => state.isActive).length}/4 actifs
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {layerOptions.map((option) => {
                const IconComponent = option.icon;
                const state = layerStates[option.key];
                
                return (
                  <Card
                    key={option.key}
                    className={`transition-all duration-300 hover:shadow-lg ${
                      state.isActive 
                        ? `ring-2 ring-offset-2 shadow-lg` 
                        : 'hover:shadow-md'
                    }`}
                    style={{
                      background: state.isActive 
                        ? `linear-gradient(135deg, ${option.bgColor} 0%, white 100%)`
                        : undefined,
                      borderColor: state.isActive ? option.cssColor : undefined
                    }}
                  >
                    <CardContent className="p-6">
                      {/* En-tête de la couche */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full ${state.isActive ? 'bg-white shadow-md' : 'bg-muted'}`}>
                            <IconComponent className={`h-6 w-6 ${state.isActive ? option.color : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{option.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              {option.description} ({option.unit})
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant={state.isActive ? "default" : "outline"}
                          size="lg"
                          onClick={() => toggleLayer(option.key)}
                          className={`min-w-[100px] font-semibold transition-all duration-300 ${
                            state.isActive 
                              ? `text-white shadow-lg hover:shadow-xl` 
                              : 'hover:scale-105'
                          }`}
                          style={{
                            background: state.isActive 
                              ? `linear-gradient(135deg, ${option.cssColor} 0%, ${option.cssColor}CC 100%)`
                              : undefined
                          }}
                        >
                          {state.isActive ? (
                            <span className="flex items-center gap-2">
                              <span>ACTIVÉ</span>
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </span>
                          ) : (
                            <span>ACTIVER</span>
                          )}
                        </Button>
                      </div>

                      {/* Contrôle d'opacité */}
                      {state.isActive && (
                        <div className="space-y-4 pt-4 border-t border-border/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Sliders className="h-4 w-4" />
                              <span>Transparence</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border-2 border-white shadow-sm"
                                style={{ 
                                  backgroundColor: option.cssColor,
                                  opacity: state.opacity 
                                }}
                              ></div>
                              <span className="font-mono text-sm font-bold bg-white px-3 py-1 rounded-full shadow-sm border">
                                {Math.round(state.opacity * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="relative">
                              <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={state.opacity}
                                onChange={(e) => updateOpacity(option.key, parseFloat(e.target.value))}
                                className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider-custom"
                                style={{
                                  background: `linear-gradient(to right, ${option.cssColor}40 0%, ${option.cssColor} ${state.opacity * 100}%, #e5e7eb ${state.opacity * 100}%, #e5e7eb 100%)`
                                }}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                                <span>💧 10%</span>
                                <span>🔹 50%</span>
                                <span>⚫ 100%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs">
                              <div 
                                className="flex-1 h-1 rounded opacity-30"
                                style={{ 
                                  background: `linear-gradient(to right, transparent, ${option.cssColor}, ${option.cssColor})`
                                }}
                              ></div>
                              <span className="text-muted-foreground px-2">Prévisualisation</span>
                              <div 
                                className="flex-1 h-1 rounded opacity-30"
                                style={{ 
                                  background: `linear-gradient(to right, ${option.cssColor}, ${option.cssColor}, transparent)`
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Separator className="my-6" />
            
            {/* Conseils d'utilisation */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <h4 className="font-semibold text-blue-900 mb-1">💡 Conseils d&apos;utilisation</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• <strong>Superposez plusieurs couches</strong> pour analyser les corrélations météo</li>
                    <li>• <strong>Ajustez l&apos;opacité</strong> pour voir les détails sous-jacents de la carte</li>
                    <li>• <strong>Zoomez sur la carte</strong> pour observer les variations locales</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteneur de la carte */}
        <div 
          ref={mapRef} 
          className="h-96 w-full rounded-lg border bg-card"
          style={{ minHeight: '384px' }}
        />

        {/* Informations sur les données */}
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full opacity-60"></span>
            Données météo fournies par OpenWeatherMap - Mise à jour en temps réel
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 