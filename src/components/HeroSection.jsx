import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, BookOpen, Heart, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';

export default function HeroSection({ onListen, onRead, onWatch, onDonate, heroVideoUrl }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="text-center mb-8 max-w-4xl">

        <h1 className="text-red-900 mb-4 text-4xl tracking-wide leading-tight opacity-100 md:text-6xl lg:text-7xl" style={{ fontFamily: "'Bleeding Cowboys', serif" }}>The Wolf & the Moon

        </h1>
        <p className="text-amber-200/70 text-sm md:text-lg tracking-[0.3em] uppercase font-light">
          A Desert Gothic Tale of Murder, Desire & Wild Abandon
        </p>
      </motion.div>

      {/* Panoramic Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-full max-w-5xl aspect-[21/9] bg-gradient-to-br from-slate-900/80 to-amber-950/40 rounded-lg overflow-hidden border border-amber-800/30 shadow-2xl shadow-amber-950/50 mb-12">

        {heroVideoUrl ? (
          <VideoPlayer videoUrl={heroVideoUrl} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-800/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-700/30 animate-pulse" />
              </div>
              <p className="text-amber-200/50 text-sm tracking-wider">EPISODE ONE COMING SOON</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4 md:gap-6">

        <Button
          onClick={onListen}
          className="group relative px-8 py-6 bg-transparent border-2 border-amber-600/60 hover:border-amber-500 text-amber-100 rounded-none transition-all duration-500 hover:bg-amber-900/30">

          <span className="flex items-center gap-3 text-lg tracking-wider">
            <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" />
            LISTEN
          </span>
        </Button>

        <Button
          onClick={onRead}
          className="group relative px-8 py-6 bg-transparent border-2 border-amber-600/60 hover:border-amber-500 text-amber-100 rounded-none transition-all duration-500 hover:bg-amber-900/30">

          <span className="flex items-center gap-3 text-lg tracking-wider">
            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
            READ
          </span>
        </Button>

        <Button
          onClick={onWatch}
          className="group relative px-8 py-6 bg-transparent border-2 border-amber-600/60 hover:border-amber-500 text-amber-100 rounded-none transition-all duration-500 hover:bg-amber-900/30">

          <span className="flex items-center gap-3 text-lg tracking-wider">
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            WATCH
          </span>
        </Button>

        <Button
          onClick={onDonate}
          className="group relative px-8 py-6 bg-amber-800/40 border-2 border-amber-500/60 hover:border-amber-400 text-amber-100 rounded-none transition-all duration-500 hover:bg-amber-700/50">

          <span className="flex items-center gap-3 text-lg tracking-wider">
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            DONATE
          </span>
        </Button>
      </motion.div>
    </section>);

}