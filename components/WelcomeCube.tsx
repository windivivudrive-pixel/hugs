import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Partner logos for cube faces
const partnerLogos = [
  { name: 'VinGroup', color: '#1a1a2e' },
  { name: 'Samsung', color: '#1428A0' },
  { name: 'Shopee', color: '#EE4D2D' },
  { name: 'TikTok', color: '#000000' },
  { name: 'Meta', color: '#0668E1' },
];

// First face with HUGs logo
const BrandFace: React.FC<{
  transform: string;
  cubeSize: number;
}> = ({ transform, cubeSize }) => (
  <div
    className="absolute backface-hidden flex flex-col items-center justify-center bg-white shadow-lg"
    style={{ transform, width: cubeSize, height: cubeSize }}
  >
    <img
      src="/logo hugs.png"
      alt="HUGs Agency Logo"
      className="w-32 h-32 object-contain mb-2"
    />
    <span className="text-xl font-black text-brand-pink tracking-tight">
      HUGs Agency
    </span>
  </div>
);

// Face with partner logo
const LogoFace: React.FC<{
  transform: string;
  cubeSize: number;
  logo: { name: string; color: string };
}> = ({ transform, cubeSize, logo }) => (
  <div
    className="absolute backface-hidden flex items-center justify-center bg-white shadow-lg"
    style={{ transform, width: cubeSize, height: cubeSize }}
  >
    <span className="text-2xl font-bold tracking-tight" style={{ color: logo.color }}>
      {logo.name}
    </span>
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
              {/* Front face - HUGs brand logo */}
              <BrandFace transform={`translateZ(${translateZ}px)`} cubeSize={cubeSize} />
              {/* Other faces - partner logos */}
              <LogoFace transform={`rotateY(180deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} logo={partnerLogos[0]} />
              <LogoFace transform={`rotateY(90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} logo={partnerLogos[1]} />
              <LogoFace transform={`rotateY(-90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} logo={partnerLogos[2]} />
              <LogoFace transform={`rotateX(90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} logo={partnerLogos[3]} />
              <LogoFace transform={`rotateX(-90deg) translateZ(${translateZ}px)`} cubeSize={cubeSize} logo={partnerLogos[4]} />
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

      {/* Scroll spacer */}
      <div className="h-[15vh]" />

      {/* Team Introduction / Mission Section */}
      <div className="relative z-10 bg-white pb-0 pt-20 overflow-hidden min-h-[700px] flex items-end">

        {/* Pink Wave Background - High Z-index to cover bottom of images */}
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none translate-y-1">
          <svg viewBox="0 0 1440 320" className="w-full h-auto object-cover" preserveAspectRatio="none">
            <path fill="#eb2166" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,144C384,160,480,160,576,149.3C672,139,768,117,864,128C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-end pb-10 md:pb-20">

          {/* Left Image - Team 1 - Slides in from left */}
          <motion.div
            className="md:col-span-6 flex items-end justify-start -mb-10 md:-mb-28 relative z-10"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img src="/team 1.png" alt="HUGs Team" className="h-[400px] md:h-[850px] object-contain drop-shadow-xl" />
          </motion.div>

          {/* Center/Right Content Area */}
          <div className="md:col-span-6 flex flex-col items-end justify-bottom h-full relative z-0">

            {/* Text Content - Slides in from right */}
            <div className="text-right mt-auto md:mt-[50px] px-4 md:px-10 md:mr-[120px] w-full relative z-30">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-7xl font-black text-[#eb2166] mb-4 drop-shadow-sm leading-tight text-nowrap" style={{ fontFamily: '"Rounded Mplus 1c", "Varela Round", sans-serif' }}>
                  Sứ Mệnh Của <br />
                  <span className="text-5xl md:text-8xl">HUGS</span>
                </h2>

                <motion.div
                  className="flex flex-col items-end gap-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <p className="text-gray-600 text-base md:text-lg font-medium max-w-sm leading-relaxed text-right">
                    Chúng tôi đồng hành cùng sự phát triển của doanh nghiệp thông qua những chiến lược truyền thông sáng tạo và hiệu quả nhất.
                  </p>
                  <div className="h-1 w-20 bg-[#eb2166] rounded-full mt-2"></div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
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