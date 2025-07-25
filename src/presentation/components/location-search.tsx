/**
 * Composant de recherche et sélection de localisation
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Location } from '@/domain/entities/weather';
import { Search, MapPin, X } from 'lucide-react';
import { useDebounce } from '../hooks/use-debounce';

interface LocationSearchProps {
  onSearch: (query: string) => Promise<void>;
  onSelect: (location: Location) => Promise<void>;
  locations: Location[];
  isSearching: boolean;
  searchError: string | null;
  className?: string;
}

export function LocationSearch({
  onSearch,
  onSelect,
  locations,
  isSearching,
  searchError,
  className
}: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce de la recherche pour éviter trop d'appels API
  const debouncedQuery = useDebounce(query, 300);

  // Effet pour déclencher la recherche
  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, onSearch]);

  // Fermer la liste si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleSelectLocation = useCallback(async (location: Location) => {
    setQuery(`${location.city}, ${location.country}`);
    setIsOpen(false);
    await onSelect(location);
  }, [onSelect]);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full max-w-md ${className}`}>
      {/* Input de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Rechercher une ville..."
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10"
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Liste des résultats */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {isSearching && (
              <div className="p-3 space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            )}

            {searchError && (
              <div className="p-3 text-sm text-destructive">
                {searchError}
              </div>
            )}

            {!isSearching && !searchError && locations.length === 0 && query && (
              <div className="p-3 text-sm text-muted-foreground text-center">
                Aucune ville trouvée pour "{query}"
              </div>
            )}

            {!isSearching && locations.length > 0 && (
              <div className="py-1">
                {locations.map((location, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors"
                    onClick={() => handleSelectLocation(location)}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {location.city}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {location.region && `${location.region}, `}{location.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 