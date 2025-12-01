import { useState, useEffect, useRef } from 'react';

export const useVoiceDetection = (audioStream: MediaStream | null) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioStream) {
      setIsSpeaking(false);
      return;
    }

    // Create audio context and analyser
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(audioStream);
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    microphone.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Voice detection threshold (adjust as needed)
    const VOICE_THRESHOLD = 30;

    const detectVoice = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      setIsSpeaking(average > VOICE_THRESHOLD);
      
      animationFrameRef.current = requestAnimationFrame(detectVoice);
    };

    detectVoice();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream]);

  return isSpeaking;
};
