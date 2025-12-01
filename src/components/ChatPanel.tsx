import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatPanel = ({ messages, onSendMessage }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-glass rounded-2xl border border-border shadow-glass overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50">
        <h3 className="font-semibold text-lg text-foreground">Chat</h3>
        <p className="text-sm text-muted-foreground">Real-time messaging</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-1 animate-fade-in",
                message.sender === 'candidate' ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-2xl",
                  message.sender === 'candidate'
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/80 text-foreground rounded-bl-md"
                )}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <span className="text-xs text-muted-foreground px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-input/50 border-border/50 focus:border-primary rounded-xl"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-10 w-10 rounded-xl bg-primary hover:bg-primary-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
