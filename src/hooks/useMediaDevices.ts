import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseMediaDevicesReturn {
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  startVideo: () => Promise<void>;
  stopVideo: () => void;
  startAudio: () => Promise<void>;
  stopAudio: () => void;
  toggleVideo: () => Promise<void>;
  toggleAudio: () => Promise<void>;
  error: Error | null;
}

export const useMediaDevices = (): UseMediaDevicesReturn => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      videoStreamRef.current = stream;
      setVideoStream(stream);
      setIsVideoEnabled(true);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
      console.error('Error accessing camera:', error);
    }
  };

  const stopVideo = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
      setVideoStream(null);
      setIsVideoEnabled(false);
    }
  };

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      audioStreamRef.current = stream;
      setAudioStream(stream);
      setIsAudioEnabled(true);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudio = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
      setAudioStream(null);
      setIsAudioEnabled(false);
    }
  };

  const toggleVideo = async () => {
    if (isVideoEnabled) {
      stopVideo();
    } else {
      await startVideo();
    }
  };

  const toggleAudio = async () => {
    if (isAudioEnabled) {
      stopAudio();
    } else {
      await startAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopVideo();
      stopAudio();
    };
  }, []);

  return {
    videoStream,
    audioStream,
    isVideoEnabled,
    isAudioEnabled,
    startVideo,
    stopVideo,
    startAudio,
    stopAudio,
    toggleVideo,
    toggleAudio,
    error
  };
};
