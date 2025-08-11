import React, { useState } from 'react';
import { Check, X, Eye, Tag, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { NFTPreviewModal } from './NFTPreviewModal';

interface MediaItem {
  id: string;
  src: string;
  type: 'image' | 'video';
  title: string;
  tags: string[];
  taggedPeople: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  isNFT?: boolean;
  nftMetadata?: {
    blockchain: string;
    tokenId: string;
    collection: string;
  };
}

interface InboxScreenProps {
  items: MediaItem[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

export function InboxScreen({ items, onUpdateStatus }: InboxScreenProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleApprove = (id: string) => {
    onUpdateStatus(id, 'approved');
  };

  const handleReject = (id: string) => {
    onUpdateStatus(id, 'rejected');
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="mb-2">Inbox</h1>
        <p className="text-muted-foreground">
          {items.length} item{items.length !== 1 ? 's' : ''} pending review
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2">All caught up!</h3>
          <p className="text-muted-foreground">No items pending review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Media Preview */}
                <div className="aspect-square bg-muted relative">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.isNFT && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      NFT
                    </Badge>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 left-2"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tagged People */}
                  {item.taggedPeople.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {item.taggedPeople.map(person => (
                          <Badge key={person} variant="secondary" className="text-xs">
                            @{person}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(item.id)}
                      className="h-12 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(item.id)}
                      className="h-12 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* NFT Preview Modal */}
      {selectedItem && (
        <NFTPreviewModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}