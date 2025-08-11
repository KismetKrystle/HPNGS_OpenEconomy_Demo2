import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Tag, TrendingUp, ExternalLink, BookOpen, Coins, Users, Clock, Search, Filter, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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

interface GalleryScreenProps {
  items: MediaItem[];
  onMintNFT: (id: string, nftMetadata: { blockchain: string; tokenId: string; collection: string; value?: number; description?: string }) => void;
  eventTitle?: string;
  onBack?: () => void;
}

export function GalleryScreen({ items, onMintNFT, eventTitle, onBack }: GalleryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-high' | 'price-low' | 'popular'>('recent');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-1' | '1-5' | 'over-5'>('all');
  const [selectedNFT, setSelectedNFT] = useState<MediaItem | null>(null);

  // Filter NFT items only
  const nftItems = items.filter(item => item.isNFT && item.nftMetadata);

  const filteredItems = nftItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    const price = item.nftMetadata?.value || 0;
    switch (priceFilter) {
      case 'under-1': return price < 1;
      case '1-5': return price >= 1 && price <= 5;
      case 'over-5': return price > 5;
      default: return true;
    }
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'price-high':
        return (b.nftMetadata?.value || 0) - (a.nftMetadata?.value || 0);
      case 'price-low':
        return (a.nftMetadata?.value || 0) - (b.nftMetadata?.value || 0);
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} ETH`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUsageDescription = (item: MediaItem) => {
    const usages = [
      'Digital art collection',
      'Event photography NFT',
      'Exclusive content access',
      'Community membership token',
      'Artist collaboration piece'
    ];
    return usages[Math.floor(Math.random() * usages.length)];
  };

  const NFTCard = ({ item }: { item: MediaItem }) => (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
      onClick={() => setSelectedNFT(item)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-purple-500 text-white">
            NFT
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 text-white">
            {item.nftMetadata?.blockchain}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="text-white">
            <div className="text-lg font-semibold">
              {formatPrice(item.nftMetadata?.value || 0)}
            </div>
            <div className="text-xs opacity-90">{item.nftMetadata?.collection}</div>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <h4 className="text-sm font-medium mb-1 line-clamp-1">{item.title}</h4>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {item.nftMetadata?.description || getUsageDescription(item)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(item.createdAt)}</span>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="px-4 py-3">
          {onBack ? (
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="line-clamp-1">{eventTitle || 'NFT Marketplace'}</h1>
              </div>
            </div>
          ) : (
            <h1>NFT Marketplace</h1>
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Web3 Learning Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">New to NFTs & Web3?</h3>
                  <p className="text-xs text-muted-foreground">
                    Learn the basics and start your digital art journey
                  </p>
                </div>
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <ExternalLink className="h-3 w-3 mr-1" />
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold">{nftItems.length}</div>
              <div className="text-xs text-muted-foreground">Available NFTs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold">
                {formatPrice(nftItems.reduce((sum, item) => sum + (item.nftMetadata?.value || 0), 0))}
              </div>
              <div className="text-xs text-muted-foreground">Total Value</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold">
                {new Set(nftItems.map(item => item.capturedBy)).size}
              </div>
              <div className="text-xs text-muted-foreground">Artists</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NFTs, collections, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2">
            <Select value={sortBy} onValueChange={(value: 'recent' | 'price-high' | 'price-low' | 'popular') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="price-high">Price: High</SelectItem>
                <SelectItem value="price-low">Price: Low</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={(value: 'all' | 'under-1' | '1-5' | 'over-5') => setPriceFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1">Under 1 ETH</SelectItem>
                <SelectItem value="1-5">1-5 ETH</SelectItem>
                <SelectItem value="over-5">Over 5 ETH</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="mt-6">
            {sortedItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2">No NFTs found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search or filters to find more NFTs
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {sortedItems.map((item) => (
                  <NFTCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trending NFTs</h3>
              <div className="grid grid-cols-2 gap-4">
                {sortedItems
                  .sort((a, b) => b.likes - a.likes)
                  .slice(0, 6)
                  .map((item) => (
                    <NFTCard key={item.id} item={item} />
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collections" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Featured Collections</h3>
              <div className="space-y-3">
                {Array.from(new Set(nftItems.map(item => item.nftMetadata?.collection))).map((collection) => {
                  const collectionItems = nftItems.filter(item => item.nftMetadata?.collection === collection);
                  const totalValue = collectionItems.reduce((sum, item) => sum + (item.nftMetadata?.value || 0), 0);
                  
                  return (
                    <Card key={collection} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="grid grid-cols-2 gap-1 w-16 h-16">
                            {collectionItems.slice(0, 4).map((item, index) => (
                              <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                                <img
                                  src={item.src}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{collection}</h4>
                            <p className="text-sm text-muted-foreground">
                              {collectionItems.length} items • Floor: {formatPrice(Math.min(...collectionItems.map(item => item.nftMetadata?.value || 0)))}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Coins className="h-3 w-3" />
                                <span>{formatPrice(totalValue)} total</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{new Set(collectionItems.map(item => item.capturedBy)).size} owners</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-background w-full rounded-t-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2>NFT Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNFT(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedNFT.src}
                  alt={selectedNFT.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">{selectedNFT.title}</h3>
                <p className="text-muted-foreground">{selectedNFT.nftMetadata?.collection}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="text-2xl font-semibold">
                    {formatPrice(selectedNFT.nftMetadata?.value || 0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Creator</div>
                  <div className="font-medium">{selectedNFT.capturedBy}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Description</div>
                <p className="text-sm">
                  {selectedNFT.nftMetadata?.description || getUsageDescription(selectedNFT)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{selectedNFT.likes}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{selectedNFT.shares}</div>
                  <div className="text-xs text-muted-foreground">Shares</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{selectedNFT.nftMetadata?.tokenId}</div>
                  <div className="text-xs text-muted-foreground">Token ID</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1" size="lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                <Tag className="h-4 w-4 mr-2" />
                Make Offer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}