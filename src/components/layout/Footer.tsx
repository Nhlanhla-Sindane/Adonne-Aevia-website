import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

type Page = 'home' | 'shop' | 'booking' | 'track' | 'admin';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
              <span className="text-2xl">❤️</span>
              <span className="text-xl font-bold gradient-text">Adonńe Aevia</span>
            </button>
            <p className="text-sm text-muted-foreground">
              Elevating beauty with premium lash extensions and professional wig installations.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/oreoswithoros_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[hsl(var(--pink))] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:hello@adoneaevia.com"
                className="text-muted-foreground hover:text-[hsl(var(--pink))] transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="tel:+27655566983"
                className="text-muted-foreground hover:text-[hsl(var(--pink))] transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a href="wa.me/27655566983">
              Whatsapp for orders
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="text-sm text-muted-foreground hover:text-[hsl(var(--pink))] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="text-sm text-muted-foreground hover:text-[hsl(var(--pink))] transition-colors"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('booking')}
                  className="text-sm text-muted-foreground hover:text-[hsl(var(--pink))] transition-colors"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('track')}
                  className="text-sm text-muted-foreground hover:text-[hsl(var(--pink))] transition-colors"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Classic Lashes</li>
              <li className="text-sm text-muted-foreground">Hybrid Lashes</li>
              <li className="text-sm text-muted-foreground">Volume Lashes</li>
              <li className="text-sm text-muted-foreground">Wig Installation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Johannesburg, South Africa
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                065 556 6983
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                hello@adoneaevia.com
              </li>
            </ul>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 flex-wrap">
            Made to meet your heart's desire  by
            <a 
              href="/humans.txt" 
              className="text-[hsl(var(--pink))] hover:underline font-medium"
            >
              Nhlanhla Sindane
            </a>
            &
            <a 
              href="/humans.txt" 
              className="text-[hsl(var(--pink))] hover:underline font-medium"
            >
              Hakoe Dube
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} Adonńe Aevia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
