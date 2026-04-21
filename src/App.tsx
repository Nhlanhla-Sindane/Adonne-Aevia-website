import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/context/ThemeContext';
import { AwayStatusProvider } from '@/context/AwayStatusContext';
import { WinkingLashes } from '@/components/loading/WinkingLashes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { Booking } from '@/pages/Booking';
import { TrackOrder } from '@/pages/TrackOrder';
import { Admin } from '@/pages/Admin';
import './App.css';

type Page = 'home' | 'shop' | 'booking' | 'track' | 'admin';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cartCount] = useState(0);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('adone_aevia_visited');
    if (hasVisited) {
      setIsLoading(false);
    } else {
      sessionStorage.setItem('adone_aevia_visited', 'true');
    }

    // Check URL for direct page access
    const path = window.location.pathname.slice(1) as Page;
    if (['home', 'shop', 'booking', 'track', 'admin'].includes(path)) {
      setCurrentPage(path);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
  };

  if (isLoading) {
    return (
      <ThemeProvider>
        <AwayStatusProvider>
          <WinkingLashes onComplete={handleLoadingComplete} duration={3000} />
          <Toaster />
        </AwayStatusProvider>
      </ThemeProvider>
    );
  }

  // Admin page without header/footer
  if (currentPage === 'admin') {
    return (
      <ThemeProvider>
        <AwayStatusProvider>
          <Admin />
          <Toaster />
        </AwayStatusProvider>
      </ThemeProvider>
    );
  }

  // Public pages with header/footer
  return (
    <ThemeProvider>
      <AwayStatusProvider>
        <div className="min-h-screen flex flex-col">
          <Header 
            cartCount={cartCount} 
            currentPage={currentPage}
            onNavigate={navigateTo}
          />
          <main className="flex-1">
            {currentPage === 'home' && <Home onNavigate={navigateTo} />}
            {currentPage === 'shop' && <Shop />}
            {currentPage === 'booking' && <Booking />}
            {currentPage === 'track' && <TrackOrder />}
          </main>
          <Footer onNavigate={navigateTo} />
        </div>
        <Toaster />
      </AwayStatusProvider>
    </ThemeProvider>
  );
}

export default App;
