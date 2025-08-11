import React, { useState } from 'react';
import { Settings, Plus, Edit, Calendar, Users, TrendingUp, Camera, Share, Hash, List, Clock, BarChart3, Heart, Tag, MapPin, QrCode, X, Map, Inbox, Check, AlertCircle, ChevronDown, Play, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Toggle } from './ui/toggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

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
  nftMetadata?: {
    blockchain: string;
    tokenId: string;
    collection: string;
    value?: number;
    description?: string;
  };
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
  analytics?: {
    totalShows: number;
    totalRevenue: number;
    totalLikes: number;
    totalShares: number;
    attendeesCount: number;
    performersCount: number;
  };
  coordinates?: { lat: number; lng: number };
}

interface ProfileScreenProps {
  onCreateEvent: () => void;
  userEvents: PublicEvent[];
  mediaItems: MediaItem[];
  onEditEvent: (event: PublicEvent) => void;
}

export function ProfileScreen({ onCreateEvent, userEvents, mediaItems, onEditEvent }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [galleryTab, setGalleryTab] = useState('all');
  const [eventsViewMode, setEventsViewMode] = useState<'map' | 'timeline'>('timeline');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedEventForQR, setSelectedEventForQR] = useState<string>('');
  const [generatedQR, setGeneratedQR] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock recent performances data
  const [recentPerformances] = useState([
    {
      id: 'perf1',
      name: 'Jazz Night Performance',
      venue: 'Blue Note Venue',
      date: new Date('2025-08-10'),
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
      type: 'live' as const,
      attendees: 156,
      revenue: 1250.75
    },
    {
      id: 'perf2',
      name: 'Summer Art Festival',
      venue: 'Downtown Plaza',
      date: new Date('2025-08-05'),
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=150&h=150&fit=crop',
      type: 'festival' as const,
      attendees: 234,
      revenue: 3400.50
    },
    {
      id: 'perf3',
      name: 'Photography Workshop',
      venue: 'Historic District',
      date: new Date('2025-07-28'),
      thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=150&h=150&fit=crop',
      type: 'workshop' as const,
      attendees: 45,
      revenue: 890.25
    }
  ]);

  // Mock tag data
  const [taggedItems] = useState([
    {
      id: 't1',
      src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      title: 'Jazz Performance',
      taggedBy: '@sarah_lens',
      createdAt: new Date('2025-08-10'),
      status: 'pending' as const,
      tags: ['music', 'jazz', 'live']
    },
    {
      id: 't2',
      src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop',
      title: 'Art Installation',
      taggedBy: '@mike_photos',
      createdAt: new Date('2025-08-09'),
      status: 'approved' as const,
      tags: ['art', 'installation', 'creative']
    },
    {
      id: 't3',
      src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&h=300&fit=crop',
      title: 'Street Art',
      taggedBy: '@urban_shooter',
      createdAt: new Date('2025-08-08'),
      status: 'pending' as const,
      tags: ['street', 'photography', 'urban']
    }
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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

  const getPerformanceTypeColor = (type: string) => {
    switch (type) {
      case 'live': return 'bg-red-100 text-red-800';
      case 'festival': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate user stats
  const totalPhotosTaken = mediaItems.length;
  const totalLikes = mediaItems.reduce((sum, item) => sum + item.likes, 0);
  const totalShares = mediaItems.reduce((sum, item) => sum + item.shares, 0);
  const totalRevenue = mediaItems.reduce((sum, item) => sum + item.earnings, 0);
  const nftCount = mediaItems.filter(item => item.isNFT).length;
  const totalTokens = nftCount * 250; // Mock calculation
  
  // Calculate tags received (times the user has been tagged)
  const allTaggedPeople = mediaItems.flatMap(item => item.taggedPeople);
  const currentUserTags = allTaggedPeople.filter(person => person === 'alex_chen' || person === 'alexchen').length;
  const uniqueTaggers = new Set(mediaItems.filter(item => 
    item.taggedPeople.includes('alex_chen') || item.taggedPeople.includes('alexchen')
  ).map(item => item.capturedBy)).size;

  // Sort events by date for timeline
  const sortedEvents = [...userEvents].sort((a, b) => b.date.getTime() - a.date.getTime());

  // NFT items
  const nftItems = mediaItems.filter(item => item.isNFT);

  // All content items for search
  const allContentItems = mediaItems.filter(item => item.status === 'approved');

  // Filter content based on search query
  const filteredContent = allContentItems.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      formatDate(item.createdAt).toLowerCase().includes(searchLower) ||
      (item.eventId && userEvents.find(e => e.id === item.eventId)?.name.toLowerCase().includes(searchLower)) ||
      (item.eventId && userEvents.find(e => e.id === item.eventId)?.location.toLowerCase().includes(searchLower))
    );
  });

  // Tags awaiting approval
  const pendingTags = taggedItems.filter(item => item.status === 'pending');

  const handleGenerateQR = () => {
    if (selectedEventForQR) {
      setGeneratedQR(true);
    }
  };

  const handleTagAction = (tagId: string, action: 'approve' | 'reject') => {
    // Handle tag approval/rejection logic
    console.log(`Tag ${tagId} ${action}d`);
  };

  const EventCard = ({ event }: { event: PublicEvent }) => (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEditEvent(event)}>
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-20 h-20 bg-muted relative overflow-hidden">
            <img
              src={event.thumbnail}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-1">{event.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{event.location}</p>
              </div>
              <Badge className={`ml-2 text-xs ${getCategoryColor(event.category)}`}>
                {event.category}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Camera className="h-3 w-3" />
                  <span>{event.photoCount}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TimelineEventCard = ({ event, index, isLast }: { event: PublicEvent; index: number; isLast: boolean }) => (
    <div className="relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border"></div>
      )}
      
      {/* Timeline Dot */}
      <div className="absolute left-5 top-8 w-3 h-3 bg-primary rounded-full border-2 border-background z-10"></div>
      
      {/* Event Card */}
      <div className="ml-12 pb-6">
        <div className="mb-2">
          <div className="text-xs text-muted-foreground">{formatDate(event.date)}</div>
        </div>
        <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEditEvent(event)}>
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                <img
                  src={event.thumbnail}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-1">{event.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{event.location}</p>
                  </div>
                  <Badge className={`text-xs ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Camera className="h-3 w-3" />
                    <span>{event.photoCount} photos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{event.associatedArtists?.length || 0} artists</span>
                  </div>
                </div>
                
                {/* Event Description */}
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const EventMapView = () => (
    <div className="space-y-4">
      {/* Mock Map Container */}
      <div className="h-64 bg-muted rounded-lg relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop"
          alt="Map view"
          className="w-full h-full object-cover"
        />
        
        {/* Event Markers */}
        {userEvents.slice(0, 3).map((event, index) => (
          <div
            key={event.id}
            className="absolute bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium cursor-pointer hover:scale-110 transition-transform"
            style={{
              left: `${20 + index * 25}%`,
              top: `${30 + index * 15}%`
            }}
            onClick={() => onEditEvent(event)}
          >
            {index + 1}
          </div>
        ))}
        
        <div className="absolute top-3 right-3">
          <Button variant="secondary" size="sm">
            <MapPin className="h-4 w-4 mr-1" />
            View Full Map
          </Button>
        </div>
      </div>
      
      {/* Event Legend */}
      <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
        {userEvents.slice(0, 6).map((event, index) => (
          <div key={event.id} className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-1">{event.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{event.location}</p>
            </div>
            <div className="text-xs text-muted-foreground">{formatDate(event.date)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const ContentGrid = ({ items }: { items: MediaItem[] }) => (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.id} className="aspect-square relative">
          <div className="w-full h-full bg-muted rounded-lg overflow-hidden">
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
              <div className="absolute top-2 left-2">
                <Badge className="text-xs bg-purple-500 text-white">
                  NFT
                </Badge>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center space-x-1 text-white text-xs">
                <Heart className="h-3 w-3" />
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pb-4">
      {/* Simplified Profile Header */}
      <div className="px-4 py-6 bg-gradient-to-b from-muted/50 to-background">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-muted rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Alex Chen</h1>
            <p className="text-muted-foreground">@alexchen_art</p>
            <p className="text-sm text-muted-foreground mt-1">
              Creative photographer & event organizer
            </p>
          </div>
        </div>

        {/* QR Code Button */}
        <div className="flex justify-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowQRModal(true)}
            className="w-full max-w-xs"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate Event QR Code
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{totalPhotosTaken}</div>
            <div className="text-xs text-muted-foreground">Photos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{totalLikes}</div>
            <div className="text-xs text-muted-foreground">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{userEvents.length}</div>
            <div className="text-xs text-muted-foreground">Events</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{pendingTags.length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>

      {/* Updated Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-30 bg-background border-b">
          <TabsList className="w-full grid grid-cols-4 rounded-none h-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="px-4 py-4 space-y-4">
          {/* Enhanced Overview with Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Revenue Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-600">{formatCurrency(totalRevenue)}</div>
                  <div className="text-xs text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-purple-600">{nftCount}</div>
                  <div className="text-xs text-muted-foreground">NFTs Minted</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-blue-600">{totalTokens}</div>
                  <div className="text-xs text-muted-foreground">Total Tokens</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Performances */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Recent Performances</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPerformances.map((performance) => (
                  <div key={performance.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={performance.thumbnail}
                        alt={performance.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-1">{performance.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{performance.venue}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`text-xs ${getPerformanceTypeColor(performance.type)}`}>
                          {performance.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(performance.date)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{formatCurrency(performance.revenue)}</div>
                      <div className="text-xs text-muted-foreground">{performance.attendees} attendees</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connect with Me - Reduced Height */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Connect with Me</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start h-8 text-xs">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @alexchen_art
                </Button>
                
                <Button variant="outline" size="sm" className="justify-start h-8 text-xs">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                  alexchen.creates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Camera className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Captured 3 new photos at Jazz Night Performance</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Created Summer Art Festival event</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Tag className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">Tagged in 5 photos by @sarah_lens</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="px-4 py-4">
          {/* Horizontal Create Event Bar */}
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Create New Event</h3>
                      <p className="text-xs text-muted-foreground">
                        Start organizing your next creative gathering
                      </p>
                    </div>
                  </div>
                  <Button onClick={onCreateEvent} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Header with View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium">My Events</h3>
              <Badge variant="outline" className="text-xs">
                {userEvents.length} events
              </Badge>
            </div>
            
            <div className="flex items-center border rounded-lg">
              <Toggle
                pressed={eventsViewMode === 'map'}
                onPressedChange={() => setEventsViewMode('map')}
                className="h-8 px-2"
                size="sm"
              >
                <Map className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={eventsViewMode === 'timeline'}
                onPressedChange={() => setEventsViewMode('timeline')}
                className="h-8 px-2"
                size="sm"
              >
                <Clock className="h-4 w-4" />
              </Toggle>
            </div>
          </div>

          {/* Events Display */}
          {userEvents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2">No events yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first event to start building your community
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {eventsViewMode === 'map' ? (
                <EventMapView />
              ) : (
                <div className="space-y-0 pb-4">
                  {sortedEvents.map((event, index) => (
                    <TimelineEventCard 
                      key={event.id} 
                      event={event} 
                      index={index} 
                      isLast={index === sortedEvents.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tags" className="px-4 py-4 space-y-4">
          {/* Tags Tab Content */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Tags</h3>
              <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-700 border-orange-300">
                {pendingTags.length} pending approval
              </Badge>
            </div>
          </div>

          {taggedItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2">No tags yet</h3>
                <p className="text-muted-foreground text-sm">
                  When people tag you in photos, they'll appear here for your approval
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {taggedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={item.src}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              Tagged by {item.taggedBy} • {formatDate(item.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {item.status === 'pending' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTagAction(item.id, 'reject')}
                                  className="h-8 px-2 text-destructive hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleTagAction(item.id, 'approve')}
                                  className="h-8 px-2"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              </>
                            ) : item.status === 'approved' ? (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                <X className="h-3 w-3 mr-1" />
                                Rejected
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="px-4 py-4 space-y-4">
          {/* Gallery Tab with nested tabs */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">My Gallery</h3>
              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-700 border-purple-300">
                {allContentItems.length} items
              </Badge>
            </div>
          </div>

          {/* Nested Tabs */}
          <Tabs value={galleryTab} onValueChange={setGalleryTab} className="w-full">
            <div className="border-b">
              <TabsList className="w-full grid grid-cols-2 rounded-none h-10 bg-muted/30">
                <TabsTrigger value="all" className="text-sm">All Content Captured</TabsTrigger>
                <TabsTrigger value="nfts" className="text-sm">NFTs</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4 mt-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by description, date, location, event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* All Content Grid */}
              {filteredContent.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2">{searchQuery ? 'No matching content found' : 'No content captured yet'}</h3>
                    <p className="text-muted-foreground text-sm">
                      {searchQuery ? 'Try adjusting your search terms' : 'Start capturing moments at events to see them here'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ContentGrid items={filteredContent} />
              )}
            </TabsContent>

            <TabsContent value="nfts" className="space-y-4 mt-4">
              {/* NFTs Grid */}
              {nftItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Hash className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2">No NFTs minted yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Convert your photos into NFTs to start earning from your creative work
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {nftItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <img
                            src={item.src}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="text-xs bg-purple-500 text-white">
                              NFT
                            </Badge>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                              {item.nftMetadata?.blockchain}
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-medium line-clamp-1 mb-1">{item.title}</h4>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.nftMetadata?.collection}</span>
                            <span>{item.nftMetadata?.value} ETH</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <Heart className="h-3 w-3" />
                              <span>{item.likes}</span>
                            </div>
                            <div className="text-green-600 font-medium">
                              {formatCurrency(item.earnings)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Event QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Event</label>
              <Select value={selectedEventForQR} onValueChange={setSelectedEventForQR}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Choose an event..." />
                </SelectTrigger>
                <SelectContent>
                  {userEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!generatedQR ? (
              <Button 
                onClick={handleGenerateQR} 
                disabled={!selectedEventForQR}
                className="w-full"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
            ) : (
              <div className="text-center space-y-4">
                {/* Mock QR Code */}
                <div className="w-48 h-48 bg-black mx-auto rounded-lg flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-white" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">QR Code Generated!</p>
                  <div className="flex items-center justify-center space-x-1 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
                    <AlertCircle className="h-3 w-3" />
                    <span>This QR code will expire in 24 hours</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Share
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}