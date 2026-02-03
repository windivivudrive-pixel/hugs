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
    className="absolute backface-hidden overflow-hidden shadow-lg bg-white"
    style={{ transform, width: cubeSize, height: cubeSize }}
  >
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-full object-contain"
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

  const [baseCubeSize, setBaseCubeSize] = useState(300);
  const perspective = 1200;

  // Responsive cube size
  useEffect(() => {
    const updateCubeSize = () => {
      const isMobile = window.innerWidth < 768;
      setBaseCubeSize(isMobile ? 160 : 300);
    };
    updateCubeSize();
    window.addEventListener('resize', updateCubeSize);
    return () => window.removeEventListener('resize', updateCubeSize);
  }, []);

  // Lerp function for smooth interpolation
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Refs for animation state
  const introStateRef = useRef({ startTime: 0, completed: false, started: false });
  const scrollStateRef = useRef({ rotProgress: 0, sidebarProgress: 0, isInSidebar: false });

  // Start Timer and Animation loop
  useEffect(() => {
    // Timer to start intro at 2300ms
    const timer = setTimeout(() => {
      if (!introStateRef.current.started) {
        introStateRef.current.started = true;
        introStateRef.current.startTime = performance.now();
      }
    }, 2000);

    const animate = () => {
      const now = performance.now();

      // Calculate Intro Angle
      let introAngle = 0;

      if (introStateRef.current.started) {
        if (!introStateRef.current.completed) {
          const elapsed = now - introStateRef.current.startTime;
          const duration = 4500; // Duration 3.5s
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          introAngle = 0 + (540 - 0) * ease;

          if (progress >= 1) introStateRef.current.completed = true;
        } else {
          introAngle = 540;
        }
      }

      // Calculate Target Rotation
      let targetY = introAngle;
      let targetX = 0;

      if (scrollStateRef.current.isInSidebar) {
        targetY += 270 + scrollStateRef.current.sidebarProgress * 180;
        targetX = 15;
      } else {
        targetY += scrollStateRef.current.rotProgress * 270;
        targetX = 0;
      }

      // Smooth Interpolation
      const lerpFactor = 0.08;
      currentRef.current.x = lerp(currentRef.current.x, targetX, lerpFactor);
      currentRef.current.y = lerp(currentRef.current.y, targetY, lerpFactor);

      setRotation({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Update Scroll State
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const rotationEnd = windowHeight * 0.75;

      if (scrollY < rotationEnd) {
        // Center phase
        setPhase('center');
        setCubeScale(1);
        setCubePosition({ x: 0, y: 0 });
        setSidebarVerticalProgress(0);

        scrollStateRef.current.isInSidebar = false;
        scrollStateRef.current.rotProgress = scrollY / rotationEnd;
      } else {
        // Sidebar phase
        setPhase('sidebar');
        // Mobile: smaller cube in sidebar
        const isMobile = window.innerWidth < 768;
        setCubeScale(isMobile ? 0.40 : 0.30);

        scrollStateRef.current.isInSidebar = true;

        // Position logic - mobile closer to right edge
        const rightOffset = isMobile
          ? window.innerWidth / 2 - 45  // Closer to right on mobile
          : window.innerWidth / 2 - 80;
        const totalScrollableHeight = document.documentElement.scrollHeight - windowHeight;
        const remainingScroll = totalScrollableHeight - rotationEnd;
        const verticalProgress = Math.min((scrollY - rotationEnd) / remainingScroll, 1);
        setSidebarVerticalProgress(verticalProgress);

        const startY = -windowHeight * 0.35;
        const endY = windowHeight * 0.25;
        const topOffset = startY + verticalProgress * (endY - startY);

        setCubePosition({ x: rightOffset, y: topOffset });

        // Rotation logic
        const sidebarProgress = (scrollY - rotationEnd) / windowHeight;
        scrollStateRef.current.sidebarProgress = sidebarProgress;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
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
              <div className="absolute inset-0 overflow-hidden pointer-events-none bg-white">
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
            {(() => {
              const effectiveRot = rotation.y % 720;
              // Effectively "post intro" once we hit 540.
              // Note: During scroll, y goes > 540.
              const isPostIntro = rotation.y >= 535; // Slight buffer before 540 to ensure switch happens while hidden if possible, or exactly at finish.

              // Mapping based on user request & state:
              // Post-Intro (Cube Mode):
              // Front -> cube4
              // Back  -> cube3
              // Right -> cube2 (User's latest edit)
              // Left  -> cube1 (User's latest edit)

              // Front logic:
              const frontImg = isPostIntro
                ? '/cube4.png'
                : (effectiveRot > 135 && effectiveRot < 540 ? '/logo-partner/partner4.png' : '/cube3.png');

              // Back logic:
              // Must handle isPostIntro to prevent reverting to partner8 when effectiveRot wraps (e.g. 90)
              const backImg = isPostIntro
                ? '/cube3.png'
                : (effectiveRot > 315 ? '/cube3.png' : '/logo-partner/partner8.png');

              // Right logic:
              const rightImg = isPostIntro ? '/cube2.png' : '/logo-partner/partner9.png';

              // Left logic:
              const leftImg = isPostIntro ? '/cube1.png' : '/logo-partner/partner3.png';

              return (
                <>
                  <ImageFace transform={`translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc={frontImg} alt="Cube Front" />
                  <ImageFace transform={`rotateY(180deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc={backImg} alt="Cube Back" />
                  <ImageFace transform={`rotateY(90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc={rightImg} alt="Cube Right" />
                  <ImageFace transform={`rotateY(-90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc={leftImg} alt="Cube Left" />
                  <ImageFace transform={`rotateX(90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube2.png" alt="Cube Top" />
                  <ImageFace transform={`rotateX(-90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube3.png" alt="Cube Bottom" />
                </>
              );
            })()}
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