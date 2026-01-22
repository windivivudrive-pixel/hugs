import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [phase, setPhase] = useState<'center' | 'sidebar'>('center');
  const [sidebarVerticalProgress, setSidebarVerticalProgress] = useState(0);
  const [cubeScale, setCubeScale] = useState(1); // 1 = full, 0.33 = mini
  const [cubePosition, setCubePosition] = useState({ x: 0, y: 0 }); // Offset from center
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const baseCubeSize = 300;
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

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Phase 1: Center rotation (0 to 270deg)
      const rotationEnd = windowHeight * 0.75;

      if (scrollY < rotationEnd) {
        // Center phase - rotate
        setPhase('center');
        setCubeScale(1);
        setCubePosition({ x: 0, y: 0 });
        setSidebarVerticalProgress(0);

        const rotProgress = scrollY / rotationEnd;
        targetRef.current = {
          y: rotProgress * 270,
          x: 0,
        };
      } else {
        // Sidebar phase
        setPhase('sidebar');
        setCubeScale(0.30); // 10% smaller

        // Calculate position to right side (moved left a bit)
        const rightOffset = window.innerWidth / 2 - 80;

        // Calculate vertical progress
        const totalScrollableHeight = document.documentElement.scrollHeight - windowHeight;
        const remainingScroll = totalScrollableHeight - rotationEnd;
        const verticalProgress = Math.min((scrollY - rotationEnd) / remainingScroll, 1);
        setSidebarVerticalProgress(verticalProgress);

        // Vertical position: from top to 1/4 screen from bottom
        const startY = -windowHeight * 0.35; // Start near top
        const endY = windowHeight * 0.25; // End at 1/4 from bottom (center + 0.25 = 0.75 from top)
        const topOffset = startY + verticalProgress * (endY - startY);

        setCubePosition({ x: rightOffset, y: topOffset });

        // Continuous rotation
        const sidebarProgress = (scrollY - rotationEnd) / windowHeight;
        targetRef.current = {
          y: 270 + sidebarProgress * 180,
          x: 15,
        };
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentCubeSize = baseCubeSize * cubeScale;
  const currentTranslateZ = currentCubeSize / 2;

  return (
    <>
      {/* Sticky container for cube */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-50 pointer-events-none">

        {/* Background & Text - only visible in center phase */}
        <AnimatePresence>
          {phase === 'center' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-0"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

              {/* Floating Text */}
              <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
                <motion.h2
                  className="text-[10vw] font-black text-brand-dark/5 absolute top-[20%]"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  WE ARE
                </motion.h2>
                <motion.h2
                  className="text-[10vw] font-black text-[#FF0290]/5 absolute bottom-[20%]"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  HUGS
                </motion.h2>
              </div>

              {/* Scroll indicator - centered below cube */}
              <motion.div
                className="fixed bottom-10 left-0 right-0 flex flex-col items-center gap-2 z-20"
                animate={{ y: [0, 10, 3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-sm text-gray-500 font-medium">Cuộn để khám phá</span>
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
                  <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Cube - Single element that animates position/scale */}
        <motion.div
          className="relative z-10"
          animate={{
            x: cubePosition.x,
            y: cubePosition.y,
            scale: cubeScale,
          }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
          }}
          style={{ perspective: `${perspective}px` }}
        >
          <div
            className="relative transform-style-3d will-change-transform"
            style={{
              width: baseCubeSize,
              height: baseCubeSize,
              transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <ImageFace transform={`translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube3.png" alt="Cube Front" />
            <ImageFace transform={`rotateY(180deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube4.png" alt="Cube Back" />
            <ImageFace transform={`rotateY(90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube1.png" alt="Cube Right" />
            <ImageFace transform={`rotateY(-90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube2.png" alt="Cube Left" />
            <ImageFace transform={`rotateX(90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube2.png" alt="Cube Top" />
            <ImageFace transform={`rotateX(-90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube3.png" alt="Cube Bottom" />
          </div>
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