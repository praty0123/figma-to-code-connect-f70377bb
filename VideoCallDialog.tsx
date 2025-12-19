import { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface VideoCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
}

export function VideoCallDialog({ open, onOpenChange, recipientName }: VideoCallDialogProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (open) {
      setIsConnecting(true);
      // Simulate connection
      const connectTimer = setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);

      return () => clearTimeout(connectTimer);
    } else {
      setIsConnected(false);
      setCallDuration(0);
    }
  }, [open]);

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setIsConnecting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Video Call with {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="relative h-full flex flex-col">
          {/* Video Area */}
          <div className="flex-1 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg relative overflow-hidden">
            {isConnecting ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xl">Connecting to {recipientName}...</p>
              </div>
            ) : isConnected ? (
              <>
                {/* Main video feed */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Video className="size-16 text-white" />
                  </div>
                  <p className="absolute bottom-8 left-8 text-white text-xl">{recipientName}</p>
                </div>

                {/* Self preview (small) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-neutral-700 rounded-lg border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Video className="size-8 text-white" />
                  </div>
                </div>

                {/* Call duration */}
                <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-full">
                  <p className="text-white">{formatDuration(callDuration)}</p>
                </div>
              </>
            ) : null}
          </div>

          {/* Controls */}
          {isConnected && (
            <div className="flex items-center justify-center gap-4 py-6">
              <Button
                variant={isMuted ? 'destructive' : 'secondary'}
                size="lg"
                className="rounded-full w-14 h-14"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
              </Button>

              <Button
                variant={isVideoOff ? 'destructive' : 'secondary'}
                size="lg"
                className="rounded-full w-14 h-14"
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff className="size-6" /> : <Video className="size-6" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                className="rounded-full w-16 h-16"
                onClick={handleEndCall}
              >
                <PhoneOff className="size-8" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="rounded-full w-14 h-14"
              >
                <Settings className="size-6" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}