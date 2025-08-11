import React, { useState } from 'react';
import { Settings, Plus, Edit, Calendar, Users, TrendingUp, Camera, Share, Hash, List, Clock, BarChart3, Heart, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Toggle } from './ui/toggle';

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
}

interface ProfileScreenProps {
  onCreateEvent: () => void;
  userEvents: PublicEvent[];
  mediaItems: MediaItem[];
  onEditEvent: (event: PublicEvent) => void;
}

export function ProfileScreen({ onCreateEvent, userEvents, mediaItems, onEditEvent }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [eventsViewMode, setEventsViewMode] = useState<'list' | 'timeline'>('timeline');

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

  // Calculate user stats
  const totalPhotosTaken = mediaItems.length;
  const totalLikes = mediaItems.reduce((sum, item) => sum + item.likes, 0);
  const totalShares = mediaItems.reduce((sum, item) => sum + item.shares, 0);
  const totalRevenue = mediaItems.reduce((sum, item) => sum + item.earnings, 0);
  const nftCount = mediaItems.filter(item => item.isNFT).length;
  
  // Calculate tags received (times the user has been tagged)
  const allTaggedPeople = mediaItems.flatMap(item => item.taggedPeople);
  const currentUserTags = allTaggedPeople.filter(person => person === 'alex_chen' || person === 'alexchen').length;
  const uniqueTaggers = new Set(mediaItems.filter(item => 
    item.taggedPeople.includes('alex_chen') || item.taggedPeople.includes('alexchen')
  ).map(item => item.capturedBy)).size;

  // Sort events by date for timeline
  const sortedEvents = [...userEvents].sort((a, b) => b.date.getTime() - a.date.getTime());

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

  return (
    <div className="pb-4">
      {/* Profile Header */}
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
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
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
            <div className="text-lg font-semibold">{currentUserTags}</div>
            <div className="text-xs text-muted-foreground">Tags</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-30 bg-background border-b">
          <TabsList className="w-full grid grid-cols-3 rounded-none h-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="px-4 py-4 space-y-4">
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

          {/* Tag Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Tag Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-semibold text-purple-600">{currentUserTags}</div>
                  <div className="text-xs text-muted-foreground">Times Tagged</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-blue-600">{uniqueTaggers}</div>
                  <div className="text-xs text-muted-foreground">People Who Tagged Me</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Popular tags:</div>
                <div className="flex flex-wrap gap-1">
                  {['artist', 'creative', 'photographer', 'event_organizer'].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
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
                pressed={eventsViewMode === 'list'}
                onPressedChange={() => setEventsViewMode('list')}
                className="h-8 px-2"
                size="sm"
              >
                <List className="h-4 w-4" />
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
              {eventsViewMode === 'timeline' ? (
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
              ) : (
                <div className="space-y-3">
                  {sortedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="px-4 py-4 space-y-6">
          {/* Revenue Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Revenue Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-600">{formatCurrency(totalRevenue)}</div>
                  <div className="text-xs text-muted-foreground">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-purple-600">{nftCount}</div>
                  <div className="text-xs text-muted-foreground">NFTs Minted</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Engagement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span>Total Likes</span>
                </div>
                <span className="font-medium">{totalLikes}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Share className="h-4 w-4 text-muted-foreground" />
                  <span>Total Shares</span>
                </div>
                <span className="font-medium">{totalShares}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span>Photos Captured</span>
                </div>
                <span className="font-medium">{totalPhotosTaken}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>Times Tagged</span>
                </div>
                <span className="font-medium">{currentUserTags}</span>
              </div>
            </CardContent>
          </Card>

          {/* Event Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img
                          src={event.thumbnail}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.photoCount} photos</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(event.date)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}