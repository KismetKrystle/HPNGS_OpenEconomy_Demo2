import React, { useState } from 'react';
import { Camera, Plus, Inbox, ShoppingBag, User, Home, Calendar, Settings } from 'lucide-react';
import { CameraScreen } from './components/CameraScreen';
import { UploadScreen } from './components/UploadScreen';
import { InboxScreen } from './components/InboxScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { HomeScreen } from './components/HomeScreen';
import { EventScreen } from './components/EventScreen';
import { EventProfileScreen } from './components/EventProfileScreen';
import { EventCreationScreen } from './components/EventCreationScreen';
import { LandingScreen } from './components/LandingScreen';
import { Button } from './components/ui/button';

type Screen = 'landing' | 'camera' | 'home' | 'upload' | 'inbox' | 'gallery' | 'profile' | 'events' | 'event-profile' | 'create-event';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const [selectedEventForProfile, setSelectedEventForProfile] = useState<PublicEvent | null>(null);
  const [preSelectedEventForCamera, setPreSelectedEventForCamera] = useState<PublicEvent | null>(null);
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop',
      type: 'image',
      title: 'Digital Art Piece',
      tags: ['digital', 'abstract'],
      taggedPeople: ['alice', 'bob'],
      status: 'pending',
      createdAt: new Date('2025-08-07'),
      capturedBy: 'Alex Chen',
      likes: 142,
      shares: 23,
      earnings: 350.75,
      isNFT: true,
      nftMetadata: {
        blockchain: 'Ethereum',
        tokenId: '1234',
        collection: 'Digital Dreams',
        value: 2.5,
        description: 'Exclusive digital artwork capturing the essence of abstract creativity'
      }
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=500&fit=crop',
      type: 'image',
      title: 'Concert Performance',
      tags: ['concert', 'performance', 'music'],
      taggedPeople: ['charlie'],
      status: 'approved',
      createdAt: new Date('2025-08-06'),
      capturedBy: 'Sarah Johnson',
      likes: 89,
      shares: 12,
      earnings: 245.50,
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=500&fit=crop',
      type: 'image',
      title: 'Wedding Ceremony',
      tags: ['wedding', 'ceremony', 'celebration'],
      taggedPeople: [],
      status: 'approved',
      createdAt: new Date('2025-08-05'),
      capturedBy: 'Mike Rodriguez',
      likes: 156,
      shares: 31,
      earnings: 890.25,
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
      type: 'image',
      title: 'Live Music Performance',
      tags: ['music', 'performance', 'live'],
      taggedPeople: ['david', 'jazz_master'],
      status: 'approved',
      createdAt: new Date('2025-08-04'),
      capturedBy: 'Emma Davis',
      likes: 203,
      shares: 45,
      earnings: 1250.75,
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop',
      type: 'image',
      title: 'Ocean Waves',
      tags: ['ocean', 'waves'],
      taggedPeople: [],
      status: 'approved',
      createdAt: new Date('2025-08-03'),
      capturedBy: 'Alex Chen',
      likes: 178,
      shares: 29,
      earnings: 520.30,
      isNFT: true,
      nftMetadata: {
        blockchain: 'Polygon',
        tokenId: '5678',
        collection: 'Ocean Dreams',
        value: 1.8,
        description: 'Mesmerizing capture of ocean waves in perfect harmony'
      }
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&h=500&fit=crop',
      type: 'image',
      title: 'Theater Performance',
      tags: ['theater', 'performance', 'stage'],
      taggedPeople: ['emma'],
      status: 'approved',
      createdAt: new Date('2025-08-02'),
      capturedBy: 'David Kim',
      likes: 94,
      shares: 18,
      earnings: 325.00,
    },
    {
      id: '7',
      src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
      type: 'image',
      title: 'Live Music Event',
      tags: ['music', 'concert', 'live'],
      taggedPeople: ['frank', 'grace'],
      status: 'approved',
      createdAt: new Date('2025-08-01'),
      capturedBy: 'Lisa Wong',
      likes: 267,
      shares: 52,
      earnings: 675.30,
      isNFT: true,
      nftMetadata: {
        blockchain: 'Ethereum',
        tokenId: '9999',
        collection: 'Live Moments',
        value: 3.2,
        description: 'Iconic moment from an unforgettable live performance'
      }
    }
  ]);

  // Artists data - Updated Luna Dreams avatar
  const [artists, setArtists] = useState<Artist[]>([
    {
      id: 'artist1',
      name: 'Luna Dreams',
      handle: 'lunar_dreams',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      category: 'music',
      isLive: true,
      followers: 15200,
      location: 'Downtown Studio',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'artist2',
      name: 'Paint Wizard',
      handle: 'paint_wizard',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      category: 'art',
      isLive: true,
      followers: 8900,
      location: 'Art District',
      coordinates: { lat: 40.7180, lng: -74.0020 }
    },
    {
      id: 'artist3',
      name: 'Jazz Master',
      handle: 'jazz_master',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      category: 'music',
      isLive: false,
      followers: 22100,
      location: 'Blue Note Venue',
      coordinates: { lat: 40.7100, lng: -74.0080 }
    },
    {
      id: 'artist4',
      name: 'Digital Soul',
      handle: 'digital_soul',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      category: 'art',
      isLive: true,
      followers: 12800,
      location: 'Tech Hub',
      coordinates: { lat: 40.7200, lng: -74.0010 }
    },
    {
      id: 'artist5',
      name: 'Chef Maria',
      handle: 'chef_maria',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop',
      category: 'food',
      isLive: true,
      followers: 18700,
      location: 'Culinary Center',
      coordinates: { lat: 40.7150, lng: -74.0040 }
    }
  ]);

  // Enhanced mock events data with analytics and signup functionality
  const [publicEvents, setPublicEvents] = useState<PublicEvent[]>([
    // Alex Chen's Events (for timeline display)
    {
      id: 'alex_event1',
      name: 'Creative Tech Showcase',
      location: 'Innovation Center',
      date: new Date('2025-09-20'),
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop',
      photoCount: 32,
      photos: [
        {
          id: 'ae1p1',
          src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Tech Demo',
          tags: ['tech', 'innovation'],
          taggedPeople: ['developer1', 'startup_founder'],
          status: 'approved',
          createdAt: new Date('2025-09-20'),
          capturedBy: 'Alex Chen',
          likes: 289,
          shares: 67,
          earnings: 1250.30,
        }
      ],
      creatorId: 'current_user',
      creatorName: 'Alex Chen',
      description: 'Showcasing the latest in creative technology and digital art. Join innovators and creators for an evening of inspiration.',
      eventDates: [new Date('2025-09-20')],
      analytics: {
        totalShows: 1,
        totalRevenue: 3400.75,
        totalLikes: 445,
        totalShares: 89,
        attendeesCount: 180,
        performersCount: 8
      },
      signups: [],
      category: 'tech',
      associatedArtists: ['digital_soul', 'tech_artist', 'vr_creator'],
      isLive: false,
      coordinates: { lat: 40.7180, lng: -74.0020 }
    },
    {
      id: 'alex_event2',
      name: 'Summer Art Festival',
      location: 'Downtown Plaza',
      date: new Date('2025-08-15'),
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=300&fit=crop',
      photoCount: 24,
      photos: [
        {
          id: 'ae2p1',
          src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Art Installation',
          tags: ['art', 'festival'],
          taggedPeople: ['artist1', 'visitor1'],
          status: 'approved',
          createdAt: new Date('2025-08-15'),
          capturedBy: 'Alex Chen',
          likes: 89,
          shares: 12,
          earnings: 890.50,
        },
        {
          id: 'ae2p2',
          src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Live Performance',
          tags: ['performance', 'music'],
          taggedPeople: ['performer1'],
          status: 'approved',
          createdAt: new Date('2025-08-15'),
          capturedBy: 'Alex Chen',
          likes: 156,
          shares: 23,
          earnings: 1120.25,
        }
      ],
      creatorId: 'current_user',
      creatorName: 'Alex Chen',
      description: 'An immersive art experience featuring local and international artists. Join us for three days of creativity, music, and community.',
      eventDates: [
        new Date('2025-08-15'),
        new Date('2025-08-16'),
        new Date('2025-08-17')
      ],
      analytics: {
        totalShows: 12,
        totalRevenue: 8450.75,
        totalLikes: 1203,
        totalShares: 184,
        attendeesCount: 234,
        performersCount: 18
      },
      signups: [],
      category: 'art',
      associatedArtists: ['kismet', 'lunar_dreams', 'paint_wizard', 'digital_soul'],
      isLive: true,
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 'alex_event3',
      name: 'Urban Photography Walk',
      location: 'Historic District',
      date: new Date('2025-07-28'),
      thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&h=300&fit=crop',
      photoCount: 45,
      photos: [
        {
          id: 'ae3p1',
          src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Street Photography',
          tags: ['photography', 'urban', 'street'],
          taggedPeople: ['photographer1', 'model1'],
          status: 'approved',
          createdAt: new Date('2025-07-28'),
          capturedBy: 'Alex Chen',
          likes: 234,
          shares: 56,
          earnings: 675.80,
        }
      ],
      creatorId: 'current_user',
      creatorName: 'Alex Chen',
      description: 'Explore the city through your lens. A guided photography walk capturing the essence of urban life and hidden architectural gems.',
      eventDates: [new Date('2025-07-28')],
      analytics: {
        totalShows: 1,
        totalRevenue: 1240.50,
        totalLikes: 567,
        totalShares: 134,
        attendeesCount: 45,
        performersCount: 3
      },
      signups: [],
      category: 'art',
      associatedArtists: ['street_photographer', 'urban_explorer'],
      isLive: false,
      coordinates: { lat: 40.7200, lng: -74.0010 }
    },
    {
      id: 'alex_event4',
      name: 'Indie Music Showcase',
      location: 'Riverside Amphitheater',
      date: new Date('2025-06-12'),
      thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop',
      photoCount: 38,
      photos: [
        {
          id: 'ae4p1',
          src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Indie Performance',
          tags: ['music', 'indie', 'live'],
          taggedPeople: ['indie_band', 'musician1'],
          status: 'approved',
          createdAt: new Date('2025-06-12'),
          capturedBy: 'Alex Chen',
          likes: 445,
          shares: 89,
          earnings: 1890.25,
        }
      ],
      creatorId: 'current_user',
      creatorName: 'Alex Chen',
      description: 'Discover emerging indie artists in an intimate outdoor setting. Supporting local musicians and creating unforgettable musical moments.',
      eventDates: [new Date('2025-06-12'), new Date('2025-06-13')],
      analytics: {
        totalShows: 6,
        totalRevenue: 5670.90,
        totalLikes: 1456,
        totalShares: 267,
        attendeesCount: 320,
        performersCount: 12
      },
      signups: [],
      category: 'music',
      associatedArtists: ['indie_collective', 'acoustic_duo', 'local_band'],
      isLive: false,
      coordinates: { lat: 40.7090, lng: -74.0070 }
    },
    {
      id: 'alex_event5',
      name: 'Community Art Workshop',
      location: 'Community Center',
      date: new Date('2025-05-05'),
      thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
      photoCount: 28,
      photos: [
        {
          id: 'ae5p1',
          src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Art Workshop',
          tags: ['workshop', 'community', 'art'],
          taggedPeople: ['art_teacher', 'student1'],
          status: 'approved',
          createdAt: new Date('2025-05-05'),
          capturedBy: 'Alex Chen',
          likes: 167,
          shares: 34,
          earnings: 450.60,
        }
      ],
      creatorId: 'current_user',
      creatorName: 'Alex Chen',
      description: 'Bringing art to the community through hands-on workshops. Teaching painting, sculpture, and mixed media to all ages.',
      eventDates: [new Date('2025-05-05'), new Date('2025-05-06')],
      analytics: {
        totalShows: 4,
        totalRevenue: 890.30,
        totalLikes: 289,
        totalShares: 67,
        attendeesCount: 85,
        performersCount: 6
      },
      signups: [],
      category: 'art',
      associatedArtists: ['community_artist', 'art_instructor'],
      isLive: false,
      coordinates: { lat: 40.7160, lng: -74.0050 }
    },
    {
      id: 'alex_event6',
      name: 'Digital Creator Meetup',
      location: 'Co-working Space',
      date: new Date('2025-03-18'),
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop',
      photoCount: 19,
      photos: [
        {
          id: 'ae6p1',
          src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Creator Meetup',
          tags: ['digital', 'creators', 'networking'],
          taggedPeople: ['content_creator', 'influencer1'],
          status: 'approved',
          createdAt: new Date('2025-03-18'),
          capturedBy: 'Alex Chen',
          likes: 356,
          shares: 78,
          earnings: 780.45,
        }
      ],
      creatorId: 'current_user',
      creatorName: 'Alex Chen',
      description: 'Monthly gathering for digital creators, influencers, and content makers. Share knowledge, collaborate, and grow together.',
      eventDates: [new Date('2025-03-18')],
      analytics: {
        totalShows: 1,
        totalRevenue: 1120.80,
        totalLikes: 678,
        totalShares: 156,
        attendeesCount: 65,
        performersCount: 8
      },
      signups: [],
      category: 'tech',
      associatedArtists: ['digital_creator', 'social_media_expert'],
      isLive: false,
      coordinates: { lat: 40.7140, lng: -74.0030 }
    },
    // Other creators' events
    {
      id: 'event2',
      name: 'Jazz Night Performance',
      location: 'Blue Note Venue',
      date: new Date('2025-08-12'),
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      photoCount: 18,
      photos: [
        {
          id: 'e2p1',
          src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Jazz Performance',
          tags: ['jazz', 'music', 'performance'],
          taggedPeople: ['speaker1', 'attendee1'],
          status: 'approved',
          createdAt: new Date('2025-08-12'),
          capturedBy: 'Event Photographer',
          likes: 78,
          shares: 15,
          earnings: 450.75,
        }
      ],
      creatorId: 'creator2',
      creatorName: 'Sarah Johnson',
      description: 'An intimate evening of jazz music featuring renowned local and touring musicians. Experience the magic of live jazz in our cozy venue.',
      eventDates: [
        new Date('2025-08-12'),
        new Date('2025-09-12'),
        new Date('2025-10-12')
      ],
      analytics: {
        totalShows: 8,
        totalRevenue: 2340.50,
        totalLikes: 567,
        totalShares: 89,
        attendeesCount: 156,
        performersCount: 12
      },
      signups: [],
      category: 'music',
      associatedArtists: ['jazz_master', 'blue_notes', 'midnight_keys'],
      isLive: true,
      coordinates: { lat: 40.7100, lng: -74.0080 }
    },
    {
      id: 'event3',
      name: 'Food & Wine Festival',
      location: 'Riverfront Park',
      date: new Date('2025-08-10'),
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop',
      photoCount: 35,
      photos: [
        {
          id: 'e3p1',
          src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=500&fit=crop',
          type: 'image',
          title: 'Gourmet Display',
          tags: ['food', 'festival'],
          taggedPeople: ['chef1', 'visitor2'],
          status: 'approved',
          createdAt: new Date('2025-08-10'),
          capturedBy: 'Event Photographer',
          likes: 234,
          shares: 45,
          earnings: 0,
        }
      ],
      creatorId: 'creator3',
      creatorName: 'Mike Rodriguez',
      description: 'Celebrate culinary excellence with renowned chefs, local wineries, and gourmet food vendors.',
      eventDates: [
        new Date('2025-08-10'),
        new Date('2025-08-11')
      ],
      analytics: {
        totalShows: 15,
        totalRevenue: 12750.25,
        totalLikes: 2145,
        totalShares: 298,
        attendeesCount: 387,
        performersCount: 25
      },
      signups: [],
      category: 'food',
      associatedArtists: ['chef_maria', 'wine_sommelier', 'pastry_king', 'grill_master', 'local_baker'],
      isLive: false,
      coordinates: { lat: 40.7150, lng: -74.0040 }
    }
  ]);

  const addMediaItem = (item: Omit<MediaItem, 'id' | 'createdAt' | 'capturedBy' | 'likes' | 'shares' | 'earnings'>) => {
    const newItem: MediaItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      capturedBy: 'Alex Chen',
      likes: 0,
      shares: 0,
      earnings: 0
    };
    setMediaItems(prev => [newItem, ...prev]);
  };

  const updateMediaStatus = (id: string, status: 'approved' | 'rejected') => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const mintNFT = (id: string, nftMetadata: { blockchain: string; tokenId: string; collection: string; value?: number; description?: string }) => {
    setMediaItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isNFT: true, nftMetadata } : item
      )
    );
  };

  const createEvent = (eventData: Omit<PublicEvent, 'id' | 'analytics' | 'signups' | 'creatorId' | 'creatorName'>) => {
    const newEvent: PublicEvent = {
      ...eventData,
      id: `event_${Date.now()}`,
      creatorId: 'current_user',
      creatorName: 'Alex Chen',
      analytics: {
        totalShows: 0,
        totalRevenue: 0,
        totalLikes: 0,
        totalShares: 0,
        attendeesCount: 0,
        performersCount: 0
      },
      signups: []
    };
    setPublicEvents(prev => [newEvent, ...prev]);
    setCurrentScreen('event-profile');
    setSelectedEventForProfile(newEvent);
  };

  const signupForEvent = (eventId: string, signupData: Omit<EventSignup, 'id' | 'signupDate' | 'status'>) => {
    const signup: EventSignup = {
      ...signupData,
      id: `signup_${Date.now()}`,
      signupDate: new Date(),
      status: 'pending'
    };

    setPublicEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, signups: [...event.signups, signup] }
          : event
      )
    );
  };

  const handleCapturePhotosForEvent = (eventId: string) => {
    const event = publicEvents.find(e => e.id === eventId);
    if (event) {
      setPreSelectedEventForCamera(event);
      setCurrentScreen('camera');
      setSelectedEventForProfile(null);
    }
  };

  // Navigation handler with debugging
  const handleNavigateToCamera = () => {
    console.log('🎯 handleNavigateToCamera called from App.tsx');
    console.log('Current screen before change:', currentScreen);
    setCurrentScreen('camera');
    setSelectedEvent(null);
    setSelectedEventForProfile(null);
    setPreSelectedEventForCamera(null);
    console.log('✅ Screen should now be set to camera');
  };

  const approvedItems = mediaItems.filter(item => item.status === 'approved');
  const pendingItems = mediaItems.filter(item => item.status === 'pending');
  const nftItems = mediaItems.filter(item => item.isNFT);

  // Hide app header on camera screen and landing screen for immersive experience
  const showAppHeader = currentScreen !== 'camera' && currentScreen !== 'landing';

  const renderScreen = () => {
    console.log('Current screen:', currentScreen); // Debug log

    if (currentScreen === 'landing') {
      console.log('🏠 Rendering LandingScreen with navigation handler');
      return (
        <LandingScreen
          onEnterSite={handleNavigateToCamera}
        />
      );
    }

    if (selectedEvent) {
      return (
        <GalleryScreen 
          items={selectedEvent.photos} 
          onMintNFT={mintNFT}
          eventTitle={selectedEvent.name}
          onBack={() => setSelectedEvent(null)}
        />
      );
    }

    if (selectedEventForProfile) {
      return (
        <EventProfileScreen
          event={selectedEventForProfile}
          onBack={() => {
            setSelectedEventForProfile(null);
            setCurrentScreen('events');
          }}
          onSignup={signupForEvent}
          onCapturePhotos={handleCapturePhotosForEvent}
        />
      );
    }

    switch (currentScreen) {
      case 'camera':
        console.log('Rendering CameraScreen'); // Debug log
        return (
          <CameraScreen
            publicEvents={publicEvents}
            artists={artists}
            mediaItems={mediaItems}
            onCapture={addMediaItem}
            onNavigateHome={() => setCurrentScreen('home')}
            preSelectedEvent={preSelectedEventForCamera}
            onEventDeselect={() => setPreSelectedEventForCamera(null)}
          />
        );
      case 'home':
        return (
          <HomeScreen 
            userItems={approvedItems} 
            publicEvents={publicEvents}
            artists={artists}
            onEventSelect={setSelectedEvent}
          />
        );
      case 'upload':
        return <UploadScreen onUpload={addMediaItem} />;
      case 'inbox':
        return <InboxScreen items={pendingItems} onUpdateStatus={updateMediaStatus} />;
      case 'gallery':
        return <GalleryScreen items={nftItems} onMintNFT={mintNFT} />;
      case 'events':
        return (
          <EventScreen 
            events={publicEvents}
            artists={artists}
            onEventSelect={(event) => {
              setSelectedEventForProfile(event);
              setCurrentScreen('event-profile');
            }}
          />
        );
      case 'create-event':
        return (
          <EventCreationScreen
            onCreateEvent={createEvent}
            onBack={() => setCurrentScreen('profile')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            onCreateEvent={() => setCurrentScreen('create-event')}
            userEvents={publicEvents.filter(event => event.creatorId === 'current_user')}
            mediaItems={mediaItems}
            onEditEvent={(event) => {
              setSelectedEventForProfile(event);
              setCurrentScreen('event-profile');
            }}
          />
        );
      default:
        console.log('Default case - rendering CameraScreen'); // Debug log
        return (
          <CameraScreen
            publicEvents={publicEvents}
            artists={artists}
            mediaItems={mediaItems}
            onCapture={addMediaItem}
            onNavigateHome={() => setCurrentScreen('home')}
            preSelectedEvent={preSelectedEventForCamera}
            onEventDeselect={() => setPreSelectedEventForCamera(null)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with App Name, Inbox, and Settings */}
      {showAppHeader && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setCurrentScreen('landing')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                <Camera className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-muted-foreground font-medium">Happenings</span>
            </button>
            
            {/* Right side buttons - Inbox and Settings */}
            <div className="flex items-center space-x-2">
              {/* Inbox Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentScreen('inbox');
                  setSelectedEvent(null);
                  setSelectedEventForProfile(null);
                  setPreSelectedEventForCamera(null);
                }}
                className="relative"
              >
                <Inbox className="h-5 w-5" />
                {pendingItems.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs min-w-5">
                    {pendingItems.length}
                  </div>
                )}
              </Button>

              {/* Settings Button - Only show on profile screen */}
              {(currentScreen === 'profile' || currentScreen === 'create-event') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Handle settings click
                    console.log('Settings clicked');
                  }}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${currentScreen === 'camera' ? 'pb-16' : currentScreen === 'landing' ? '' : 'pb-20'}`}>
        {renderScreen()}
      </div>

      {/* Bottom Navigation - Redesigned */}
      {currentScreen !== 'landing' && (
        <div className={`fixed bottom-0 left-0 right-0 ${currentScreen === 'camera' ? 'bg-black/80 backdrop-blur border-t border-white/20' : 'bg-white border-t border-border'}`}>
          <div className="grid grid-cols-5 h-16">
            <button
              onClick={() => {
                setCurrentScreen('home');
                setSelectedEvent(null);
                setSelectedEventForProfile(null);
                setPreSelectedEventForCamera(null);
              }}
              className={`flex flex-col items-center justify-center space-y-1 ${
                currentScreen === 'home' && !selectedEvent && !selectedEventForProfile 
                  ? 'text-primary' 
                  : currentScreen === 'camera' 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-muted-foreground'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => {
                setCurrentScreen('gallery');
                setSelectedEvent(null);
                setSelectedEventForProfile(null);
                setPreSelectedEventForCamera(null);
              }}
              className={`flex flex-col items-center justify-center space-y-1 ${
                currentScreen === 'gallery' 
                  ? 'text-primary' 
                  : currentScreen === 'camera' 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-muted-foreground'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs">Market</span>
            </button>

            {/* Centered Camera Button */}
            <button
              onClick={() => {
                setCurrentScreen('camera');
                setSelectedEvent(null);
                setSelectedEventForProfile(null);
                // Keep preSelectedEventForCamera if it exists
              }}
              className={`flex flex-col items-center justify-center space-y-1 ${
                currentScreen === 'camera' 
                  ? 'text-primary' 
                  : currentScreen === 'camera' 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-muted-foreground'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentScreen === 'camera' 
                  ? 'bg-white text-black' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Camera className="h-6 w-6" />
              </div>
              <span className={`text-xs ${currentScreen === 'camera' ? 'text-white' : ''}`}>Camera</span>
            </button>
            
            <button
              onClick={() => {
                setCurrentScreen('events');
                setSelectedEvent(null);
                setSelectedEventForProfile(null);
                setPreSelectedEventForCamera(null);
              }}
              className={`flex flex-col items-center justify-center space-y-1 ${
                currentScreen === 'events' || currentScreen === 'event-profile' 
                  ? 'text-primary' 
                  : currentScreen === 'camera' 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-muted-foreground'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Events</span>
            </button>
            
            <button
              onClick={() => {
                setCurrentScreen('profile');
                setSelectedEvent(null);
                setSelectedEventForProfile(null);
                setPreSelectedEventForCamera(null);
              }}
              className={`flex flex-col items-center justify-center space-y-1 ${
                currentScreen === 'profile' || currentScreen === 'create-event' 
                  ? 'text-primary' 
                  : currentScreen === 'camera' 
                    ? 'text-white/70 hover:text-white' 
                    : 'text-muted-foreground'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}