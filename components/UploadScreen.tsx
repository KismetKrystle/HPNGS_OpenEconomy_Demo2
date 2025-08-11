import React, { useState } from 'react';
import { Camera, QrCode, Check, Image, Video, Tag, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface MediaItem {
  id: string;
  src: string;
  type: 'image' | 'video';
  title: string;
  tags: string[];
  taggedPeople: string[];
  status: 'pending' | 'approved' | 'rejected';
}

interface UploadScreenProps {
  onUpload: (item: Omit<MediaItem, 'id' | 'createdAt' | 'capturedBy' | 'likes' | 'shares' | 'earnings'>) => void;
}

// Mock recent photos from device
const recentPhotos = [
  {
    id: 'recent1',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-08T14:30:00')
  },
  {
    id: 'recent2',
    src: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-08T12:15:00')
  },
  {
    id: 'recent3',
    src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-08T10:45:00')
  },
  {
    id: 'recent4',
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-07T16:20:00')
  },
  {
    id: 'recent5',
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-07T14:10:00')
  },
  {
    id: 'recent6',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-07T09:30:00')
  },
  {
    id: 'recent7',
    src: 'https://images.unsplash.com/photo-1551913902-c92207136625?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-06T18:45:00')
  },
  {
    id: 'recent8',
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-06T15:20:00')
  },
  {
    id: 'recent9',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-06T12:00:00')
  },
  {
    id: 'recent10',
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-05T20:15:00')
  },
  {
    id: 'recent11',
    src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-05T17:30:00')
  },
  {
    id: 'recent12',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop',
    type: 'image' as const,
    timestamp: new Date('2025-08-05T14:45:00')
  }
];

export function UploadScreen({ onUpload }: UploadScreenProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [taggedPeople, setTaggedPeople] = useState('');

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  const handleContinue = () => {
    if (selectedPhotos.size > 0) {
      setShowUploadForm(true);
    }
  };

  const handleOpenCamera = () => {
    // In a real app, this would open the device camera
    setIsCameraMode(true);
    // Simulate camera capture
    setTimeout(() => {
      setIsCameraMode(false);
      // Auto-select the "captured" photo (first one for demo)
      setSelectedPhotos(new Set([recentPhotos[0].id]));
    }, 2000);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
    // Simulate QR scan completion
    setTimeout(() => {
      setShowQRScanner(false);
      // In a real app, this would process the QR code data
      alert('QR Code scanned successfully! Event details added to your photo.');
    }, 3000);
  };

  const handleUpload = () => {
    if (selectedPhotos.size === 0 || !title.trim()) return;

    selectedPhotos.forEach(photoId => {
      const photo = recentPhotos.find(p => p.id === photoId);
      if (photo) {
        onUpload({
          src: photo.src,
          type: photo.type,
          title: title.trim(),
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          taggedPeople: taggedPeople.split(',').map(person => person.trim()).filter(Boolean),
          status: 'pending'
        });
      }
    });

    // Reset form
    setSelectedPhotos(new Set());
    setTitle('');
    setTags('');
    setTaggedPeople('');
    setShowUploadForm(false);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Camera mode overlay
  if (isCameraMode) {
    return (
      <div className="flex flex-col h-full bg-black">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white rounded-full animate-pulse mx-auto mb-4"></div>
            <p>Camera is opening...</p>
            <p className="text-sm text-white/70 mt-2">Capturing your moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Action Bar */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleOpenCamera}
            size="lg"
            className="h-12"
          >
            <Camera className="h-5 w-5 mr-2" />
            Camera
          </Button>
          
          <Button
            onClick={handleQRScan}
            variant="outline"
            size="lg"
            className="h-12"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Scan QR
          </Button>
        </div>

        {selectedPhotos.size > 0 && (
          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full h-12"
          >
            <Check className="h-5 w-5 mr-2" />
            Continue with {selectedPhotos.size} photo{selectedPhotos.size !== 1 ? 's' : ''}
          </Button>
        )}
      </div>

      {/* Recent Photos Section */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2>Recent Photos</h2>
            <p className="text-sm text-muted-foreground">
              {recentPhotos.length} photos from your device
            </p>
          </div>
          {selectedPhotos.size > 0 && (
            <Badge variant="secondary">
              {selectedPhotos.size} selected
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {recentPhotos.map((photo) => (
            <Card
              key={photo.id}
              className={`overflow-hidden cursor-pointer transition-all ${
                selectedPhotos.has(photo.id)
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => togglePhotoSelection(photo.id)}
            >
              <CardContent className="p-0 relative">
                <div className="aspect-square">
                  <img
                    src={photo.src}
                    alt={`Recent photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Selection indicator */}
                  {selectedPhotos.has(photo.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  {/* Type indicator */}
                  {photo.type === 'video' && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-black/70 text-white border-0">
                    {formatTimestamp(photo.timestamp)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upload Form Modal */}
      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Add Details</DialogTitle>
            <DialogDescription>
              Add a title, tags, and tag people to help organize and share your uploaded content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected photos preview */}
            <div className="flex space-x-2 overflow-x-auto">
              {Array.from(selectedPhotos).map(photoId => {
                const photo = recentPhotos.find(p => p.id === photoId);
                return photo ? (
                  <div key={photoId} className="flex-shrink-0">
                    <img
                      src={photo.src}
                      alt="Selected"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                ) : null;
              })}
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your photo a title..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="art, nature, portrait (comma separated)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="taggedPeople">Tag People</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="taggedPeople"
                    value={taggedPeople}
                    onChange={(e) => setTaggedPeople(e.target.value)}
                    placeholder="alice, bob, charlie (comma separated)"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowUploadForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!title.trim()}
                className="flex-1"
              >
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Scanner Modal */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan an event QR code to automatically add event details and location information to your photos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Scanner animation */}
              <div className="absolute inset-4 border-2 border-primary rounded-lg">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse"></div>
              </div>
              
              <div className="text-center">
                <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Position QR code within the frame
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Scanning for event information...
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowQRScanner(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}