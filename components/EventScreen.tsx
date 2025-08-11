import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Users, TrendingUp, Hash, Map, List, Navigation, User } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toggle } from './ui/toggle';

interface EventAnalytics {
  totalShows: number;
  totalRevenue: number;
  totalLikes: number;
  totalShares: number;
  attendeesCount: number;
  performersCount: number;
}

interface PublicEvent {
  id: string;
  name: string;
  location: string;
  date: Date;
  thumbnail: string;
  photoCount: number;
  creatorName: string;
  description: string;
  eventDates: Date[];
  analytics: EventAnalytics;
  category: 'music' | 'art' | 'food' | 'tech' | 'other';
  associatedArtists?: string[];
  isLive?: boolean;
  coordinates?: { lat: number; lng: number };
}

interface Artist {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: 'music' | 'art' | 'food' | 'tech' | 'other';
  isLive: boolean;
  followers: number;
  location: string;
  coordinates: { lat: number; lng: number };
}

interface EventScreenProps {
  events: PublicEvent[];
  artists: Artist[];
  onEventSelect: (event: PublicEvent) => void;
}

export function EventScreen({ events, artists, onEventSelect }: EventScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'upcoming'>('recent');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter and sort events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.associatedArtists && event.associatedArtists.some(artist => 
                           artist.toLowerCase().includes(searchQuery.toLowerCase())
                         ));
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Filter artists
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || artist.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.date.getTime() - a.date.getTime();
      case 'popular':
        return b.analytics.totalLikes - a.analytics.totalLikes;
      case 'upcoming':
        const now = new Date();
        const aFuture = Math.max(...a.eventDates.map(d => d.getTime())) > now.getTime();
        const bFuture = Math.max(...b.eventDates.map(d => d.getTime())) > now.getTime();
        if (aFuture && bFuture) {
          return Math.min(...a.eventDates.map(d => d.getTime())) - Math.min(...b.eventDates.map(d => d.getTime()));
        }
        return bFuture ? 1 : -1;
      default:
        return 0;
    }
  });

  // Separate nearby and other events (mock logic - in real app would use geolocation)
  const nearbyEvents = sortedEvents.slice(0, 3);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isUpcoming = (dates: Date[]) => {
    const now = new Date();
    return Math.max(...dates.map(d => d.getTime())) > now.getTime();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music': return 'bg-purple-100 text-purple-800';
      case 'art': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'tech': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EventCard = ({ event, isCompact = false }: { event: PublicEvent; isCompact?: boolean }) => (
    <Card 
      className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${isCompact ? 'min-w-72 snap-start' : ''}`}
      onClick={() => onEventSelect(event)}
    >
      <CardContent className="p-0">
        <div className={`flex ${isCompact ? 'flex-col' : ''}`}>
          {/* Event Image */}
          <div className={`${isCompact ? 'w-full h-32' : 'w-24 h-24'} bg-muted relative overflow-hidden`}>
            <img
              src={event.thumbnail}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            {isUpcoming(event.eventDates) && (
              <div className="absolute top-1 right-1">
                <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                  Live
                </Badge>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className={`flex-1 p-4 ${isCompact ? 'min-h-0' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="mb-1 line-clamp-1">{event.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  by {event.creatorName}
                </p>
              </div>
              <Badge className={`ml-2 text-xs ${getCategoryColor(event.category)}`}>
                {event.category}
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {event.eventDates.length > 1 
                    ? `${formatDate(event.eventDates[0])} + ${event.eventDates.length - 1} more`
                    : formatDate(event.eventDates[0])
                  }
                </span>
              </div>
            </div>

            {/* Associated Artists */}
            {event.associatedArtists && event.associatedArtists.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {event.associatedArtists.slice(0, 3).map((artist) => (
                  <Badge key={artist} variant="outline" className="text-xs h-5 px-1 py-0 flex items-center space-x-1">
                    <Hash className="h-2 w-2" />
                    <span>{artist}</span>
                  </Badge>
                ))}
                {event.associatedArtists.length > 3 && (
                  <Badge variant="outline" className="text-xs h-5 px-1 py-0">
                    +{event.associatedArtists.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{event.analytics.attendeesCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{event.analytics.totalLikes}</span>
                </div>
                <span>{event.photoCount} photos</span>
              </div>
              
              {isUpcoming(event.eventDates) && !isCompact && (
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                  Join
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ArtistCard = ({ artist }: { artist: Artist }) => (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            {artist.isLive && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-1">{artist.name}</h4>
                <p className="text-sm text-muted-foreground">@{artist.handle}</p>
              </div>
              <Badge className={`ml-2 text-xs ${getCategoryColor(artist.category)}`}>
                {artist.category}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{artist.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{artist.followers.toLocaleString()}</span>
                </div>
              </div>
              
              {artist.isLive && (
                <Badge className="bg-green-500 text-white text-xs">
                  Live Now
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MapView = () => (
    <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
      
      {/* Map pins for events */}
      {nearbyEvents.slice(0, 5).map((event, index) => (
        <div
          key={event.id}
          className="absolute cursor-pointer group"
          style={{
            top: `${25 + (index * 15)}%`,
            left: `${30 + (index * 12)}%`,
          }}
          onClick={() => onEventSelect(event)}
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-32">
            <div className="text-sm font-medium line-clamp-1">{event.name}</div>
            <div className="text-xs text-muted-foreground">{event.location}</div>
          </div>
        </div>
      ))}
      
      {/* Mock map elements */}
      <div className="absolute bottom-4 left-4 bg-background/90 rounded-lg p-2 shadow-sm">
        <div className="flex items-center space-x-2 text-xs">
          <Navigation className="h-3 w-3" />
          <span>2.4 km away</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and join creative events in your community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, artists, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="art">Art</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: 'recent' | 'popular' | 'upcoming') => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg">
            <Toggle
              pressed={viewMode === 'list'}
              onPressedChange={() => setViewMode('list')}
              className="h-9 px-3"
              size="sm"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === 'map'}
              onPressedChange={() => setViewMode('map')}
              className="h-9 px-3"
              size="sm"
            >
              <Map className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {sortedEvents.length === 0 && filteredArtists.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2">No events or artists found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find more content
          </p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="space-y-6">
          <MapView />
          
          {/* Event list below map */}
          <div className="space-y-4">
            <h3>Nearby Events</h3>
            <div className="grid gap-4">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Nearby Events - Horizontal Scroll */}
          {nearbyEvents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3>Nearby Events</h3>
                <Badge variant="outline" className="text-xs">
                  <Navigation className="h-3 w-3 mr-1" />
                  Within 5km
                </Badge>
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-4 snap-x">
                {nearbyEvents.map((event) => (
                  <EventCard key={`nearby-${event.id}`} event={event} isCompact />
                ))}
              </div>
            </div>
          )}

          {/* Nearby Artists */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Nearby Artists</h3>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                {filteredArtists.filter(a => a.isLive).length} Live
              </Badge>
            </div>
            <div className="grid gap-4">
              {filteredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Showing {sortedEvents.length} events and {filteredArtists.length} artists
      </div>
    </div>
  );
}