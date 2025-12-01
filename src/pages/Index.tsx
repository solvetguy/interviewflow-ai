import { useState, useEffect } from 'react';
import VideoContainer from '@/components/VideoContainer';
import SpeechWaveform from '@/components/SpeechWaveform';
import InterviewerCarousel from '@/components/InterviewerCarousel';
import ChatPanel from '@/components/ChatPanel';
import FileUpload from '@/components/FileUpload';
import ControlToolbar from '@/components/ControlToolbar';
import RecordingIndicator from '@/components/RecordingIndicator';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';

const Index = () => {
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(false);
  const [activeInterviewerId, setActiveInterviewerId] = useState('1');

  // Media devices
  const {
    videoStream,
    audioStream,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
    startVideo,
    startAudio
  } = useMediaDevices();

  // Voice detection for candidate
  const isCandidateSpeaking = useVoiceDetection(audioStream);

  // Combined stream for recording (video + audio)
  const [combinedStream, setCombinedStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (videoStream && audioStream) {
      const combined = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
      setCombinedStream(combined);
    } else {
      setCombinedStream(null);
    }
  }, [videoStream, audioStream]);

  // Recording
  const {
    isRecording,
    startRecording,
    stopRecording,
    downloadRecording
  } = useMediaRecorder(combinedStream);

  // Auto-start media on mount
  useEffect(() => {
    startVideo();
    startAudio();
  }, []);

  const interviewers = [
    { id: '1', name: 'Sarah Chen', role: 'AI Senior Engineer' },
    { id: '2', name: 'Marcus Rodriguez', role: 'AI HR Interviewer' },
    { id: '3', name: 'Emily Watson', role: 'AI Tech Lead' },
    { id: '4', name: 'David Kim', role: 'AI Product Manager' },
  ];

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'interviewer' as const,
      text: 'Hello! Welcome to your mock interview. I\'m excited to learn more about your experience.',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      sender: 'candidate' as const,
      text: 'Thank you! I\'m looking forward to this interview.',
      timestamp: new Date(Date.now() - 30000),
    },
  ]);

  const handleSendMessage = (text: string) => {
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: 'candidate',
        text,
        timestamp: new Date(),
      },
    ]);

    // Simulate interviewer response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'interviewer',
          text: 'That\'s a great point. Can you tell me more about that?',
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
  };

  // Simulate speaking states
  const simulateSpeaking = () => {
    setInterviewerSpeaking(true);
    setTimeout(() => setInterviewerSpeaking(false), 3000);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleDownloadRecording = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadRecording(`interview-recording-${timestamp}.webm`);
  };

  return (
    <div className="min-h-screen w-full p-6 space-y-6">
      {/* Recording Indicators */}
      <div className="flex justify-end gap-3">
        <RecordingIndicator isRecording={isRecording} label="Recording Interview" />
      </div>

      {/* Interviewer Carousel */}
      <InterviewerCarousel
        interviewers={interviewers}
        activeId={activeInterviewerId}
        onSelect={setActiveInterviewerId}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Containers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interviewer Video */}
            <div className="space-y-3">
              <div className="aspect-video">
                <VideoContainer
                  name={interviewers.find(i => i.id === activeInterviewerId)?.name || 'Interviewer'}
                  role={interviewers.find(i => i.id === activeInterviewerId)?.role}
                  isSpeaking={interviewerSpeaking}
                  isMuted={false}
                />
              </div>
              <div className="flex justify-center">
                <SpeechWaveform isActive={interviewerSpeaking} />
              </div>
              <button
                onClick={simulateSpeaking}
                className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Test Speaking Animation
              </button>
            </div>

            {/* Candidate Video */}
            <div className="space-y-3">
              <div className="aspect-video">
                <VideoContainer
                  name="Alex Johnson"
                  isSpeaking={isCandidateSpeaking}
                  isLocal
                  isMuted={!isAudioEnabled}
                  isVideoOff={!isVideoEnabled}
                  videoStream={videoStream}
                />
              </div>
              <div className="flex justify-center">
                <SpeechWaveform isActive={isCandidateSpeaking} />
              </div>
            </div>
          </div>

          {/* Control Toolbar */}
          <div className="flex justify-center">
            <ControlToolbar
              isMuted={!isAudioEnabled}
              isVideoOff={!isVideoEnabled}
              isRecording={isRecording}
              onToggleMic={toggleAudio}
              onToggleVideo={toggleVideo}
              onToggleRecording={handleToggleRecording}
              onDownloadRecording={handleDownloadRecording}
              onEndInterview={() => console.log('End interview')}
              onSwitchInterviewer={() => {
                const currentIndex = interviewers.findIndex(i => i.id === activeInterviewerId);
                const nextIndex = (currentIndex + 1) % interviewers.length;
                setActiveInterviewerId(interviewers[nextIndex].id);
              }}
              onReplayVoice={() => console.log('Replay voice')}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Chat Panel */}
          <div className="h-[400px]">
            <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
          </div>

          {/* File Upload */}
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  );
};

export default Index;
