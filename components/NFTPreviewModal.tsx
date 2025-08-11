import React, { useState } from 'react';
import { X, ExternalLink, Tag, Users, Calendar, Coins, Heart, Share, Camera, HelpCircle, Eye, EyeOff, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Switch } from './ui/switch';

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
  nftMetadata?: {
    blockchain: string;
    tokenId: string;
    collection: string;
  };
}

interface NFTPreviewModalProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  onMintNFT: (id: string, nftMetadata: { blockchain: string; tokenId: string; collection: string }) => void;
}

export function NFTPreviewModal({ item, isOpen, onClose, onMintNFT }: NFTPreviewModalProps) {
  const [showEarnings, setShowEarnings] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const handleMintNFT = async () => {
    setIsMinting(true);
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockNFTData = {
      blockchain: 'Ethereum',
      tokenId: Math.floor(Math.random() * 10000).toString(),
      collection: 'Creative Moments'
    };
    
    onMintNFT(item.id, mockNFTData);
    setIsMinting(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatEarnings = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{item.title}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            View detailed information, engagement stats, and NFT options for this captured moment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Media Preview */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.isNFT && (
              <Badge className="absolute top-3 right-3" variant="secondary">
                <Coins className="h-3 w-3 mr-1" />
                NFT
              </Badge>
            )}
          </div>

          {/* Creator and Social Stats */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Camera className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Captured by {item.capturedBy}</p>
                <p className="text-sm text-muted-foreground">
                  {item.createdAt.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Social Engagement */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Heart className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium">{formatNumber(item.likes)}</p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Share className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium">{formatNumber(item.shares)}</p>
                  <p className="text-xs text-muted-foreground">Shares</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Earnings Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-medium">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeOff className="h-3 w-3 text-muted-foreground" />
              <Switch
                checked={showEarnings}
                onCheckedChange={setShowEarnings}
              />
              <Eye className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>

          {showEarnings && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">Total Earnings</span>
                <span className="font-medium text-green-900">
                  {formatEarnings(item.earnings)}
                </span>
              </div>
              {item.earnings === 0 && (
                <p className="text-xs text-green-700 mt-1">
                  No revenue generated yet
                </p>
              )}
            </div>
          )}

          {/* NFT Section */}
          {!item.isNFT ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Mint as NFT</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">
                        NFTs (Non-Fungible Tokens) are unique digital certificates that prove ownership of digital assets like art, photos, and videos. Minting creates a blockchain record of your creative work, potentially allowing for resale and royalties.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                onClick={handleMintNFT}
                disabled={isMinting}
                className="w-full"
                size="lg"
              >
                {isMinting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Minting NFT...
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4 mr-2" />
                    Mint as NFT
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Minting will create a unique blockchain certificate for this creative work
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">NFT Details</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blockchain:</span>
                  <span className="font-medium">{item.nftMetadata?.blockchain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token ID:</span>
                  <span className="font-medium">#{item.nftMetadata?.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Collection:</span>
                  <span className="font-medium">{item.nftMetadata?.collection}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Blockchain
              </Button>
            </div>
          )}

          <Separator />

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tagged People */}
          {item.taggedPeople.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tagged People</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.taggedPeople.map(person => (
                  <Badge key={person} variant="secondary">
                    @{person}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium">Status:</span>
            <Badge 
              variant={
                item.status === 'approved' ? 'default' : 
                item.status === 'rejected' ? 'destructive' : 
                'secondary'
              }
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}