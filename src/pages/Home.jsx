import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEpisodes } from '@/api/contentClient';
import { motion } from 'framer-motion';

import HeroSection from '@/components/HeroSection';
import EpisodeModal from '@/components/EpisodeModal';
import PastEpisodes from '@/components/PastEpisodes';
import SocialLinks from '@/components/SocialLinks';
import MailingListForm from '@/components/MailingListForm';
import DonateModal from '@/components/DonateModal';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('listen');
  const [donateOpen, setDonateOpen] = useState(false);

  const { data: episodes = [] } = useQuery({
    queryKey: ['episodes'],
    queryFn: () => getEpisodes(),
  });

  const latestEpisode = episodes.find(ep => ep.is_latest) || episodes[0];

  const handleListen = () => {
    setModalMode('listen');
    setModalOpen(true);
  };

  const handleRead = () => {
    setModalMode('read');
    setModalOpen(true);
  };

  const handleWatch = () => {
    setModalMode('watch');
    setModalOpen(true);
  };

  const handleDonate = () => {
    setDonateOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Desert Night Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, #d4a574 100%, transparent),
                              radial-gradient(1px 1px at 40px 70px, #c9d1d9 100%, transparent),
                              radial-gradient(1px 1px at 50px 160px, #d4a574 100%, transparent),
                              radial-gradient(1px 1px at 90px 40px, #c9d1d9 100%, transparent),
                              radial-gradient(1px 1px at 130px 80px, #d4a574 100%, transparent),
                              radial-gradient(1px 1px at 160px 120px, #c9d1d9 100%, transparent),
                              radial-gradient(2px 2px at 200px 50px, #d4a574 100%, transparent),
                              radial-gradient(1px 1px at 220px 140px, #c9d1d9 100%, transparent),
                              radial-gradient(1px 1px at 280px 90px, #d4a574 100%, transparent)`,
            backgroundSize: '300px 200px',
          }}
        />
        {/* Desert horizon gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-950/20 via-transparent to-transparent" />
        {/* Moon glow */}
        <div className="absolute top-20 right-1/4 w-32 h-32 rounded-full bg-amber-100/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection
          onListen={handleListen}
          onRead={handleRead}
          onWatch={handleWatch}
          onDonate={handleDonate}
          heroVideoUrl={latestEpisode?.video_url}
        />

        <PastEpisodes episodes={episodes} />

        {/* Footer Section */}
        <section className="py-20 px-4 border-t border-amber-800/20">
          <div className="max-w-4xl mx-auto">
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-center font-serif text-2xl text-amber-100 mb-8">Follow the Trail</h3>
              <SocialLinks />
            </motion.div>

            {/* Mailing List */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h3 className="text-center font-serif text-2xl text-amber-100 mb-3">Join the Pack</h3>
              <p className="text-center text-amber-200/50 mb-8 max-w-md mx-auto">
                Get notified about new episodes and when we're playing near you
              </p>
              <MailingListForm />
            </motion.div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <button
                onClick={handleDonate}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-700/50 text-amber-200 hover:text-amber-100 hover:border-amber-600/60 transition-all tracking-wider text-sm"
              >
                Support the Desert Gothic Tale
              </button>
            </motion.div>

            {/* Copyright */}
            <div className="mt-20 text-center">
              <p className="text-amber-200/30 text-sm tracking-wider">
                © {new Date().getFullYear()} The Wolf And The Moon
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <EpisodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        episode={latestEpisode}
        mode={modalMode}
      />

      <DonateModal
        isOpen={donateOpen}
        onClose={() => setDonateOpen(false)}
      />
    </div>
  );
}
