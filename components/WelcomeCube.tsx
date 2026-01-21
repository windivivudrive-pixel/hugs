import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Image face component for cube
const ImageFace: React.FC<{
  transform: string;
  cubeSize: number;
  imageSrc: string;
  alt: string;
}> = ({ transform, cubeSize, imageSrc, alt }) => (
  <div
    className="absolute backface-hidden overflow-hidden shadow-lg"
    style={{ transform, width: cubeSize, height: cubeSize }}
  >
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-full object-cover"
    />
  </div>
);

export const WelcomeCube: React.FC = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const [decorProgress, setDecorProgress] = useState(0); // 0-1 for decorative content animation
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const cubeSize = 300;
  const translateZ = cubeSize / 2;
  const perspective = 1200;

  // Lerp function for smooth interpolation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Animation loop with Lerp smoothing
  useEffect(() => {
    const animate = () => {
      const lerpFactor = 0.08;

      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, lerpFactor);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, lerpFactor);

      setRotation({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll handler - updates target rotation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const scrollRange = windowHeight * 2; // Reduced to match 200vh spacer
      const progress = Math.min(scrollY / scrollRange, 1);

      // First 1.5x height: only rotate Y axis
      // After 1.5x: start rotating X axis too
      const yProgress = progress;
      const xThreshold = 0.5; // 1.5x height = 50% of 3x range
      const xProgress = progress > xThreshold
        ? (progress - xThreshold) / (1 - xThreshold)
        : 0;

      targetRef.current = {
        y: yProgress * 720,
        x: xProgress * 45,
      };

      // Decorative content: appears 33%-60%, then fades out 60%-80%
      const decorStart = 0.33;
      const decorPeak = 0.6;
      const decorFadeEnd = 0.8;

      if (progress < decorStart) {
        setDecorProgress(0);
      } else if (progress < decorPeak) {
        // Fade in
        setDecorProgress((progress - decorStart) / (decorPeak - decorStart));
      } else if (progress < decorFadeEnd) {
        // Fade out
        setDecorProgress(1 - (progress - decorPeak) / (decorFadeEnd - decorPeak));
      } else {
        setDecorProgress(0);
      }

      // Fade cube from 30% to 45% - disappear much earlier
      if (progress > 0.3) {
        const fadeProgress = Math.min((progress - 0.3) / 0.15, 1);
        setOpacity(1 - fadeProgress);
      } else {
        setOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky container - hidden when opacity is very low */}
      <div
        className="sticky top-0 h-screen flex items-center justify-center z-50 pointer-events-none"
        style={{ visibility: opacity < 0.05 ? 'hidden' : 'visible' }}
      >
        <motion.div
          animate={{ opacity }}
          transition={{ duration: 0.1 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Background gradient - semi-transparent to show content below */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-white/70" />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,2,144,0.15) 0%, rgba(147,51,234,0.15) 25%, rgba(59,130,246,0.15) 50%, rgba(255,2,144,0.15) 75%, rgba(147,51,234,0.15) 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 8s ease-in-out infinite',
              }}
            />
          </div>

          {/* Floating Text - WE ARE HUGS */}
          <div className="fixed inset-0 flex items-center justify-center z-[2] pointer-events-none">
            <motion.h2
              className="text-[10vw] font-black text-brand-dark/5 absolute top-[20%]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: opacity * 0.5, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              WE ARE
            </motion.h2>
            <motion.h2
              className="text-[10vw] font-black text-[#FF0290]/5 absolute bottom-[20%]"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: opacity * 0.5, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              HUGS
            </motion.h2>
          </div>

          {/* 3D Cube */}
          <div
            className="relative z-10"
            style={{ perspective: `${perspective}px` }}
          >
            <div
              className="relative transform-style-3d will-change-transform"
              style={{
                width: cubeSize,
                height: cubeSize,
                transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {/* Front face - cube3 (start) */}
              <ImageFace transform={`translateZ(${translateZ}px)`} cubeSize={cubeSize} imageSrc="/cube3.png" alt="Cube Front" />
              {/* Back face - cube4 */}
              <ImageFace transform={`rotateY(180deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} imageSrc="/cube4.png" alt="Cube Back" />
              {/* Right face - cube2 */}
              <ImageFace transform={`rotateY(90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} imageSrc="/cube1.png" alt="Cube Right" />
              {/* Left face - cube1 */}
              <ImageFace transform={`rotateY(-90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} imageSrc="/cube2.png" alt="Cube Left" />
              {/* Top face - cube2 */}
              <ImageFace transform={`rotateX(90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} imageSrc="/cube1.png" alt="Cube Top" />
              {/* Bottom face - cube3 */}
              <ImageFace transform={`rotateX(-90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} imageSrc="/cube3.png" alt="Cube Bottom" />
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-2 z-20"
            animate={{ y: [0, 10, 3], opacity }}
            transition={{ y: { duration: 1.5, repeat: Infinity }, opacity: { duration: 0.1 } }}
          >
            <span className="text-sm text-gray-500 font-medium">Cuộn để khám phá</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </>
  );
};