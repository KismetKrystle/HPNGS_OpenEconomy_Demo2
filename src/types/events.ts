// Centralized domain types for events, media, artists
// This module exports types only; no runtime code.

export interface EventAnalytics {
  totalShows: number;
  totalRevenue: number;
  totalLikes: number;
  totalShares: number;
  attendeesCount: number;
  performersCount: number;
}

export interface EventSignup {
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

export interface MediaItem {
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

export interface Artist {
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

export interface PublicEvent {
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
  analytics?: EventAnalytics;
  signups?: EventSignup[];
  category: 'music' | 'art' | 'food' | 'tech' | 'other';
  associatedArtists?: string[];
  isLive?: boolean;
  coordinates?: { lat: number; lng: number };
}

