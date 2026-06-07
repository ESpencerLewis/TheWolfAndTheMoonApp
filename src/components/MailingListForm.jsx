import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MailingListForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    try {
      // Store subscriber locally until mailing list backend is connected
      const existing = JSON.parse(localStorage.getItem('wolf_subscribers') || '[]');
      existing.push({
        ...formData,
        notify_tours: true,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('wolf_subscribers', JSON.stringify(existing));
      setIsSubmitted(true);
      toast.success('Welcome to the pack');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-700/30 flex items-center justify-center">
          <Check className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="font-serif text-2xl text-amber-100 mb-2">You're In</h3>
        <p className="text-amber-200/60">We'll howl when we're heading your way</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto"
    >
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
        <Input
          type="email"
          placeholder="Your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="pl-12 bg-slate-900/50 border-amber-800/40 text-amber-100 placeholder:text-amber-200/30 focus:border-amber-600/60 rounded-none h-12"
        />
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Your name (optional)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-slate-900/50 border-amber-800/40 text-amber-100 placeholder:text-amber-200/30 focus:border-amber-600/60 rounded-none h-12"
        />
      </div>

      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
        <Input
          type="text"
          placeholder="Your city (for tour updates)"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="pl-12 bg-slate-900/50 border-amber-800/40 text-amber-100 placeholder:text-amber-200/30 focus:border-amber-600/60 rounded-none h-12"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-800/50 hover:bg-amber-700/60 text-amber-100 border border-amber-600/50 rounded-none h-12 tracking-wider"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
            Joining...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            JOIN THE PACK
          </span>
        )}
      </Button>
    </motion.form>
  );
}
