import { createContext, useContext, useEffect, useState } from 'react';

interface AwayStatusContextType {
  isAway: boolean;
  setIsAway: (away: boolean) => void;
}

const AwayStatusContext = createContext<AwayStatusContextType | undefined>(undefined);

export function AwayStatusProvider({ children }: { children: React.ReactNode }) {
  const [isAway, setIsAway] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adone_aevia_away_status');
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('adone_aevia_away_status', isAway.toString());
    
    // Update favicon based on away status
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    
    if (favicon) {
      if (isAway) {
        // Create a sleeping emoji favicon
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#333';
          ctx.fillRect(0, 0, 32, 32);
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('😴', 16, 16);
          favicon.href = canvas.toDataURL();
        }
      } else {
        favicon.href = '/favicon.ico';
      }
    }
  }, [isAway]);

  return (
    <AwayStatusContext.Provider value={{ isAway, setIsAway }}>
      {children}
    </AwayStatusContext.Provider>
  );
}

export function useAwayStatus() {
  const context = useContext(AwayStatusContext);
  if (context === undefined) {
    throw new Error('useAwayStatus must be used within an AwayStatusProvider');
  }
  return context;
}
