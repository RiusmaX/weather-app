/**
 * Composant d'affichage des prévisions météo
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherForecast } from '@/domain/entities/weather';
import { Calendar, Wind, CloudRain } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ForecastCardProps {
  forecasts: WeatherForecast[];
  className?: string;
}

export function ForecastCard({ forecasts, className }: ForecastCardProps) {
  const getWeatherIconUrl = (icon: string): string => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const getFormattedDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return "Aujourd'hui";
    }
    if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
      return "Demain";
    }
    return format(date, 'EEEE dd/MM', { locale: fr });
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Prévisions 5 jours
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {forecasts.map((forecast, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              {/* Date et icône */}
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={getWeatherIconUrl(forecast.condition.icon)}
                  alt={forecast.condition.description}
                  className="w-12 h-12"
                />
                <div>
                  <div className="font-medium">
                    {getFormattedDate(forecast.date)}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {forecast.condition.description}
                  </div>
                </div>
              </div>

              {/* Températures */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      {forecast.temperature.max}°
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {forecast.temperature.min}°
                    </span>
                  </div>
                  
                  {/* Détails supplémentaires */}
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {forecast.precipitationChance > 0 && (
                      <div className="flex items-center gap-1">
                        <CloudRain className="h-3 w-3" />
                        <span>{forecast.precipitationChance}%</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Wind className="h-3 w-3" />
                      <span>{forecast.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {forecasts.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Aucune prévision disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
} 