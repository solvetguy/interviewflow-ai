import { useState, useEffect } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoContainerProps {
  name: string;
  role?: string;
  isSpeaking: boolean;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  avatarUrl?: string;
}

const VideoContainer = ({
  name,
  role,
  isSpeaking,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  avatarUrl,
}: VideoContainerProps) => {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      setShowPulse(true);
    } else {
      const timer = setTimeout(() => setShowPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  return (
    <div className="relative w-full h-full">
      {/* Video Container */}
      <div
        className={cn(
          "relative w-full h-full rounded-2xl overflow-hidden transition-all duration-300",
          "bg-card backdrop-blur-glass border border-border shadow-glass",
          showPulse && "ring-4 ring-primary shadow-glow animate-pulse-glow"
        )}
      >
        {/* Video/Avatar Display */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-card">
          {isVideoOff ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
                <span className="text-4xl font-bold text-primary">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
              <VideoOff className="w-6 h-6 text-muted-foreground" />
            </div>
          ) : avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
              <span className="text-6xl font-bold text-foreground/80">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/90 px-3 py-1.5 rounded-full backdrop-blur-sm animate-fade-in">
            <Mic className="w-4 h-4 text-primary-foreground animate-pulse" />
            <span className="text-xs font-medium text-primary-foreground">Speaking</span>
          </div>
        )}

        {/* Muted Indicator */}
        {isMuted && !isSpeaking && (
          <div className="absolute top-4 right-4 bg-destructive/90 p-2 rounded-full backdrop-blur-sm">
            <MicOff className="w-4 h-4 text-destructive-foreground" />
          </div>
        )}

        {/* Name Label */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              {role && <p className="text-sm text-muted-foreground">{role}</p>}
            </div>
            {isLocal && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                You
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
