import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Check, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  isNativePlatform,
  purchaseDonation,
  DONATION_PRODUCTS,
} from '@/lib/iapService';

const PRESET_AMOUNTS = [5, 10, 25, 50];

export default function DonateModal({ isOpen, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const native = isNativePlatform();

  const handleDonate = async () => {
    if (!selectedAmount) {
      toast.error('Please select an amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await purchaseDonation(DONATION_PRODUCTS[selectedAmount]);
      if (result.cancelled) return;
      setIsSubmitted(true);
      toast.success('Thank you for your support');
    } catch {
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setSelectedAmount(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 p-3 text-amber-200/70 hover:text-amber-100 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="min-h-screen flex items-center justify-center p-6"
        >
          <div className="w-full max-w-md">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-700/30 flex items-center justify-center">
                  <Check className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="font-serif text-3xl text-amber-100 mb-3">Thank You</h3>
                <p className="text-amber-200/60 text-lg mb-8">
                  Your support keeps the desert tale alive
                </p>
                <Button
                  onClick={handleClose}
                  className="bg-amber-800/50 hover:bg-amber-700/60 text-amber-100 border border-amber-600/50 rounded-none px-8"
                >
                  Return
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-800/30 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-amber-400" />
                  </div>
                  <h2 className="font-serif text-3xl text-amber-100 mb-4">Support the Tale</h2>
                  <p className="text-amber-200/60 text-sm leading-relaxed">
                    I made this app myself. I wanted to be on this journey with you, without corporations that don't support the creative process in our way. This way, we can be outlaws together.
                  </p>
                </div>

                {native ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-3">
                      {PRESET_AMOUNTS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setSelectedAmount(amount)}
                          className={`py-3 border rounded-none transition-all text-sm ${
                            selectedAmount === amount
                              ? 'bg-amber-700/50 border-amber-500 text-amber-100'
                              : 'border-amber-800/40 text-amber-200/60 hover:border-amber-600/60'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={handleDonate}
                      disabled={isSubmitting || !selectedAmount}
                      className="w-full bg-amber-700/60 hover:bg-amber-600/70 text-amber-100 border border-amber-500/50 rounded-none h-12 tracking-wider disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-amber-200/30 border-t-amber-200 rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          {selectedAmount ? `SUPPORT THE ARTIST DIRECTLY — $${selectedAmount}` : 'SELECT AN AMOUNT'}
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-amber-200/30 text-xs">
                      Processed securely via Apple in-app purchase
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4 p-6 border border-amber-800/30 rounded-lg bg-slate-900/50">
                    <Smartphone className="w-8 h-8 text-amber-500/60 mx-auto" />
                    <p className="text-amber-200/70">
                      In-app donations are available in the iOS app.
                    </p>
                    <p className="text-amber-200/40 text-sm">
                      Download the app to support the tale directly.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
