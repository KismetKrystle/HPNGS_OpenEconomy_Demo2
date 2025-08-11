import React, { useState } from 'react';
import { Calendar, MapPin, Users, TrendingUp, Hash, Play, Clock, Navigation, Music, Palette, Search, ChevronLeft, ChevronRight, Heart, Share, Eye, Bot, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

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
  views: number;
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
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [showAiResults, setShowAiResults] = useState(false);
  const [aiResults, setAiResults] = useState<string[]>([]);

  // Mock feed data based on location and events (expanded with more items)
  const [feedData] = useState([
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
      title: 'Jazz Night Magic',
      capturedBy: '@sarah_lens',
      location: 'Downtown Jazz Club',
      eventName: 'Jazz Night Performance',
      likes: 342,
      shares: 28,
      views: 1247,
      tags: ['jazz', 'music', 'live'],
      createdAt: new Date('2025-08-10'),
      type: 'image' as const
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=600&fit=crop',
      title: 'Street Art Masterpiece',
      capturedBy: '@urban_eye',
      location: 'Arts District',
      eventName: 'Summer Art Festival',
      likes: 589,
      shares: 73,
      views: 2134,
      tags: ['art', 'street', 'festival'],
      createdAt: new Date('2025-08-09'),
      type: 'image' as const
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop',
      title: 'Urban Exploration',
      capturedBy: '@city_wanderer',
      location: 'Historic District',
      eventName: 'Urban Photography Walk',
      likes: 456,
      shares: 42,
      views: 1856,
      tags: ['urban', 'photography', 'exploration'],
      createdAt: new Date('2025-08-08'),
      type: 'image' as const
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop',
      title: 'Indie Vibes',
      capturedBy: '@music_lover',
      location: 'Riverside Amphitheater',
      eventName: 'Indie Music Showcase',
      likes: 723,
      shares: 91,
      views: 3245,
      tags: ['indie', 'music', 'live'],
      createdAt: new Date('2025-08-07'),
      type: 'image' as const
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop',
      title: 'Community Creation',
      capturedBy: '@community_art',
      location: 'Community Center',
      eventName: 'Community Art Workshop',
      likes: 234,
      shares: 35,
      views: 987,
      tags: ['community', 'workshop', 'art'],
      createdAt: new Date('2025-08-06'),
      type: 'image' as const
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=600&fit=crop',
      title: 'Concert Energy',
      capturedBy: '@stage_lights',
      location: 'Arena District',
      eventName: 'Electronic Music Festival',
      likes: 892,
      shares: 156,
      views: 4123,
      tags: ['concert', 'electronic', 'festival'],
      createdAt: new Date('2025-08-05'),
      type: 'image' as const
    },
    {
      id: '7',
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop',
      title: 'Wedding Bliss',
      capturedBy: '@love_captures',
      location: 'Garden Venue',
      eventName: 'Summer Wedding',
      likes: 445,
      shares: 67,
      views: 1678,
      tags: ['wedding', 'celebration', 'love'],
      createdAt: new Date('2025-08-04'),
      type: 'image' as const
    },
    {
      id: '8',
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop',
      title: 'Ocean Symphony',
      capturedBy: '@wave_rider',
      location: 'Coastal Plaza',
      eventName: 'Beach Art Festival',
      likes: 678,
      shares: 89,
      views: 2456,
      tags: ['ocean', 'nature', 'art'],
      createdAt: new Date('2025-08-03'),
      type: 'image' as const
    },
    {
      id: '9',
      src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop',
      title: 'Theater Dreams',
      capturedBy: '@stage_magic',
      location: 'Historic Theater',
      eventName: 'Broadway Night',
      likes: 356,
      shares: 45,
      views: 1234,
      tags: ['theater', 'performance', 'drama'],
      createdAt: new Date('2025-08-02'),
      type: 'image' as const
    },
    {
      id: '10',
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop',
      title: 'Digital Dreams',
      capturedBy: '@pixel_artist',
      location: 'Tech Hub',
      eventName: 'Digital Art Expo',
      likes: 567,
      shares: 78,
      views: 1876,
      tags: ['digital', 'art', 'technology'],
      createdAt: new Date('2025-08-01'),
      type: 'image' as const
    }
  ]);

  // Mock area suggestions
  const areas = [
    'Downtown District',
    'Arts Quarter',
    'Historic Downtown',
    'Riverside Area',
    'Tech Hub',
    'Cultural Center'
  ];

  // Get events for selected area
  const getAreaEvents = (area: string) => {
    return publicEvents.filter(event => 
      event.location.toLowerCase().includes(area.toLowerCase()) ||
      area.toLowerCase().includes(event.location.toLowerCase())
    );
  };

  // Sort feed by engagement (likes + views)
  const sortedFeed = feedData.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > -7 && diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      setSelectedArea(searchLocation);
      setSelectedEvent(''); // Reset event selection
    }
  };

  const handleAiQuery = () => {
    if (aiQuery.trim()) {
      setShowAiResults(true);
      // Mock AI results based on query
      const mockResults = [
        "Jazz performances in downtown area",
        "Art galleries featuring local artists",
        "Photography workshops this weekend",
        "Live music events near you",
        "Creative meetups for digital artists"
      ];
      setAiResults(mockResults);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-6 mb-6">
        <h1 className="mb-2">Public Feed</h1>
        <p className="text-muted-foreground">
          Discover the most liked and viewed content from creative events
        </p>
      </div>

      {/* Location Input Section with AI */}
      <div className="px-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Explore by Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Search */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter location (e.g., Downtown, Arts District)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleLocationSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* AI Query Section */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Ask AI to find specific content</span>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="e.g., 'Show me jazz performances this weekend' or 'Find art galleries with photography exhibits'"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="min-h-16 resize-none"
                />
                <Button onClick={handleAiQuery} size="sm" className="w-full">
                  <Send className="h-3 w-3 mr-2" />
                  Ask AI
                </Button>
              </div>
            </div>

            {/* AI Results */}
            {showAiResults && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  {aiResults.map((result, index) => (
                    <div key={index} className="p-2 bg-muted/30 rounded-lg text-sm cursor-pointer hover:bg-muted/50 transition-colors">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Area Selection Dropdown */}
            <div>
              <label className="text-sm font-medium mb-2 block">Popular Areas</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an area to explore..." />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{area}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Selection (shows when area is selected) */}
            {selectedArea && (
              <div>
                <label className="text-sm font-medium mb-2 block">Events in {selectedArea}</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by specific event (optional)..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All events in this area</SelectItem>
                    {getAreaEvents(selectedArea).map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{event.name}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {event.isLive ? 'Live' : formatDate(event.date)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Active Filters */}
            {(selectedArea || selectedEvent) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-xs text-muted-foreground">Active filters:</span>
                {selectedArea && (
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedArea}
                  </Badge>
                )}
                {selectedEvent && (
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {publicEvents.find(e => e.id === selectedEvent)?.name}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vertically Scrollable Public Photos Feed */}
      <div className="px-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Most Popular Content</span>
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {sortedFeed.length} posts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Vertically scrollable feed */}
            {sortedFeed.map((item) => (
              <div key={item.id} className="space-y-3">
                {/* Featured Image */}
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  )}
                  
                  {/* Engagement Overlay */}
                  <div className="absolute top-3 right-3 space-y-2">
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Heart className="h-3 w-3 fill-current text-red-400" />
                      <span>{formatNumber(item.likes)}</span>
                    </div>
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(item.views)}</span>
                    </div>
                  </div>

                  {/* Post Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-medium mb-1">{item.title}</h3>
                    <div className="flex items-center justify-between text-white/80 text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{item.capturedBy}</span>
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Details */}
                <div className="space-y-3">
                  {/* Location and Event */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.eventName}
                    </Badge>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{formatNumber(item.likes)} likes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share className="h-4 w-4" />
                        <span>{formatNumber(item.shares)} shares</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(item.views)} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="h-3 w-3 mr-1" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Divider between posts */}
                <div className="border-t border-border mt-6"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Horizontal Scrolling Trending Content */}
      <div className="px-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Hash className="h-4 w-4" />
              <span>Most Tagged</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {sortedFeed.slice(0, 8).map((item) => (
                <div key={item.id} className="min-w-32 max-w-32 flex-shrink-0">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Engagement indicator */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-black/70 text-white px-1 py-0.5 rounded text-xs flex items-center space-x-1">
                        <TrendingUp className="h-2 w-2" />
                        <span>{formatNumber(item.likes)}</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                      <p className="text-white/80 text-xs line-clamp-1">{item.capturedBy}</p>
                    </div>
                  </div>
                  
                  {/* Tags below image */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}