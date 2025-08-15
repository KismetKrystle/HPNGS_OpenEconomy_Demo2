import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Camera, Plus, X, Users, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MediaItem, PublicEvent } from '../types/events';

interface EventCreationScreenProps {
  onCreateEvent: (eventData: Omit<PublicEvent, 'id' | 'analytics' | 'signups' | 'creatorId' | 'creatorName'>) => void;
  onBack: () => void;
}

export function EventCreationScreen({ onCreateEvent, onBack }: EventCreationScreenProps) {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState<'music' | 'art' | 'food' | 'tech' | 'other'>('other');
  const [eventDates, setEventDates] = useState<string[]>(['']);
  const [eventThumbnail, setEventThumbnail] = useState('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop');
  const [associatedArtists, setAssociatedArtists] = useState<string[]>([]);
  const [newArtistInput, setNewArtistInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const addEventDate = () => {
    setEventDates([...eventDates, '']);
  };

  const removeEventDate = (index: number) => {
    if (eventDates.length > 1) {
      setEventDates(eventDates.filter((_, i) => i !== index));
    }
  };

  const updateEventDate = (index: number, value: string) => {
    const newDates = [...eventDates];
    newDates[index] = value;
    setEventDates(newDates);
  };

  const addArtist = () => {
    if (newArtistInput.trim() && !associatedArtists.includes(newArtistInput.trim())) {
      setAssociatedArtists([...associatedArtists, newArtistInput.trim()]);
      setNewArtistInput('');
    }
  };

  const removeArtist = (artistToRemove: string) => {
    setAssociatedArtists(associatedArtists.filter(artist => artist !== artistToRemove));
  };

  const handleArtistInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addArtist();
    }
  };

  const handleCreateEvent = async () => {
    if (!eventName || !eventDescription || !eventLocation || eventDates.some(date => !date)) {
      return;
    }

    setIsCreating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validDates = eventDates
      .filter(date => date)
      .map(date => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());

    onCreateEvent({
      name: eventName,
      description: eventDescription,
      location: eventLocation,
      category: eventCategory,
      date: validDates[0],
      eventDates: validDates,
      thumbnail: eventThumbnail,
      photoCount: 0,
      photos: [],
      associatedArtists: associatedArtists.length > 0 ? associatedArtists : undefined
    });

    setIsCreating(false);
  };

  const isFormValid = eventName && eventDescription && eventLocation && eventDates.every(date => date);

  const thumbnailOptions = [
    { id: 'art', src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop', name: 'Art Gallery' },
    { id: 'music', src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', name: 'Concert' },
    { id: 'wedding', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop', name: 'Wedding' },
    { id: 'performance', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&h=300&fit=crop', name: 'Performance' },
    { id: 'food', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop', name: 'Food Event' },
    { id: 'reception', src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=300&h=300&fit=crop', name: 'Reception' }
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1>Create Event</h1>
          </div>
          <Button 
            onClick={handleCreateEvent}
            disabled={!isFormValid || isCreating}
            size="sm"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Event Thumbnail Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Event Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={eventThumbnail}
                  alt="Event thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {thumbnailOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setEventThumbnail(option.src)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    eventThumbnail === option.src 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={option.src}
                    alt={option.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event-name">Event Name *</Label>
              <Input
                id="event-name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="event-category">Category *</Label>
              <Select value={eventCategory} onValueChange={(value: 'music' | 'art' | 'food' | 'tech' | 'other') => setEventCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="food">Food & Drink</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event-location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="event-location"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Enter event location"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="event-description">Description *</Label>
              <Textarea
                id="event-description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Describe your event, what attendees can expect, requirements, etc."
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {eventDescription.length}/500 characters
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Event Dates</span>
              </div>
              <Button variant="outline" size="sm" onClick={addEventDate}>
                <Plus className="h-4 w-4 mr-1" />
                Add Date
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {eventDates.map((date, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => updateEventDate(index, e.target.value)}
                  className="flex-1"
                  min={new Date().toISOString().slice(0, 16)}
                />
                {eventDates.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEventDate(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Associated Artists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Featured Artists</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Tag artists who will be featured at this event. This helps with discovery and photo tagging.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Artist Input */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={newArtistInput}
                  onChange={(e) => setNewArtistInput(e.target.value)}
                  onKeyPress={handleArtistInputKeyPress}
                  placeholder="Enter artist username or handle"
                  className="pl-10"
                  maxLength={50}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addArtist}
                disabled={!newArtistInput.trim() || associatedArtists.includes(newArtistInput.trim())}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Artists */}
            {associatedArtists.length > 0 && (
              <div>
                <Label className="text-sm">Featured Artists ({associatedArtists.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {associatedArtists.map((artist) => (
                    <Badge
                      key={artist}
                      variant="secondary"
                      className="flex items-center space-x-1 pl-2 pr-1 py-1"
                    >
                      <Hash className="h-3 w-3" />
                      <span>{artist}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArtist(artist)}
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Artists */}
            {associatedArtists.length === 0 && (
              <div>
                <Label className="text-sm">Popular Artists</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['kismet', 'lunar_dreams', 'paint_wizard', 'digital_soul', 'jazz_master', 'blue_notes'].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewArtistInput(suggestion);
                        setAssociatedArtists([...associatedArtists, suggestion]);
                        setNewArtistInput('');
                      }}
                      className="text-xs h-7"
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={eventThumbnail}
                  alt="Event preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="line-clamp-1">
                    {eventName || 'Event Name'}
                  </h3>
                  <Badge className={
                    eventCategory === 'music' ? 'bg-purple-100 text-purple-800' :
                    eventCategory === 'art' ? 'bg-blue-100 text-blue-800' :
                    eventCategory === 'food' ? 'bg-orange-100 text-orange-800' :
                    eventCategory === 'tech' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {eventCategory}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">by Alex Chen</p>
                
                {/* Associated Artists Preview */}
                {associatedArtists.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {associatedArtists.slice(0, 3).map((artist) => (
                      <Badge key={artist} variant="outline" className="text-xs">
                        #{artist}
                      </Badge>
                    ))}
                    {associatedArtists.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{associatedArtists.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{eventLocation || 'Location'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {eventDates.filter(d => d).length > 0 
                        ? `${eventDates.filter(d => d).length} date${eventDates.filter(d => d).length > 1 ? 's' : ''}`
                        : 'No dates set'
                      }
                    </span>
                  </div>
                  {associatedArtists.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{associatedArtists.length} artist{associatedArtists.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Success</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Use a clear, attractive event image that represents your event</p>
              <p>• Write a detailed description explaining what attendees can expect</p>
              <p>• Set realistic dates and communicate any requirements clearly</p>
              <p>• Respond promptly to performer and attendee applications</p>
              <p>• Share photos during and after the event to build your portfolio</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
