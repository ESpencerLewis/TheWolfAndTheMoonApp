import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function MinimalVideoPlayer({ videoUrl, className = '', autoPlay = true, loop = true }) {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [isMuted, setIsMuted] = React.useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline
      />
      
      {/* Simple Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-amber-700/40 hover:bg-amber-600/60 transition-all text-amber-100 backdrop-blur-sm"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-amber-700/40 hover:bg-amber-600/60 transition-all text-amber-100 backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}