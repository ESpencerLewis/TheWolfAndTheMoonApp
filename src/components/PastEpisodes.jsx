import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Video } from 'lucide-react';

export default function PastEpisodes({ episodes }) {
  const [playingId, setPlayingId] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const audioRefs = React.useRef({});
  const videoRefs = React.useRef({});

  const togglePlay = (episode) => {
    // Stop any playing video
    Object.values(videoRefs.current).forEach(video => video?.pause());
    setPlayingVideoId(null);

    const currentAudio = audioRefs.current[episode.id];
    
    // Pause all other audio
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== episode.id && audio) {
        audio.pause();
      }
    });

    if (currentAudio) {
      if (playingId === episode.id) {
        currentAudio.pause();
        setPlayingId(null);
      } else {
        currentAudio.play();
        setPlayingId(episode.id);
      }
    }
  };

  const toggleVideo = (episode) => {
    // Stop any playing audio
    Object.values(audioRefs.current).forEach(audio => audio?.pause());
    setPlayingId(null);

    const currentVideo = videoRefs.current[episode.id];
    
    // Pause all other videos
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (id !== episode.id && video) {
        video.pause();
      }
    });

    if (currentVideo) {
      if (playingVideoId === episode.id) {
        currentVideo.pause();
        setPlayingVideoId(null);
      } else {
        currentVideo.play();
        setPlayingVideoId(episode.id);
      }
    }
  };

  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-serif text-3xl md:text-4xl text-amber-100 mb-4"
        >
          Past Episodes
        </motion.h2>
        <p className="text-center text-amber-200/50 mb-12 tracking-wider">
          Journey through the desert gothic tale
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-slate-900/80 to-amber-950/30 border border-amber-800/30 rounded-lg overflow-hidden hover:border-amber-700/50 transition-all duration-500"
            >
              {/* Thumbnail / Video */}
              <div className="aspect-video relative overflow-hidden">
                {playingVideoId === episode.id && episode.video_url ? (
                  <video
                    ref={(el) => (videoRefs.current[episode.id] = el)}
                    src={episode.video_url}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    onEnded={() => setPlayingVideoId(null)}
                  />
                ) : episode.thumbnail_url ? (
                  <img
                    src={episode.thumbnail_url}
                    alt={episode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-950/50 to-slate-900 flex items-center justify-center">
                    <span className="text-6xl font-serif text-amber-800/50">{episode.episode_number}</span>
                  </div>
                )}
                
                {/* Play Overlay */}
                {playingVideoId !== episode.id && (episode.music_file_url || episode.video_url) && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {episode.music_file_url && (
                      <button
                        onClick={() => togglePlay(episode)}
                        className="w-12 h-12 rounded-full bg-amber-700/80 flex items-center justify-center hover:bg-amber-600 transition-colors"
                      >
                        {playingId === episode.id ? (
                          <Pause className="w-5 h-5 text-amber-100" />
                        ) : (
                          <Play className="w-5 h-5 text-amber-100 ml-0.5" />
                        )}
                      </button>
                    )}
                    {episode.video_url && (
                      <button
                        onClick={() => toggleVideo(episode)}
                        className="w-12 h-12 rounded-full bg-amber-700/80 flex items-center justify-center hover:bg-amber-600 transition-colors"
                      >
                        <Video className="w-5 h-5 text-amber-100" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-amber-500/70 text-xs tracking-widest uppercase mb-1">
                  Episode {episode.episode_number}
                </p>
                <h3 className="font-serif text-xl text-amber-100 mb-2">{episode.title}</h3>
                <p className="text-amber-200/50 text-sm line-clamp-2">{episode.description}</p>
              </div>

              {/* Hidden Audio */}
              {episode.music_file_url && (
                <audio
                  ref={(el) => (audioRefs.current[episode.id] = el)}
                  src={episode.music_file_url}
                  onEnded={() => setPlayingId(null)}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}