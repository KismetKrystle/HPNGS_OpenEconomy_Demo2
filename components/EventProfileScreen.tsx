import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share, Coins, TrendingUp, Camera, User, Clock, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

interface EventAnalytics {
  totalShows: number;
  totalRevenue: number;
  totalLikes: number;
  totalShares: number;
  attendeesCount: number;
  performersCount: number;
}

interface EventSignup {
  id: string;
  userId: string;
  userName: string;
  artistName?: string;
  profileName?: string;
  type: 'performer' | 'attendee';
  selectedDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  signupDate: Date;
}

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
  analytics: EventAnalytics;
  signups: EventSignup[];
  category: 'music' | 'art' | 'food' | 'tech' | 'other';
  associatedArtists?: string[];
}

interface EventProfileScreenProps {
  event: PublicEvent;
  onBack: () => void;
  onSignup: (eventId: string, signupData: Omit<EventSignup, 'id' | 'signupDate' | 'status'>) => void;
  onCapturePhotos?: (eventId: string) => void;
}

export function EventProfileScreen({ event, onBack, onSignup, onCapturePhotos }: EventProfileScreenProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [signupType, setSignupType] = useState<'performer' | 'attendee'>('attendee');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [signupName, setSignupName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [profileName, setProfileName] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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

  const handleSignup = () => {
    if (!selectedDate || !signupName) return;
    if (signupType === 'performer' && (!artistName || !profileName)) return;

    onSignup(event.id, {
      userId: 'current_user',
      userName: signupName,
      artistName: signupType === 'performer' ? artistName : undefined,
      profileName: signupType === 'performer' ? profileName : undefined,
      type: signupType,
      selectedDate: new Date(selectedDate)
    });

    setShowSignupForm(false);
    setSignupName('');
    setArtistName('');
    setProfileName('');
    setSignupMessage('');
    setSelectedDate('');
  };

  const upcomingDates = event.eventDates.filter(date => date.getTime() > new Date().getTime());

  // Get all tagged people from photos
  const allTaggedPeople = Array.from(new Set(
    event.photos.flatMap(photo => photo.taggedPeople)
  ));

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center px-4 py-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="line-clamp-1">{event.name}</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={event.thumbnail}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getCategoryColor(event.category)}>
                {event.category}
              </Badge>
              {isUpcoming(event.eventDates) && (
                <Badge className="bg-green-500 text-white">
                  Upcoming
                </Badge>
              )}
            </div>
            <h2 className="text-white mb-1">{event.name}</h2>
            <p className="text-white/80 text-sm">by {event.creatorName}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4 border-b bg-background">
        <div className="flex space-x-3">
          {upcomingDates.length > 0 && (
            <Button 
              onClick={() => setShowSignupForm(true)}
              className="flex-1"
            >
              Join Event
            </Button>
          )}
          
          {/* Camera Capture Button */}
          <Button
            variant="outline"
            onClick={() => onCapturePhotos?.(event.id)}
            className="flex items-center space-x-2"
          >
            <Camera className="h-4 w-4" />
            <span>Capture</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-16 z-30 bg-background border-b">
          <TabsList className="w-full grid grid-cols-3 rounded-none h-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="px-4 py-4 space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Event Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Event Dates</p>
                  <div className="space-y-1">
                    {event.eventDates.map((date, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
                        {date.getTime() > new Date().getTime() && (
                          <Badge variant="outline" className="text-xs">Available</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Organizer</p>
                  <p className="text-sm text-muted-foreground">{event.creatorName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Artists */}
          {event.associatedArtists && event.associatedArtists.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <span>Featured Artists</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.associatedArtists.map((artist) => (
                    <Badge key={artist} variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                      <Hash className="h-3 w-3" />
                      <span>{artist}</span>
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  These artists will be featured at this event. Photos taken at the event will automatically be tagged with these artists.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tagged Users */}
          {allTaggedPeople.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Tagged Users</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {allTaggedPeople.slice(0, 8).map((person) => (
                    <div key={person} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">@{person}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {allTaggedPeople.length > 8 && (
                  <p className="text-sm text-muted-foreground text-center mt-3">
                    +{allTaggedPeople.length - 8} more people tagged
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-3">
                  People who have been tagged in photos from this event.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Organizer Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Connect with {event.creatorName}</CardTitle>
            </CardHeader>
            <CardContent>
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
                  @alexchen.creates
                </Button>
                
                <Button variant="outline" size="sm" className="justify-start h-8 text-xs">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  AlexChenArtist
                </Button>
                
                <Button variant="outline" size="sm" className="justify-start h-8 text-xs">
                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 8.5h-3v3h3v-3zm-6 0h-3v3h3v-3zm3-3h-3v3h3v-3z"/>
                  </svg>
                  @alexchen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Signups */}
          {event.signups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Who's Joining</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.signups.slice(0, 5).map((signup) => (
                    <div key={signup.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          {signup.type === 'performer' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {signup.type === 'performer' && signup.artistName 
                              ? signup.artistName 
                              : signup.userName
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {signup.type === 'performer' && signup.profileName 
                              ? `@${signup.profileName} • ` 
                              : ''
                            }{signup.type} • {formatDate(signup.selectedDate)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={signup.status === 'confirmed' ? 'default' : 'secondary'}>
                        {signup.status}
                      </Badge>
                    </div>
                  ))}
                  {event.signups.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{event.signups.length - 5} more
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="px-4 py-4">
          {event.photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {event.photos.map((photo) => (
                <div key={photo.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">No photos yet</h3>
              <p className="text-muted-foreground mb-4">
                Photos from this event will appear here
              </p>
              <Button
                onClick={() => onCapturePhotos?.(event.id)}
                className="flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Start Capturing</span>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="px-4 py-4 space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold mb-1">
                  {event.analytics.totalShows}
                </div>
                <div className="text-sm text-muted-foreground">Total Shows</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold mb-1">
                  {formatCurrency(event.analytics.totalRevenue)}
                </div>
                <div className="text-sm text-muted-foreground">Revenue</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold mb-1">
                  {event.analytics.totalLikes}
                </div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold mb-1">
                  {event.analytics.totalShares}
                </div>
                <div className="text-sm text-muted-foreground">Total Shares</div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Engagement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Total Attendees</span>
                </div>
                <span className="font-medium">{event.analytics.attendeesCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Performers</span>
                </div>
                <span className="font-medium">{event.analytics.performersCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span>Photos Captured</span>
                </div>
                <span className="font-medium">{event.photoCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>Tagged Users</span>
                </div>
                <span className="font-medium">{allTaggedPeople.length}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2>Join Event</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSignupForm(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-type">I want to:</Label>
                <Select value={signupType} onValueChange={(value: 'performer' | 'attendee') => setSignupType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendee">Attend the event</SelectItem>
                    <SelectItem value="performer">Perform at the event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="signup-date">Select Date:</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event date" />
                  </SelectTrigger>
                  <SelectContent>
                    {upcomingDates.map((date, index) => (
                      <SelectItem key={index} value={date.toISOString()}>
                        {formatDate(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="signup-name">Your Name:</Label>
                <Input
                  id="signup-name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {signupType === 'performer' && (
                <>
                  <div>
                    <Label htmlFor="artist-name">Artist Name:</Label>
                    <Input
                      id="artist-name"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Your stage/artist name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="profile-name">Profile Handle:</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        id="profile-name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="yourhandle"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="signup-message">
                  {signupType === 'performer' ? 'Performance Details (Optional):' : 'Message (Optional):'}
                </Label>
                <Textarea
                  id="signup-message"
                  value={signupMessage}
                  onChange={(e) => setSignupMessage(e.target.value)}
                  placeholder={
                    signupType === 'performer' 
                      ? "Tell us about your act, requirements, etc."
                      : "Any special requests or notes"
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowSignupForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSignup} 
                disabled={
                  !selectedDate || 
                  !signupName || 
                  (signupType === 'performer' && (!artistName || !profileName))
                }
                className="flex-1"
              >
                {signupType === 'performer' ? 'Apply to Perform' : 'Reserve Spot'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}