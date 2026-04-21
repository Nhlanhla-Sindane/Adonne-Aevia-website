import { useState } from 'react';
import { ArrowRight, Clock, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Page = 'home' | 'shop' | 'booking' | 'track' | 'admin';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const services = [
  {
    id: 'classic-lashes',
    name: 'Classic Lashes',
    description: 'Natural-looking individual lash extensions for an elegant, everyday look.',
    price: 150,
    duration: '1.5 hours',
    images: ['/images/classic-lashes-1.jpg', '/images/classic-lashes-2.jpg', '/images/classic-lashes-3.jpg', '/images/classic-lashes-4.jpg'],
    category: 'lashes' as const,
  },
  {
    id: 'hybrid-lashes',
    name: 'Hybrid Lashes',
    description: 'A perfect blend of classic and volume lashes for added drama and fullness.',
    price: 200,
    duration: '2 hours',
    images: ['/images/hybrid-lashes-1.jpg', '/images/hybrid-lashes-2.jpg', '/images/hybrid-lashes-3.jpg', '/images/hybrid-lashes-4.jpg'],
    category: 'lashes' as const,
  },
  {
    id: 'wig-installation',
    name: 'Basic Wig Installation',
    description: 'Professional lace-front wig installation with seamless blending.',
    price: 250,
    duration: '2 hours',
    images: ['/images/wig-install-1.jpg', '/images/wig-install-2.jpg'],
    category: 'wigs' as const,
  },
];

const features = [
  { icon: Star, title: 'Premium Quality', description: 'Using only the finest materials' },
  { icon: Clock, title: 'Flexible Booking', description: 'Book appointments that fit your schedule' },
  { icon: Check, title: 'Expert Service', description: 'Years of professional experience' },
];

function ServiceCard({ service, onNavigate }: { service: typeof services[0]; onNavigate: (page: Page) => void }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showBalloon, setShowBalloon] = useState(false);

  return (
    <Card 
      className="service-card overflow-hidden group relative"
      onMouseEnter={() => setShowBalloon(true)}
      onMouseLeave={() => setShowBalloon(false)}
    >
      {/* Hover Balloon */}
      {showBalloon && (
        <div className="absolute top-4 right-4 z-20 hover-balloon">
          <div className="bg-[hsl(var(--pink))] text-white px-4 py-2 rounded-full shadow-lg">
            <span className="font-bold">{service.name}</span>
            <span className="mx-2">-</span>
            <span>R{service.price}</span>
          </div>
        </div>
      )}

      {/* Image Carousel */}
      <div className="relative h-64 overflow-hidden">
        {service.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${service.name} ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              idx === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {service.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentImage 
                  ? 'bg-[hsl(var(--pink))] w-6' 
                  : 'bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category Badge */}
        <Badge className="absolute top-4 left-4 bg-white/90 text-black capitalize">
          {service.category}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold">{service.name}</h3>
          <span className="text-[hsl(var(--pink))] font-bold">R{service.price}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          {service.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {service.duration}
          </span>
        </div>

        <Button 
          className="w-full bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
          onClick={() => onNavigate('booking')}
        >
          Book Now
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--pink))]/10 via-transparent to-[hsl(var(--pink))]/5" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--pink))]/10 text-[hsl(var(--pink))] text-sm font-medium mb-6">
              <span>❤️</span>
              Premium Beauty Services
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              OUR{' '}
              <span className="gradient-text">HEARTS DESIRE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience luxury lash extensions and professional wig installations 
              tailored to your unique style. Book your appointment today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
                onClick={() => onNavigate('booking')}
              >
                Book Appointment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('shop')}
              >
                Shop Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--pink))]/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[hsl(var(--pink))]" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From natural classics to dramatic hybrids, we offer a range of lash 
              and wig services to suit every occasion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[hsl(var(--pink))]/20 to-[hsl(var(--pink))]/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to follow your heart's desire?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Book your appointment today and experience the Adonńe Aevia difference.
          </p>
          <Button 
            size="lg" 
            className="bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
            onClick={() => onNavigate('booking')}
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
