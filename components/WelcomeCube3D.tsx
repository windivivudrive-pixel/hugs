import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, useScroll as useFramerScroll, useTransform, useSpring } from 'framer-motion';

// 3D Cube wireframe
function MaskCube({ scrollProgress }: { scrollProgress: number }) {
    const edgesRef = useRef<THREE.LineSegments>(null);

    const rotationY = scrollProgress * Math.PI * 4;
    const rotationX = scrollProgress * Math.PI * 2;
    const scale = 1 + scrollProgress * 8;

    useFrame(() => {
        if (edgesRef.current) {
            edgesRef.current.rotation.y = rotationY;
            edgesRef.current.rotation.x = rotationX * 0.3;
            edgesRef.current.scale.setScalar(scale);
        }
    });

    const geometry = useMemo(() => new THREE.BoxGeometry(2, 2, 2), []);
    const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

    return (
        <lineSegments ref={edgesRef} geometry={edges}>
            <lineBasicMaterial color="#FF0290" linewidth={3} />
        </lineSegments>
    );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
    return (
        <>
            <ambientLight intensity={1} />
            <MaskCube scrollProgress={scrollProgress} />
        </>
    );
}

export const WelcomeCube3D: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const { scrollY } = useFramerScroll();
    const [windowHeight, setWindowHeight] = useState(800);
    const [windowWidth, setWindowWidth] = useState(1200);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const transitionEnd = windowHeight * 3.5;

    const progress = useTransform(scrollY, [0, transitionEnd], [0, 1]);
    const bgOpacity = useTransform(scrollY, [transitionEnd - 100, transitionEnd], [1, 0]);
    const containerDisplay = useTransform(scrollY, (y) => y > transitionEnd + 50 ? 'none' : 'block');

    const logoOpacity = useTransform(scrollY, [windowHeight * 0.5, windowHeight * 1.0], [1, 0]);
    const springLogoOpacity = useSpring(logoOpacity, { stiffness: 100, damping: 20 });

    useEffect(() => {
        const unsubscribe = progress.on('change', (v) => {
            setScrollProgress(v);
        });
        return unsubscribe;
    }, [progress]);

    // Calculate the clip-path hole size - starts small, expands outward
    const holeSize = 100 + scrollProgress * 2000;
    const cx = windowWidth / 2;
    const cy = windowHeight / 2;

    return (
        <motion.div
            ref={containerRef}
            className="fixed top-0 left-0 w-screen h-screen z-40 overflow-hidden pointer-events-none"
            style={{ display: containerDisplay, opacity: bgOpacity }}
        >
            {/* Full coverage animated gradient background - BOTTOM LAYER */}
            <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
                {/* Base gradient layer */}
                <div
                    className="absolute inset-[-50%] w-[200%] h-[200%]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,2,144,0.25) 0%, rgba(147,51,234,0.25) 25%, rgba(59,130,246,0.25) 50%, rgba(255,2,144,0.25) 75%, rgba(147,51,234,0.25) 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'gradientMove 8s ease-in-out infinite',
                    }}
                />
                {/* Secondary floating layer */}
                <div
                    className="absolute inset-[-50%] w-[200%] h-[200%]"
                    style={{
                        background: 'linear-gradient(45deg, rgba(59,130,246,0.2) 0%, rgba(255,2,144,0.2) 50%, rgba(147,51,234,0.2) 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'gradientMove 12s ease-in-out infinite reverse',
                    }}
                />
            </div>
            <style>{`
                @keyframes gradientMove {
                    0%, 100% { background-position: 0% 0%; }
                    50% { background-position: 100% 100%; }
                }
            `}</style>

            {/* White background with square hole in center - TOP LAYER (mask) */}
            <div
                className="absolute inset-0 z-[5] pointer-events-none bg-white"
                style={{
                    clipPath: `polygon(
            0% 0%, 
            0% 100%, 
            ${cx - holeSize}px 100%, 
            ${cx - holeSize}px ${cy - holeSize}px, 
            ${cx + holeSize}px ${cy - holeSize}px, 
            ${cx + holeSize}px ${cy + holeSize}px, 
            ${cx - holeSize}px ${cy + holeSize}px, 
            ${cx - holeSize}px 100%, 
            100% 100%, 
            100% 0%
          )`,
                }}
            />

            {/* 3D Canvas for cube wireframe */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    style={{ background: 'transparent' }}
                    gl={{ alpha: true, antialias: true }}
                >
                    <Scene scrollProgress={scrollProgress} />
                </Canvas>
            </div>

            {/* Logo overlay */}
            <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                style={{ opacity: springLogoOpacity }}
            >
                <div className="bg-[#FF0290] w-[200px] h-[200px] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white rounded-full flex items-center justify-center mb-3">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <h2 className="text-4xl font-black text-white text-center leading-none tracking-tighter">HUGE</h2>
                    <p className="text-white text-[10px] mt-1 tracking-[0.3em] font-bold uppercase">Agency</p>
                </div>
            </motion.div>

            {/* Floating Text */}
            <div className="absolute inset-0 flex items-center justify-center z-[6] pointer-events-none">
                <motion.h2
                    className="text-[10vw] font-black text-brand-dark/5 absolute top-[15%]"
                    style={{
                        opacity: useTransform(scrollY, [0, windowHeight * 0.5, windowHeight * 1.5], [0, 1, 0]),
                    }}
                >
                    WE ARE
                </motion.h2>
                <motion.h2
                    className="text-[10vw] font-black text-[#FF0290]/5 absolute bottom-[15%]"
                    style={{
                        opacity: useTransform(scrollY, [0, windowHeight * 0.5, windowHeight * 1.5], [0, 1, 0]),
                    }}
                >
                    CREATIVE
                </motion.h2>
            </div>
        </motion.div>
    );
};
