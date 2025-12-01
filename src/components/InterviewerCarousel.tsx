import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Interviewer {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface InterviewerCarouselProps {
  interviewers: Interviewer[];
  activeId: string;
  onSelect: (id: string) => void;
}

const InterviewerCarousel = ({ interviewers, activeId, onSelect }: InterviewerCarouselProps) => {
  const activeIndex = interviewers.findIndex(i => i.id === activeId);

  const handlePrev = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : interviewers.length - 1;
    onSelect(interviewers[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = activeIndex < interviewers.length - 1 ? activeIndex + 1 : 0;
    onSelect(interviewers[newIndex].id);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-glass rounded-2xl border border-border shadow-glass">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        className="h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {interviewers.map((interviewer) => (
          <button
            key={interviewer.id}
            onClick={() => onSelect(interviewer.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 min-w-fit",
              "border backdrop-blur-sm",
              activeId === interviewer.id
                ? "bg-primary/20 border-primary shadow-glow scale-105"
                : "bg-muted/30 border-border/50 hover:bg-muted/50 hover:scale-102"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-primary/30 to-secondary/30 border-2",
              activeId === interviewer.id ? "border-primary" : "border-border"
            )}>
              {interviewer.avatarUrl ? (
                <img src={interviewer.avatarUrl} alt={interviewer.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-foreground" />
              )}
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">{interviewer.name}</p>
              <p className="text-xs text-muted-foreground">{interviewer.role}</p>
            </div>
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="h-10 w-10 rounded-xl hover:bg-primary/20 hover:text-primary"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default InterviewerCarousel;
