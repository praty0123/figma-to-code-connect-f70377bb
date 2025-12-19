import { useState } from 'react';
import { Camera, Clock, MessageSquare, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { projectId } from '../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';
import { publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface PhotoUpdate {
  id: string;
  imageUrl: string;
  message: string;
  timestamp: string;
  uploadedBy: string;
  residentName?: string;
}

interface PhotoUpdatesProps {
  photos: PhotoUpdate[];
  canUpload?: boolean;
  onUpload?: (photo: PhotoUpdate) => void;
}

export function PhotoUpdates({ photos, canUpload = false, onUpload }: PhotoUpdatesProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoUpdate | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <div className="space-y-4">
      {canUpload && (
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => setShowUploadDialog(true)}
        >
          <Camera className="size-4 mr-2" />
          Upload Photo Update
        </Button>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => setSelectedPhoto(photo)}
          />
        ))}
      </div>

      {photos.length === 0 && (
        <Card className="p-8 text-center">
          <Camera className="size-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600">No photo updates yet</p>
        </Card>
      )}

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Update</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt="Resident photo update"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Clock className="size-4" />
                  <span className="text-sm">{selectedPhoto.timestamp}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MessageSquare className="size-4 text-neutral-600 mt-1 flex-shrink-0" />
                  <p className="text-neutral-900">{selectedPhoto.message}</p>
                </div>
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500">
                    Uploaded by {selectedPhoto.uploadedBy}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      {canUpload && (
        <UploadPhotoDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onUpload={onUpload}
        />
      )}
    </div>
  );
}

function PhotoCard({ photo, onClick }: { photo: PhotoUpdate; onClick: () => void }) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
        <img
          src={photo.imageUrl}
          alt="Resident photo update"
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-3">
        <p className="text-sm text-neutral-900 line-clamp-2 mb-2">{photo.message}</p>
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>{new Date(photo.timestamp).toLocaleDateString()}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {new Date(photo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

function UploadPhotoDialog({ 
  open, 
  onOpenChange, 
  onUpload 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onUpload?: (photo: PhotoUpdate) => void;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !message.trim()) {
      alert('Please select an image and add a message');
      return;
    }

    setUploading(true);

    try {
      // Get auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        alert('Please log in again');
        setUploading(false);
        return;
      }

      // Upload photo to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f835a0b6/photos/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            imageData: selectedImage,
            message: message.trim(),
            residentId: 'default-resident', // Could be dynamic based on context
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUpload?.(data.photo);
      setUploading(false);
      setSelectedImage(null);
      setMessage('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Photo upload error:', error);
      alert(error.message || 'Failed to upload photo');
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Photo Update</DialogTitle>
          <DialogDescription>Upload a new photo update for the resident.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Photo</label>
            {selectedImage ? (
              <div className="relative">
                <div className="aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                <Camera className="size-12 text-neutral-400 mb-2" />
                <span className="text-sm text-neutral-600">Click to select photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="E.g., 'Enjoying morning yoga session in the garden'"
            />
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploading || !selectedImage || !message.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="size-4 mr-2" />
                Upload Photo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}