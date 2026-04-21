import { useEffect, useState } from 'react';

interface WinkingLashesProps {
  onComplete?: () => void;
  duration?: number;
}

export function WinkingLashes({ onComplete, duration = 3000 }: WinkingLashesProps) {
  const [progress, setProgress] = useState(0);
  const [winkPhase, setWinkPhase] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      // Wink phases: 0=open, 1=closing, 2=closed, 3=opening
      const phase = Math.floor((elapsed % 800) / 200);
      setWinkPhase(phase);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  const getEyeScaleY = () => {
    switch (winkPhase) {
      case 0: return 1;
      case 1: return 0.3;
      case 2: return 0.1;
      case 3: return 0.5;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Logo Text */}
      <h1 className="text-4xl md:text-6xl font-bold mb-12 gradient-text tracking-tight">
        Adonńe Aevia
      </h1>
      
      {/* Winking Eyes Container */}
      <div className="flex items-center gap-8 md:gap-16">
        {/* Left Eye */}
        <div className="relative">
          <svg 
            width="80" 
            height="60" 
            viewBox="0 0 80 60" 
            className="md:w-24 md:h-20"
            style={{ transform: `scaleY(${getEyeScaleY()})`, transition: 'transform 0.15s ease-out' }}
          >
            {/* Eye shape */}
            <ellipse 
              cx="40" 
              cy="30" 
              rx="35" 
              ry="25" 
              fill="none" 
              stroke="hsl(var(--pink))" 
              strokeWidth="3"
            />
            {/* Lashes */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`left-lash-${i}`}
                x1={15 + i * 12}
                y1={12}
                x2={5 + i * 14}
                y2={-5}
                stroke="hsl(var(--pink))"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transformOrigin: `${15 + i * 12}px 12px`,
                  transform: `rotate(${-20 + i * 5}deg)`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Center decoration */}
        <div className="w-3 h-3 rounded-full bg-[hsl(var(--pink))] animate-pulse" />

        {/* Right Eye */}
        <div className="relative">
          <svg 
            width="80" 
            height="60" 
            viewBox="0 0 80 60" 
            className="md:w-24 md:h-20"
            style={{ transform: `scaleY(${winkPhase === 2 ? 0.1 : 1})`, transition: 'transform 0.15s ease-out' }}
          >
            {/* Eye shape */}
            <ellipse 
              cx="40" 
              cy="30" 
              rx="35" 
              ry="25" 
              fill="none" 
              stroke="hsl(var(--pink))" 
              strokeWidth="3"
            />
            {/* Lashes */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`right-lash-${i}`}
                x1={15 + i * 12}
                y1={12}
                x2={5 + i * 14}
                y2={-5}
                stroke="hsl(var(--pink))"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transformOrigin: `${15 + i * 12}px 12px`,
                  transform: `rotate(${20 - i * 5}deg)`,
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-8 text-muted-foreground text-sm tracking-widest uppercase">
        Loading Experience
      </p>

      {/* Progress bar */}
      <div className="mt-4 w-48 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-[hsl(var(--pink))] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-2 text-xs text-muted-foreground">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
