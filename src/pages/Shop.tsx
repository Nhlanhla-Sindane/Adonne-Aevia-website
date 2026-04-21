import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, X, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Product, CartItem } from '@/types';

// Sample products data
const products: Product[] = [
  {
    id: '1',
    name: 'Lash Shampoo',
    description: 'Gentle foaming cleanser for lash extensions. Keeps your lashes clean and extends their lifespan.',
    price: 120,
    category: 'aftercare',
    image: '/images/classic-lashes-1.jpg',
    inStock: true,
  },
  {
    id: '2',
    name: 'Lash Serum',
    description: 'Nourishing serum to promote natural lash growth and strength.',
    price: 180,
    category: 'aftercare',
    image: '/images/classic-lashes-2.jpg',
    inStock: true,
  },
  {
    id: '3',
    name: 'Silk Eye Mask',
    description: 'Luxury silk eye mask for protecting your lashes while sleeping.',
    price: 150,
    category: 'accessories',
    image: '/images/hybrid-lashes-1.jpg',
    inStock: true,
  },
  {
    id: '4',
    name: 'Lash Brush Set',
    description: 'Set of 5 disposable lash brushes for daily grooming.',
    price: 50,
    category: 'accessories',
    image: '/images/hybrid-lashes-2.jpg',
    inStock: true,
  },
  {
    id: '5',
    name: 'Wig Cap',
    description: 'Breathable wig cap for comfortable all-day wear.',
    price: 80,
    category: 'wigs',
    image: '/images/wig-install-1.jpg',
    inStock: true,
  },
  {
    id: '6',
    name: 'Wig Glue',
    description: 'Professional-grade wig adhesive for secure hold.',
    price: 200,
    category: 'wigs',
    image: '/images/wig-install-2.jpg',
    inStock: true,
  },
];

const categories = ['all', 'aftercare', 'accessories', 'wigs'];

export function Shop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setCart([]);
    toast({
      title: 'Order placed!',
      description: 'Your order has been received. Check your email for confirmation.',
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop</h1>
            <p className="text-muted-foreground">
              Premium products for lash and wig care
            </p>
          </div>

          {/* Cart Button */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[hsl(var(--pink))] text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[60vh] overflow-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 p-4 bg-muted rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">R{item.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-[hsl(var(--pink))]">
                        R{cartTotal}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                    >
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-[hsl(var(--pink))]' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 capitalize">
                  {product.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="text-[hsl(var(--pink))] font-bold">
                    R{product.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </Button>
                  <Button 
                    className="bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
                    onClick={() => addToCart(product)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <Badge className="capitalize">{selectedProduct.category}</Badge>
              <p className="text-muted-foreground">{selectedProduct.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[hsl(var(--pink))]">
                  R{selectedProduct.price}
                </span>
                <Button 
                  className="bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                required
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input 
                type="tel" 
                required
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                placeholder="+27 12 345 6789"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Contact Method</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md bg-background">
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="instagram">Instagram DM</option>
              </select>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-[hsl(var(--pink))]">
                R{cartTotal}
              </span>
            </div>
            <Button 
              type="submit"
              className="w-full bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
            >
              <Check className="h-4 w-4 mr-2" />
              Place Order
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
