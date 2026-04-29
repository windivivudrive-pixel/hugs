'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

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

export const GlobalWelcomeCube: React.FC = () => {
  const pathname = usePathname();
  const [rotation, setRotation] = useState({ x: 15, y: -20 });
  const [baseCubeSize, setBaseCubeSize] = useState(300);
  const [cubeScale, setCubeScale] = useState(0.3);
  const [cubePosition, setCubePosition] = useState({ x: 0, y: 0 });

  const targetRotRef = useRef({ x: 15, y: -20 });
  const currentRotRef = useRef({ x: 15, y: -20 });
  const lastRotationRef = useRef({ x: 15, y: -20 });
  const rafRef = useRef<number | undefined>(undefined);
  const isRunningRef = useRef(false);
  const idleFramesRef = useRef(0);

  const [isReady, setIsReady] = useState(false);

  // Responsive cube size
  useEffect(() => {
    const update = () => {
      const isMobile = window.innerWidth < 768;
      setBaseCubeSize(isMobile ? 160 : 300);
      setCubeScale(isMobile ? 0.40 : 0.30);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Animation loop — fully ref-based, same as home WelcomeCube
  const startLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    idleFramesRef.current = 0;

    const animate = () => {
      const lerpFactor = 0.08;
      currentRotRef.current.x = lerp(currentRotRef.current.x, targetRotRef.current.x, lerpFactor);
      currentRotRef.current.y = lerp(currentRotRef.current.y, targetRotRef.current.y, lerpFactor);

      const dx = Math.abs(currentRotRef.current.x - lastRotationRef.current.x);
      const dy = Math.abs(currentRotRef.current.y - lastRotationRef.current.y);

      if (dx > 0.05 || dy > 0.05) {
        lastRotationRef.current = { x: currentRotRef.current.x, y: currentRotRef.current.y };
        setRotation({
          x: currentRotRef.current.x,
          y: currentRotRef.current.y,
        });
        idleFramesRef.current = 0;
      } else {
        idleFramesRef.current++;
      }

      if (idleFramesRef.current > 30) {
        isRunningRef.current = false;
        rafRef.current = undefined;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Scroll handler — uses SAME position logic as home WelcomeCube sidebar mode
  useEffect(() => {
    const handleScroll = () => {
      startLoop();

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;

      // Position logic — COPIED from home WelcomeCube sidebar mode
      const rightOffset = isMobile
        ? window.innerWidth / 2 - 45
        : window.innerWidth / 2 - 80;

      const totalScrollableHeight = document.documentElement.scrollHeight - windowHeight;
      const remainingScroll = totalScrollableHeight > 0 ? totalScrollableHeight : 1;
      const verticalProgress = Math.min(scrollY / remainingScroll, 1);

      const startY = -windowHeight * 0.35;
      const endY = windowHeight * 0.25;
      const topOffset = startY + verticalProgress * (endY - startY);

      setCubePosition({ x: rightOffset, y: topOffset });

      // Rotation
      const sidebarProgress = scrollY / windowHeight;
      targetRotRef.current.y = 270 + sidebarProgress * 180;
      targetRotRef.current.x = 15;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    startLoop();
    setIsReady(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      isRunningRef.current = false;
    };
  }, [startLoop]);

  // Don't render on home page
  if (pathname === '/') return null;

  // Don't render on mobile for Careers page as requested
  if (pathname === '/careers') {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return null;
    }
  }

  if (!isReady) return null; // Avoid render until position is calculated to prevent center fly-in

  return (
    <>
      {/* Container centered in viewport, same as home WelcomeCube */}
      <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-[40] pointer-events-none">
        <motion.div
          className="relative z-10"
          initial={{
            x: cubePosition.x,
            y: cubePosition.y,
            scale: cubeScale,
          }}
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
          style={{ perspective: '1200px' }}
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
            <ImageFace transform={`translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube4.png" alt="Cube Front" />
            <ImageFace transform={`rotateY(180deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube3.png" alt="Cube Back" />
            <ImageFace transform={`rotateY(90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube2.png" alt="Cube Right" />
            <ImageFace transform={`rotateY(-90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/team-all.png" alt="Cube Left" />
            <ImageFace transform={`rotateX(90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube2.png" alt="Cube Top" />
            <ImageFace transform={`rotateX(-90deg) translateZ(${baseCubeSize / 2}px)`} cubeSize={baseCubeSize} imageSrc="/cube3.png" alt="Cube Bottom" />
          </div>
        </motion.div>
      </div>

      <style>{`
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </>
  );
};
