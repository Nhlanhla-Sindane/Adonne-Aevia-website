import { Moon, Sun, ShoppingBag, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAwayStatus } from '@/context/AwayStatusContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

type Page = 'home' | 'shop' | 'booking' | 'track' | 'admin';

interface HeaderProps {
  cartCount?: number;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks: { page: Page; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'shop', label: 'Shop' },
  { page: 'booking', label: 'Book Now' },
  { page: 'track', label: 'Track Order' },
];

export function Header({ cartCount = 0, currentPage, onNavigate }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { isAway } = useAwayStatus();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">❤️</span>
          <span className="text-xl font-bold gradient-text">Adonńe Aevia</span>
          {isAway && (
            <Badge variant="secondary" className="ml-2 text-xs">
              😴 Away
            </Badge>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`text-sm font-medium transition-colors hover:text-[hsl(var(--pink))] ${
                currentPage === link.page ? 'text-[hsl(var(--pink))]' : 'text-foreground'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Cart */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full"
            onClick={() => onNavigate('shop')}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[hsl(var(--pink))] text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => onNavigate(link.page)}
                    className={`text-lg font-medium text-left transition-colors hover:text-[hsl(var(--pink))] ${
                      currentPage === link.page ? 'text-[hsl(var(--pink))]' : 'text-foreground'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
