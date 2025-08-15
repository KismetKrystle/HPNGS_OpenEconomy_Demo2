import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  MapPin,
  Calendar,
  Users,
  X,
  FlipHorizontal,
  Zap,
  Grid3X3,
  Focus,
  Sun,
  Smartphone,
  Navigation,
  Plus,
  Tag,
  Eye,
  CheckCircle,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Slider } from "./ui/slider";
import { MediaItem, PublicEvent, Artist } from '../types/events';

interface CameraScreenProps {
  publicEvents: PublicEvent[];
  artists: Artist[];
  mediaItems: MediaItem[];
  onCapture: (
    item: Omit<
      MediaItem,
      | "id"
      | "createdAt"
      | "capturedBy"
      | "likes"
      | "shares"
      | "earnings"
    >,
  ) => void;
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
  onEventDeselect,
}: CameraScreenProps) {
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(
    preSelectedEvent || null
  );
  const [cameraMode, setCameraMode] = useState<"image" | "video">("image");
  const [flashMode, setFlashMode] = useState<"off" | "on" | "auto">("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [focusPoint, setFocusPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);
  
  // Drawer states
  const [activeDrawer, setActiveDrawer] = useState<'events' | 'artists' | 'distance' | null>(null);
  const [distanceRange, setDistanceRange] = useState([25]); // Default 25m
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [autoStart, setAutoStart] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' &&
        window.localStorage.getItem('hpgns_camera_autostart') === '1';
    } catch {
      return false;
    }
  });

  // Update selected event when preSelectedEvent changes
  useEffect(() => {
    if (preSelectedEvent) {
      setSelectedEvent(preSelectedEvent);
    }
  }, [preSelectedEvent]);

  // Mock camera stream for fallback when camera is not active or denied
  const mockCameraStream =
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop";

  // Start camera with permissions, prefer rear camera on mobile
  const startCamera = async () => {
    setCameraError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      setStream(media);
      // Persist preference to auto-start next time
      try { window.localStorage.setItem('hpgns_camera_autostart', '1'); } catch {}
      setAutoStart(true);
    } catch (err: any) {
      const message = err?.name === 'NotAllowedError'
        ? 'Camera permission denied. You can allow it in your browser settings.'
        : err?.message || 'Unable to start camera.';
      setCameraError(message);
    }
  };

  // Stop camera and release tracks
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  };

  // Bind stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      // Modern browsers support srcObject; cast for TS
      (videoRef.current as any).srcObject = stream;
    }
  }, [stream]);

  // Auto-start after first successful permission
  useEffect(() => {
    if (autoStart && !stream) {
      startCamera();
    }
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
    // We intentionally exclude startCamera from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  const handleCapture = async () => {
    setIsCapturing(true);

    // Simulate camera capture delay
    setTimeout(() => {
      // Generate a mock captured image (in real app, this would be from camera)
      const capturedImageSrc = selectedEvent
        ? `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&t=${Date.now()}`
        : `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&t=${Date.now()}`;

      const mediaItem: Omit<
        MediaItem,
        | "id"
        | "createdAt"
        | "capturedBy"
        | "likes"
        | "shares"
        | "earnings"
      > = {
        src: capturedImageSrc,
        type: cameraMode,
        title: selectedEvent
          ? `${selectedEvent.name} - ${new Date().toLocaleTimeString()}`
          : `Photo - ${new Date().toLocaleTimeString()}`,
        tags: selectedEvent
          ? [
              selectedEvent.category,
              selectedEvent.name.toLowerCase().replace(/\s+/g, "_"),
            ]
          : ["captured"],
        taggedPeople: selectedEvent?.associatedArtists || [],
        status: "pending",
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "music":
        return "🎵";
      case "art":
        return "🎨";
      case "food":
        return "🍽️";
      case "tech":
        return "💻";
      default:
        return "📅";
    }
  };

  const nearbyEvents = publicEvents.slice(0, 8); // Show top 8 nearby events
  const liveEvents = nearbyEvents.filter((e) => e.isLive);
  const liveArtists = artists.filter((artist) => artist.isLive);
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

  // Handle metric button clicks
  const handleMetricClick = (type: 'events' | 'artists' | 'distance') => {
    if (activeDrawer === type) {
      setActiveDrawer(null);
    } else {
      setActiveDrawer(type);
    }
  };

  // Handle event selection from drawer
  const handleEventFromDrawer = (event: PublicEvent, action: 'select' | 'view') => {
    if (action === 'select') {
      setSelectedEvent(event);
      setActiveDrawer(null);
    } else if (action === 'view') {
      // In a real app, this would navigate to the event profile
      // For now, we'll just select it and close the drawer
      setSelectedEvent(event);
      setActiveDrawer(null);
    }
  };

  // Handle artist selection from drawer
  const handleArtistFromDrawer = (artist: Artist, action: 'select' | 'view') => {
    if (action === 'select') {
      // In a real app, this might tag future photos with this artist
      setActiveDrawer(null);
    } else if (action === 'view') {
      // In a real app, this would navigate to the artist profile
      setActiveDrawer(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Camera Viewfinder - Extends from top to just above Recent Captures */}
      <div className="flex-1 relative overflow-hidden">
        {/* Camera View */}
        <div
          className="w-full h-full relative bg-black cursor-crosshair"
          onClick={handleViewfinderTap}
        >
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mockCameraStream}
              alt="Camera viewfinder (mock)"
              className="w-full h-full object-cover"
            />
          )}

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
                  onClick={() =>
                    setFlashMode(
                      flashMode === "off"
                        ? "on"
                        : flashMode === "on"
                          ? "auto"
                          : "off"
                    )
                  }
                  className={`bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm ${
                    flashMode === "on"
                      ? "bg-yellow-500/50"
                      : flashMode === "auto"
                        ? "bg-blue-500/50"
                        : ""
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-xs ml-1 uppercase">{flashMode}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Simple flip by restarting with opposite facing if active
                    if (!navigator?.mediaDevices?.getUserMedia) return;
                    const facing = stream ? 'user' : 'environment';
                    stopCamera();
                    navigator.mediaDevices.getUserMedia({
                      video: { facingMode: { ideal: facing === 'user' ? 'environment' : 'user' } },
                      audio: false,
                    }).then(media => setStream(media)).catch(() => {/* ignore */});
                  }}
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

            {/* Center Prompt: Start Camera on first use */}
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center space-y-3">
                  <div className="text-white text-xl font-medium drop-shadow-lg">
                    Capture a Happening
                  </div>
                  <Button
                    onClick={startCamera}
                    className="bg-white text-black hover:bg-white/90 rounded-full px-5"
                  >
                    <Camera className="h-4 w-4 mr-2" /> Start Camera
                  </Button>
                  {cameraError && (
                    <div className="text-xs text-red-300 max-w-xs mx-auto">
                      {cameraError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Focus Point Animation */}
            {focusPoint && (
              <div
                className="absolute w-16 h-16 border-2 border-white rounded-full animate-ping z-10"
                style={{
                  left: `${focusPoint.x}%`,
                  top: `${focusPoint.y}%`,
                  transform: "translate(-50%, -50%)",
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
                        <span className="text-sm">
                          {getCategoryIcon(selectedEvent.category)}
                        </span>
                        <div>
                          <h4 className="text-white text-xs font-medium">
                            {selectedEvent.name}
                          </h4>
                          <p className="text-white/70 text-xs">
                            {selectedEvent.location}
                          </p>
                          {preSelectedEvent && (
                            <p className="text-green-400 text-xs">
                              📸 Ready to capture
                            </p>
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

            {/* Camera Mode Toggle */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center bg-black/50 rounded-full p-1 backdrop-blur-sm">
                <Button
                  variant={cameraMode === "image" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCameraMode("image")}
                  className={`rounded-full text-xs px-3 ${
                    cameraMode === "image"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Photo
                </Button>
                <Button
                  variant={cameraMode === "video" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCameraMode("video")}
                  className={`rounded-full text-xs px-3 ${
                    cameraMode === "video"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/20"
                  }`}
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
                className={`w-16 h-16 rounded-full border-4 border-white ${
                  isCapturing ? "animate-pulse" : ""
                } ${
                  cameraMode === "image"
                    ? "bg-white hover:bg-white/90 text-black"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {isCapturing ? (
                  <div className="w-4 h-4 bg-current rounded-full animate-pulse" />
                ) : (
                  <div
                    className={`w-8 h-8 ${
                      cameraMode === "image"
                        ? "bg-black rounded-full"
                        : "bg-white rounded-sm"
                    }`}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Recent Captures, Metrics, Live Near You */}
      <div className="flex-shrink-0 bg-background">
        {/* Recent Captures - Top row */}
        <div className="px-4 pt-3 pb-2">
          <h4 className="text-foreground text-sm font-medium mb-2">
            Recent Captures
          </h4>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {recentPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handlePhotoSelect(photo)}
                className="min-w-16 h-16 bg-muted rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all relative"
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
            <button className="min-w-16 h-16 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:bg-accent transition-all">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Interactive Metrics Row */}
        <div className="px-4 pb-2">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleMetricClick('events')}
              className={`flex-1 mr-2 bg-card rounded-lg px-3 py-2 border shadow-sm hover:bg-accent ${
                activeDrawer === 'events' ? 'bg-accent' : ''
              }`}
            >
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Live Events</div>
                <div className="text-sm font-medium text-foreground">
                  {liveEvents.length}
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleMetricClick('artists')}
              className={`flex-1 mx-1 bg-card rounded-lg px-3 py-2 border shadow-sm hover:bg-accent ${
                activeDrawer === 'artists' ? 'bg-accent' : ''
              }`}
            >
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Live Artists</div>
                <div className="text-sm font-medium text-foreground">
                  {liveArtists.length}
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleMetricClick('distance')}
              className={`flex-1 ml-2 bg-card rounded-lg px-3 py-2 border shadow-sm hover:bg-accent ${
                activeDrawer === 'distance' ? 'bg-accent' : ''
              }`}
            >
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Distance</div>
                <div className="text-sm font-medium text-foreground">{distanceRange[0]}m</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Live Near You Bar - Bottom row */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-foreground" />
              <h3 className="text-sm font-medium text-foreground">
                Live Near You
              </h3>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-green-500/10 text-green-700 border-green-300"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              {liveEvents.length + liveArtists.length} Live
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Drawers */}
      {activeDrawer === 'events' && (
        <div className="fixed inset-x-0 bottom-0 bg-background border-t border-border z-50 max-h-96 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Live Events Near You</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveDrawer(null)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {liveEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={event.thumbnail}
                      alt={event.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{event.name}</h4>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs">{getCategoryIcon(event.category)}</span>
                        <Badge variant="outline" className="text-xs">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          Live
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEventFromDrawer(event, 'view')}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEventFromDrawer(event, 'select')}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeDrawer === 'artists' && (
        <div className="fixed inset-x-0 bottom-0 bg-background border-t border-border z-50 max-h-96 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Live Artists Near You</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveDrawer(null)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {liveArtists.map((artist) => (
                <div key={artist.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{artist.name}</h4>
                      <p className="text-xs text-muted-foreground">@{artist.handle}</p>
                      <p className="text-xs text-muted-foreground">{artist.location}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs">{getCategoryIcon(artist.category)}</span>
                        <Badge variant="outline" className="text-xs">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          Live
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleArtistFromDrawer(artist, 'view')}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleArtistFromDrawer(artist, 'select')}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeDrawer === 'distance' && (
        <div className="fixed inset-x-0 bottom-0 bg-background border-t border-border z-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Distance Range</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveDrawer(null)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-medium">{distanceRange[0]}m</div>
                <div className="text-sm text-muted-foreground">Search radius</div>
              </div>
              <Slider
                value={distanceRange}
                onValueChange={setDistanceRange}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1m</span>
                <span>100m</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Selection Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-6 space-y-4 max-h-[50vh]">
            <div className="flex items-center justify-between">
              <h3>Add to Event or Tag</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
              >
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
                  {["music", "art", "food", "performance"].map((tag) => (
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
