import React, { useState } from 'react';
import { Calendar, MapPin, Users, TrendingUp, Hash, Play, Clock, Navigation, Music, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface MediaItem {
  id: string;
  src: string;
  type: 'image' | 'video';
  title: string;
  tags: string[];
  taggedPeople: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  capturedBy: string;
  likes: number;
  shares: number;
  earnings: number;
  eventId?: string;
  isNFT?: boolean;
}

interface PublicEvent {
  id: string;
  name: string;
  location: string;
  date: Date;
  thumbnail: string;
  photoCount: number;
  photos: MediaItem[];
  creatorId: string;
  creatorName: string;
  description: string;
  eventDates: Date[];
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

interface HomeScreenProps {
  userItems: MediaItem[];
  publicEvents: PublicEvent[];
  artists: Artist[];
  onEventSelect: (event: PublicEvent) => void;
}

export function HomeScreen({ userItems, publicEvents, artists, onEventSelect }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState('discover');

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0 && diffDays <= 7) return `${diffDays}d`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music': return '🎵';
      case 'art': return '🎨';
      case 'food': return '🍽️';
      case 'tech': return '💻';
      default: return '📅';
    }
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

  const nearbyEvents = publicEvents.slice(0, 6);
  const liveArtists = artists.filter(artist => artist.isLive).slice(0, 6);
  const recentItems = userItems.slice(0, 6);

  const totalEarnings = userItems.reduce((sum, item) => sum + item.earnings, 0);
  const totalLikes = userItems.reduce((sum, item) => sum + item.likes, 0);
  const nftCount = userItems.filter(item => item.isNFT).length;

  const CompactEventCard = ({ event }: { event: PublicEvent }) => (
    <Card 
      className="min-w-[140px] max-w-[140px] cursor-pointer transition-all hover:scale-105 snap-start"
      onClick={() => onEventSelect(event)}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <img
            src={event.thumbnail}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1">
            <div className="bg-black/70 text-white px-1 py-0.5 rounded text-xs flex items-center">
              <span className="mr-0.5">{getCategoryIcon(event.category)}</span>
              <span>{event.photoCount}</span>
            </div>
          </div>
          {event.isLive && (
            <div className="absolute top-1 right-1">
              <div className="bg-red-500 text-white px-1 py-0.5 rounded text-xs flex items-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></div>
                LIVE
              </div>
            </div>
          )}
        </div>
        <div className="p-2">
          <h4 className="text-xs font-medium mb-1 line-clamp-1">{event.name}</h4>
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-2.5 w-2.5 mr-0.5" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-2.5 w-2.5 mr-0.5" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.associatedArtists && event.associatedArtists.length > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-2.5 w-2.5 mr-0.5" />
                <span>{event.associatedArtists.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CompactArtistCard = ({ artist }: { artist: Artist }) => (
    <Card className="min-w-[120px] max-w-[120px] cursor-pointer transition-all hover:scale-105 snap-start">
      <CardContent className="p-3">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            {artist.isLive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </div>
          <div className="text-center min-w-0 w-full">
            <h4 className="text-xs font-medium line-clamp-1">{artist.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">@{artist.handle}</p>
            <div className="flex items-center justify-center mt-1">
              <Badge className={`text-xs h-4 px-1 ${getCategoryColor(artist.category)}`}>
                {artist.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Discover what's happening around you
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-semibold mb-1">
              ${totalEarnings.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">Earnings</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-semibold mb-1">
              {totalLikes}
            </div>
            <div className="text-xs text-muted-foreground">Likes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xl font-semibold mb-1">
              {nftCount}
            </div>
            <div className="text-xs text-muted-foreground">NFTs</div>
          </CardContent>
        </Card>
      </div>

      {/* Nearby Events - Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Nearby Events</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Navigation className="h-3 w-3 mr-1" />
              Within 5km
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              {nearbyEvents.filter(e => e.isLive).length} Live
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {nearbyEvents.map((event) => (
            <CompactEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Nearby Artists - Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Live Artists</h3>
          <Badge variant="outline" className="text-xs">
            {liveArtists.length} online
          </Badge>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {liveArtists.map((artist) => (
            <CompactArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>

      {/* Recent Captures */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Recent Captures</h3>
          <Badge variant="outline" className="text-xs">
            {userItems.length} total
          </Badge>
        </div>
        
        {recentItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {recentItems.map((item) => (
              <div key={item.id} className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded">
                    <Play className="h-3 w-3" />
                  </div>
                )}
                {item.isNFT && (
                  <div className="absolute bottom-2 left-2 bg-purple-500 text-white px-1 py-0.5 rounded text-xs">
                    NFT
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 right-2">
                  <div className="flex items-center space-x-1 text-white text-xs">
                    <TrendingUp className="h-3 w-3" />
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No captures yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Start capturing moments at events to see them here
              </p>
              <Button size="sm">Start Capturing</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trending Hashtags */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Trending Tags</h3>
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Hot now
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['jazz_master', 'summer_vibes', 'art_festival', 'live_music', 'food_fest', 'digital_art'].map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs flex items-center space-x-1">
              <Hash className="h-3 w-3" />
              <span>{tag}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}