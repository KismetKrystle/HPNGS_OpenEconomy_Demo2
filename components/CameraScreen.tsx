import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Calendar, Users, X, FlipHorizontal, Zap, Grid3X3, Focus, Sun, Smartphone, Navigation, Plus, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

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

interface CameraScreenProps {
  publicEvents: PublicEvent[];
  artists: Artist[];
  mediaItems: MediaItem[];
  onCapture: (item: Omit<MediaItem, 'id' | 'createdAt' | 'capturedBy' | 'likes' | 'shares' | 'earnings'>) => void;
  onNavigateHome: () => void;
  preSelectedEvent?: PublicEvent | null;
  onEventDeselect?: () => void;
}

export function CameraScreen({ 
  publicEvents, 
  artists,
  mediaItems,
  onCapture, 
  onNavigateHome, 
  preSelectedEvent,
  onEventDeselect 
}: CameraScreenProps) {
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(preSelectedEvent || null);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const [focusPoint, setFocusPoint] = useState<{x: number, y: number} | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update selected event when preSelectedEvent changes
  useEffect(() => {
    if (preSelectedEvent) {
      setSelectedEvent(preSelectedEvent);
    }
  }, [preSelectedEvent]);

  // Mock camera stream - in real app this would use getUserMedia
  const mockCameraStream = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop';

  const handleCapture = async () => {
    setIsCapturing(true);
    
    // Simulate camera capture delay
    setTimeout(() => {
      // Generate a mock captured image (in real app, this would be from camera)
      const capturedImageSrc = selectedEvent 
        ? `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&t=${Date.now()}`
        : `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&t=${Date.now()}`;

      const mediaItem: Omit<MediaItem, 'id' | 'createdAt' | 'capturedBy' | 'likes' | 'shares' | 'earnings'> = {
        src: capturedImageSrc,
        type: cameraMode,
        title: selectedEvent ? `${selectedEvent.name} - ${new Date().toLocaleTimeString()}` : `Photo - ${new Date().toLocaleTimeString()}`,
        tags: selectedEvent ? [selectedEvent.category, selectedEvent.name.toLowerCase().replace(/\s+/g, '_')] : ['captured'],
        taggedPeople: selectedEvent?.associatedArtists || [],
        status: 'pending',
        eventId: selectedEvent?.id,
      };

      onCapture(mediaItem);
      setIsCapturing(false);
      
      // Brief success feedback
      setTimeout(() => {
        // Could show success animation here
      }, 100);
    }, 500);
  };

  const handleEventSelect = (event: PublicEvent | null) => {
    setSelectedEvent(event);
    if (event === null && preSelectedEvent && onEventDeselect) {
      onEventDeselect();
    }
  };

  const handleViewfinderTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setFocusPoint({ x, y });
    
    // Clear focus point after animation
    setTimeout(() => {
      setFocusPoint(null);
    }, 1500);
  };

  const formatEventDate = (date: Date) => {
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

  const nearbyEvents = publicEvents.slice(0, 8); // Show top 8 nearby events
  const liveArtists = artists.filter(artist => artist.isLive);
  const recentPhotos = mediaItems.slice(0, 12); // Show last 12 photos

  const handlePhotoSelect = (photo: MediaItem) => {
    setSelectedPhoto(photo);
    // Could open a modal to add to event or tag people
  };

  const addToEvent = (photoId: string, eventId: string) => {
    // Logic to associate photo with event
    setSelectedPhoto(null);
  };

  const addTags = (photoId: string, tags: string[]) => {
    // Logic to add tags to photo
    setSelectedPhoto(null);
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      {/* Extended Camera Viewfinder - Takes up most of the screen */}
      <div className="flex-1 relative overflow-hidden">
        {/* Mock Camera Stream */}
        <div 
          className="w-full h-full relative bg-black cursor-crosshair"
          onClick={handleViewfinderTap}
        >
          <img 
            src={mockCameraStream}
            alt="Camera viewfinder"
            className="w-full h-full object-cover"
          />
          
          {/* Camera Overlay UI */}
          <div className="absolute inset-0">
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateHome}
                className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFlashMode(flashMode === 'off' ? 'on' : flashMode === 'on' ? 'auto' : 'off')}
                  className={`bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm ${
                    flashMode === 'on' ? 'bg-yellow-500/50' : flashMode === 'auto' ? 'bg-blue-500/50' : ''
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-xs ml-1 uppercase">{flashMode}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                >
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* "Capture a Happening" Text */}
            <div className="absolute top-20 left-4 right-4 text-center z-10">
              <div className="text-white text-lg font-medium mb-2 drop-shadow-lg">
                Capture a Happening
              </div>
            </div>

            {/* Focus Point Animation */}
            {focusPoint && (
              <div 
                className="absolute w-16 h-16 border-2 border-white rounded-full animate-ping z-10"
                style={{
                  left: `${focusPoint.x}%`,
                  top: `${focusPoint.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-2 border border-white rounded-full opacity-60"></div>
              </div>
            )}

            {/* Selected Event Indicator */}
            {selectedEvent && (
              <div className="absolute top-32 left-4 right-4 z-10">
                <Card className="bg-black/70 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getCategoryIcon(selectedEvent.category)}</span>
                        <div>
                          <h4 className="text-white text-xs font-medium">{selectedEvent.name}</h4>
                          <p className="text-white/70 text-xs">{selectedEvent.location}</p>
                          {preSelectedEvent && (
                            <p className="text-green-400 text-xs">📸 Ready to capture</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEventSelect(null)}
                        className="text-white hover:bg-white/20 p-1 h-auto"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Photos Horizontal Scroll */}
            <div className="absolute bottom-32 left-4 right-4 z-10">
              <div className="mb-3">
                <h4 className="text-white text-sm font-medium mb-2 drop-shadow-lg">Recent Captures</h4>
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                  {recentPhotos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => handlePhotoSelect(photo)}
                      className="min-w-16 h-16 bg-muted rounded-lg overflow-hidden border-2 border-white/30 hover:border-white transition-all"
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      {photo.eventId && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                  
                  {/* Add new photo placeholder */}
                  <button className="min-w-16 h-16 bg-black/50 rounded-lg border-2 border-dashed border-white/50 flex items-center justify-center hover:bg-black/70 transition-all">
                    <Plus className="h-6 w-6 text-white/70" />
                  </button>
                </div>
              </div>
            </div>

            {/* Camera Mode Toggle */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center bg-black/50 rounded-full p-1 backdrop-blur-sm">
                <Button
                  variant={cameraMode === 'photo' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCameraMode('photo')}
                  className={`rounded-full text-xs px-3 ${cameraMode === 'photo' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                >
                  Photo
                </Button>
                <Button
                  variant={cameraMode === 'video' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCameraMode('video')}
                  className={`rounded-full text-xs px-3 ${cameraMode === 'video' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                >
                  Video
                </Button>
              </div>
            </div>

            {/* Capture Button */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
              <Button
                onClick={handleCapture}
                disabled={isCapturing}
                className={`w-16 h-16 rounded-full border-4 border-white ${isCapturing ? 'animate-pulse' : ''} ${
                  cameraMode === 'photo' 
                    ? 'bg-white hover:bg-white/90 text-black' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isCapturing ? (
                  <div className="w-4 h-4 bg-current rounded-full animate-pulse" />
                ) : (
                  <div className={`w-8 h-8 ${
                    cameraMode === 'photo' 
                      ? 'bg-black rounded-full' 
                      : 'bg-white rounded-sm'
                  }`} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Near You Bar - Positioned above metrics and navigation */}
      <div className="absolute bottom-20 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-20">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <h3 className="text-sm font-medium">Live Near You</h3>
          </div>
          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            {nearbyEvents.filter(e => e.isLive).length + liveArtists.length} Live
          </Badge>
        </div>
      </div>

      {/* Stats Boxes - Positioned above navigation */}
      <div className="absolute bottom-16 left-3 right-3 flex justify-between pointer-events-none z-20">
        <div className="bg-background/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm">
          <div className="text-xs text-muted-foreground">Live Events</div>
          <div className="text-sm font-medium">{nearbyEvents.filter(e => e.isLive).length}</div>
        </div>
        <div className="bg-background/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm">
          <div className="text-xs text-muted-foreground">Live Artists</div>
          <div className="text-sm font-medium">{liveArtists.length}</div>
        </div>
        <div className="bg-background/90 backdrop-blur rounded-lg px-3 py-2 shadow-sm">
          <div className="text-xs text-muted-foreground">Distance</div>
          <div className="text-sm font-medium">2.4km</div>
        </div>
      </div>

      {/* Photo Selection Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-6 space-y-4 max-h-[50vh]">
            <div className="flex items-center justify-between">
              <h3>Add to Event or Tag</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPhoto(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="aspect-square w-24 bg-muted rounded-lg overflow-hidden">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Add to Event</h4>
                <div className="flex flex-wrap gap-2">
                  {nearbyEvents.slice(0, 3).map((event) => (
                    <Button
                      key={event.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addToEvent(selectedPhoto.id, event.id)}
                      className="text-xs"
                    >
                      {event.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Add Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {['music', 'art', 'food', 'performance'].map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => addTags(selectedPhoto.id, [tag])}
                      className="text-xs"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}