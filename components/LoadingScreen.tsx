import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'opening' | 'done'>('loading');

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Start curtain opening after short pause
          setTimeout(() => setPhase('opening'), 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Call onComplete after curtains finish opening
  const handleCurtainComplete = () => {
    setPhase('done');
    onComplete();
  };

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Loading content - visible during loading phase */}
      {phase === 'loading' && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Logo/Brand */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black text-brand-dark tracking-tight">HUGs</h1>
            <p className="text-xs text-gray-400 uppercase tracking-[0.3em]">Agency</p>
          </motion.div>

          {/* Percentage - BIG and above progress bar */}
          <motion.p
            className="mb-6 text-7xl font-black text-brand-pink"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.floor(progress)}%
          </motion.p>

          {/* Progress Bar Container */}
          <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-pink rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}

      {/* Curtains - appear during opening phase */}
      {phase === 'opening' && (
        <>
          {/* Left Curtain - with shadow for visibility */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-white shadow-[10px_0_30px_rgba(0,0,0,0.15)]"
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
          {/* Right Curtain - with shadow for visibility */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.15)]"
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            onAnimationComplete={handleCurtainComplete}
          />
        </>
      )}
    </div>
  );
};
