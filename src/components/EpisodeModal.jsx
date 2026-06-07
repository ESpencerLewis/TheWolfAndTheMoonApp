import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import AudioVisualizer from './AudioVisualizer';
import VideoPlayer from './VideoPlayer';
import MinimalVideoPlayer from './MinimalVideoPlayer';

export default function EpisodeModal({ isOpen, onClose, episode, mode }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showLyricVideo, setShowLyricVideo] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const audioRef = React.useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [episode?.podcast_file_url]);

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  // Reset lyric video toggle when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setShowLyricVideo(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine which video to show based on mode
  const getVideoUrl = () => {
    if (mode === 'watch') {
      return showLyricVideo ? episode?.lyric_video_url : episode?.music_video_url;
    }
    return episode?.video_url;
  };

  const currentVideoUrl = getVideoUrl();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Background Video */}
        {currentVideoUrl ? (
          <div className="fixed inset-0 z-0">
            {mode === 'watch' ? (
              <VideoPlayer videoUrl={currentVideoUrl} />
            ) : (
              <MinimalVideoPlayer videoUrl={currentVideoUrl} />
            )}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-none" />
          </div>
        ) : (
          <div className="fixed inset-0 z-0 bg-slate-950/95 backdrop-blur-md" />
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 p-3 text-amber-200/70 hover:text-amber-100 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 min-h-screen flex items-center justify-center p-6"
        >
          <div className="w-full max-w-3xl">
            {/* Episode Header */}
            <div className="text-center mb-10">
              <p className="text-amber-500/70 text-sm tracking-[0.3em] uppercase mb-2">
                Episode {episode?.episode_number || '—'}
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-amber-100 mb-4">
                {episode?.title || 'Latest Episode'}
              </h2>
              <p className="text-amber-200/60 text-lg">
                {episode?.description || 'A new chapter in the desert gothic tale...'}
              </p>
            </div>

            {/* Music Download - Top of all modes */}
            {episode?.music_file_url && (
              <div className="bg-gradient-to-br from-slate-900/80 to-amber-950/30 border border-amber-800/30 rounded-lg p-6 mb-8">
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-amber-200 text-sm tracking-widest uppercase">Download Music Track</h3>
                  <Button
                    onClick={() => handleDownload(episode.music_file_url, `${episode.title}-track.mp3`)}
                    className="bg-amber-700/50 hover:bg-amber-600/60 text-amber-100 border border-amber-600/50 rounded-none px-6 py-3"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Track
                  </Button>
                </div>
              </div>
            )}

            {mode === 'listen' && (
              <div className="space-y-8">
                {/* Podcast Player */}
                <div className="bg-gradient-to-br from-slate-900/80 to-amber-950/30 border border-amber-800/30 rounded-lg p-8">
                  <h3 className="text-amber-200 text-sm tracking-widest uppercase mb-6">Podcast Episode</h3>
                  
                  {episode?.podcast_file_url ? (
                    <div className="space-y-6">
                      <audio ref={audioRef} src={episode.podcast_file_url} />
                      
                      {/* Audio Visualizer */}
                      <AudioVisualizer audioRef={audioRef} isPlaying={isPlaying} />
                      
                      {/* Seek Bar and Time */}
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-amber-800/30 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 
                            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:hover:scale-125
                            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                            [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-0 
                            [&::-moz-range-thumb]:cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, rgb(245 158 11) 0%, rgb(245 158 11) ${(currentTime / duration) * 100}%, rgb(120 53 15 / 0.3) ${(currentTime / duration) * 100}%, rgb(120 53 15 / 0.3) 100%)`
                          }}
                        />
                        <div className="flex justify-between text-amber-200/70 text-sm font-mono">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Play/Pause Control */}
                      <div className="flex items-center justify-center">
                        <button
                          onClick={togglePlay}
                          className="w-16 h-16 rounded-full bg-amber-700/40 border border-amber-600/50 flex items-center justify-center hover:bg-amber-600/50 transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-amber-100" />
                          ) : (
                            <Play className="w-6 h-6 text-amber-100 ml-1" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-amber-200/50">Coming soon...</p>
                  )}
                </div>
              </div>
            )}

            {mode === 'read' && (
              <div className="bg-gradient-to-br from-slate-900/80 to-amber-950/30 border border-amber-800/30 rounded-lg p-8 md:p-12">
                <div className="prose prose-invert prose-amber max-w-none">
                  {episode?.story_content ? (
                    <ReactMarkdown className="text-amber-100/90 leading-relaxed text-lg">
                      {episode.story_content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-center text-amber-200/50 text-lg">
                      The written tale will be revealed soon...
                    </p>
                  )}
                </div>
              </div>
            )}

            {mode === 'watch' && (
              <div className="space-y-6">
                {/* Video Toggle Buttons */}
                {episode?.music_video_url && episode?.lyric_video_url && (
                  <div className="flex justify-center gap-4 mb-6">
                    <Button
                      onClick={() => setShowLyricVideo(false)}
                      className={`${
                        !showLyricVideo
                          ? 'bg-amber-700/60 border-amber-500'
                          : 'bg-transparent border-amber-700/40'
                      } border-2 text-amber-100 hover:bg-amber-700/50 rounded-none px-8 py-3 transition-all`}
                    >
                      Music Video
                    </Button>
                    <Button
                      onClick={() => setShowLyricVideo(true)}
                      className={`${
                        showLyricVideo
                          ? 'bg-amber-700/60 border-amber-500'
                          : 'bg-transparent border-amber-700/40'
                      } border-2 text-amber-100 hover:bg-amber-700/50 rounded-none px-8 py-3 transition-all`}
                    >
                      Lyric Video
                    </Button>
                  </div>
                )}

                <div className="bg-gradient-to-br from-slate-900/80 to-amber-950/30 border border-amber-800/30 rounded-lg p-8">
                  <p className="text-center text-amber-200/70 text-lg">
                    {showLyricVideo ? 'Enjoy the lyric video above' : 'Enjoy the music video above'}
                  </p>
                  {!episode?.music_video_url && !episode?.lyric_video_url && (
                    <p className="text-center text-amber-200/50 mt-4">Videos coming soon...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}