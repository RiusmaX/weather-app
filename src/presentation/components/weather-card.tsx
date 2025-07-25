/**
 * Composant d'affichage des données météo actuelles
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CurrentWeather } from '@/domain/entities/weather';
import Image from 'next/image';
import { 
  Wind, 
  Droplets, 
  Gauge, 
  Eye, 
  Sun, 
  MapPin,
  Thermometer,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeatherCardProps {
  weather: CurrentWeather;
  className?: string;
}

export function WeatherCard({ weather, className }: WeatherCardProps) {
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const getWeatherIconUrl = (icon: string): string => {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`;
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span>{weather.location.city}, {weather.location.country}</span>
        </div>
        <CardTitle className="text-2xl font-bold">
          Météo actuelle
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Température principale et icône */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={getWeatherIconUrl(weather.condition.icon)}
              alt={weather.condition.description}
              width={80}
              height={80}
            />
            <div>
              <div className="text-4xl font-bold">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {weather.condition.description}
              </div>
            </div>
          </div>
        </div>

        {/* Température ressentie */}
        <div className="flex items-center gap-2 text-sm">
          <Thermometer className="h-4 w-4 text-orange-500" />
          <span>Ressenti: {weather.feelsLike}°C</span>
        </div>

        <Separator />

        {/* Détails météo */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-medium">Humidité</div>
              <div className="text-muted-foreground">{weather.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">Vent</div>
              <div className="text-muted-foreground">
                {weather.windSpeed} km/h {getWindDirection(weather.windDirection)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-purple-500" />
            <div>
              <div className="font-medium">Pression</div>
              <div className="text-muted-foreground">{weather.pressure} hPa</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-500" />
            <div>
              <div className="font-medium">Visibilité</div>
              <div className="text-muted-foreground">{weather.visibility} km</div>
            </div>
          </div>
        </div>

        {/* UV Index si disponible */}
        {weather.uvIndex > 0 && (
          <>
            <Separator />
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Indice UV:</span>
                <Badge 
                  variant={weather.uvIndex <= 2 ? 'secondary' : 
                          weather.uvIndex <= 5 ? 'default' : 
                          weather.uvIndex <= 7 ? 'destructive' : 'destructive'}
                >
                  {weather.uvIndex}
                </Badge>
              </div>
            </div>
          </>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Calendar className="h-3 w-3" />
          <span>
            Mis à jour: {format(weather.timestamp, 'dd/MM/yyyy à HH:mm', { locale: fr })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 