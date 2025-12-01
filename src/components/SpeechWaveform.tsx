import { cn } from '@/lib/utils';

interface SpeechWaveformProps {
  isActive: boolean;
  barCount?: number;
}

const SpeechWaveform = ({ isActive, barCount = 5 }: SpeechWaveformProps) => {
  return (
    <div className="flex items-center gap-1 h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-primary rounded-full transition-all duration-150",
            isActive ? "animate-wave" : "h-2"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isActive ? undefined : '8px',
          }}
        />
      ))}
    </div>
  );
};

export default SpeechWaveform;
