import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingIndicatorProps {
  isRecording: boolean;
  label: string;
  className?: string;
}

const RecordingIndicator = ({ isRecording, label, className }: RecordingIndicatorProps) => {
  if (!isRecording) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-full",
      "bg-destructive/90 backdrop-blur-sm shadow-elevation animate-fade-in",
      className
    )}>
      <Circle className="w-3 h-3 fill-current text-destructive-foreground animate-pulse" />
      <span className="text-xs font-medium text-destructive-foreground">
        {label}
      </span>
    </div>
  );
};

export default RecordingIndicator;
