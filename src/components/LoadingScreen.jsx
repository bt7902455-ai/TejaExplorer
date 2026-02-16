import React, { useEffect, useMemo, useState } from 'react';
import profileImage from '../../TejaMathukumalliPictureLinkedIn.jpg';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const stars = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${2 + Math.random() * 3}s`,
        delay: `${Math.random() * 2}s`,
      })),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 10);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-space-dark z-50 flex flex-col items-center justify-center">
      <div className="relative w-64 h-64 mb-8">
        {/* Rotating galaxy */}
        <div className="absolute inset-0 rounded-full border-4 border-space-blue animate-spin-slow">
          <div className="absolute inset-2 rounded-full border-2 border-space-neon animate-pulse-slow"></div>
          <div className="absolute inset-6 rounded-full border border-space-pink animate-pulse-slow"></div>
        </div>

        <div className="absolute inset-12 rounded-full overflow-hidden border-2 border-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.65)]">
          <img
            src={profileImage}
            alt="Teja Mathukumalli"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Stars */}
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-space-neon rounded-full"
            style={{
              top: star.top,
              left: star.left,
              animation: `pulse ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white orbitron mb-4">
          LAUNCHING <span className="text-space-neon">SPACE PORTFOLIO</span>
        </h2>
        <p className="text-space-neon text-lg mb-8">INITIALIZING SYSTEMS...</p>
      </div>

      {/* Progress bar */}
      <div className="w-80 h-2 bg-space-blue rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-space-neon to-space-pink transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-white mt-2 font-mono">{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;
