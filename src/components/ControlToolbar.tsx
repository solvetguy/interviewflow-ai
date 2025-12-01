import { Mic, MicOff, Video, VideoOff, Phone, Users, Volume2, Circle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ControlToolbarProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isRecording: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onToggleRecording: () => void;
  onDownloadRecording: () => void;
  onEndInterview: () => void;
  onSwitchInterviewer: () => void;
  onReplayVoice: () => void;
}

const ControlToolbar = ({
  isMuted,
  isVideoOff,
  isRecording,
  onToggleMic,
  onToggleVideo,
  onToggleRecording,
  onDownloadRecording,
  onEndInterview,
  onSwitchInterviewer,
  onReplayVoice,
}: ControlToolbarProps) => {
  return (
    <div className="flex items-center justify-center gap-3 p-6 bg-card/50 backdrop-blur-glass rounded-2xl border border-border shadow-glass">
      {/* Mic Toggle */}
      <Button
        onClick={onToggleMic}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-xl transition-all duration-300",
          isMuted
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            : "bg-muted hover:bg-muted/80 text-foreground"
        )}
      >
        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>

      {/* Video Toggle */}
      <Button
        onClick={onToggleVideo}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-xl transition-all duration-300",
          isVideoOff
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            : "bg-muted hover:bg-muted/80 text-foreground"
        )}
      >
        {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
      </Button>

      {/* Replay Voice */}
      <Button
        onClick={onReplayVoice}
        size="icon"
        className="h-14 w-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground"
      >
        <Volume2 className="w-6 h-6" />
      </Button>

      {/* Recording Toggle */}
      <Button
        onClick={onToggleRecording}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-xl transition-all duration-300",
          isRecording
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse"
            : "bg-muted hover:bg-muted/80 text-foreground"
        )}
      >
        <Circle className={cn("w-6 h-6", isRecording && "fill-current")} />
      </Button>

      {/* Download Recording */}
      <Button
        onClick={onDownloadRecording}
        size="icon"
        className="h-14 w-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground"
      >
        <Download className="w-6 h-6" />
      </Button>

      {/* Switch Interviewer */}
      <Button
        onClick={onSwitchInterviewer}
        size="icon"
        className="h-14 w-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground"
      >
        <Users className="w-6 h-6" />
      </Button>

      {/* End Interview */}
      <Button
        onClick={onEndInterview}
        size="icon"
        className="h-14 w-14 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      >
        <Phone className="w-6 h-6 rotate-135" />
      </Button>
    </div>
  );
};

export default ControlToolbar;
