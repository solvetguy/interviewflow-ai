import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseMediaRecorderReturn {
  isRecording: boolean;
  recordedChunks: Blob[];
  startRecording: () => void;
  stopRecording: () => void;
  downloadRecording: (filename: string) => void;
  clearRecording: () => void;
}

export const useMediaRecorder = (
  stream: MediaStream | null
): UseMediaRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    if (!stream) {
      toast({
        title: "Cannot Record",
        description: "No media stream available",
        variant: "destructive"
      });
      return;
    }

    try {
      const options = { mimeType: 'video/webm;codecs=vp9' };
      
      // Fallback to supported mime type if vp9 not available
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/mp4';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks([...chunksRef.current]);
        setIsRecording(false);
        toast({
          title: "Recording Stopped",
          description: "Your recording is ready to download",
        });
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Your interview is being recorded",
      });
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        title: "Recording Error",
        description: "Could not start recording",
        variant: "destructive"
      });
    }
  }, [stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const downloadRecording = useCallback((filename: string) => {
    if (recordedChunks.length === 0) {
      toast({
        title: "No Recording",
        description: "There is no recording to download",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast({
      title: "Download Started",
      description: `Downloading ${filename}`,
    });
  }, [recordedChunks]);

  const clearRecording = useCallback(() => {
    chunksRef.current = [];
    setRecordedChunks([]);
  }, []);

  return {
    isRecording,
    recordedChunks,
    startRecording,
    stopRecording,
    downloadRecording,
    clearRecording
  };
};
