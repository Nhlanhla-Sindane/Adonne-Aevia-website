import React, { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Home, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Order, OrderStatus } from '@/types';

// Mock orders for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+27 12 345 6789',
    items: [
      { id: '1', name: 'Lash Shampoo', price: 120, quantity: 1, description: '', category: 'aftercare', image: '', inStock: true },
    ],
    total: 120,
    status: 'shipped',
    preferredContact: 'whatsapp',
    contactValue: '+27 12 345 6789',
    trackingNumber: 'ADV123456',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '2',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '+27 98 765 4321',
    items: [
      { id: '2', name: 'Lash Serum', price: 180, quantity: 2, description: '', category: 'aftercare', image: '', inStock: true },
    ],
    total: 360,
    status: 'processing',
    preferredContact: 'email',
    contactValue: 'john@example.com',
    trackingNumber: 'ADV789012',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21'),
  },
];

const orderSteps: { status: OrderStatus; label: string; icon: React.ElementType; description: string }[] = [
  { status: 'pending', label: 'Order Received', icon: Package, description: 'We\'ve received your order' },
  { status: 'pop_verified', label: 'Payment Verified', icon: CheckCircle, description: 'Your payment has been confirmed' },
  { status: 'processing', label: 'Processing', icon: Clock, description: 'We\'re preparing your order' },
  { status: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
  { status: 'delivered', label: 'Delivered', icon: Home, description: 'Order delivered successfully' },
];

function OrderProgress({ status }: { status: OrderStatus }) {
  const currentStepIndex = orderSteps.findIndex(step => step.status === status);
  const progress = ((currentStepIndex + 1) / orderSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[hsl(var(--pink-light))] to-[hsl(var(--pink))] transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {orderSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.status} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-[hsl(var(--pink))] text-white' 
                      : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-[hsl(var(--pink))]/20 scale-110' : ''}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`text-xs mt-2 text-center max-w-[80px] ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Card */}
      <Card className="bg-[hsl(var(--pink))]/5 border-[hsl(var(--pink))]/20">
        <CardContent className="p-4 flex items-center gap-4">
          {React.createElement(orderSteps[currentStepIndex]?.icon || Package, {
            className: "h-8 w-8 text-[hsl(var(--pink))]"
          })}
          <div>
            <h3 className="font-semibold">{orderSteps[currentStepIndex]?.label}</h3>
            <p className="text-sm text-muted-foreground">
              {orderSteps[currentStepIndex]?.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderDetails({ order }: { order: Order }) {
  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-500',
    pop_verified: 'bg-blue-500',
    processing: 'bg-purple-500',
    shipped: 'bg-[hsl(var(--pink))]',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Order #{order.trackingNumber}</h2>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={`${statusColors[order.status]} text-white capitalize w-fit`}>
          {order.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Progress */}
      <OrderProgress status={order.status} />

      {/* Order Items */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">R{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-[hsl(var(--pink))]">R{order.total}</span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Preferred Contact</p>
              <p className="font-medium capitalize">{order.preferredContact}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Contact Value</p>
              <p className="font-medium">{order.contactValue}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{order.customerEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Info */}
      <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-[hsl(var(--pink))] mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Notifications Enabled</p>
          <p className="text-muted-foreground">
            You'll receive updates via {order.preferredContact} whenever your order status changes.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const found = mockOrders.find(o => 
        o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
      );
      
      if (found) {
        setOrder(found);
      } else {
        toast({
          title: 'Order not found',
          description: 'Please check your tracking number and try again.',
          variant: 'destructive',
        });
        setOrder(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your tracking number to see the status of your order
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter tracking number (e.g., ADV123456)"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSearching || !trackingNumber}
                className="bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
              >
                {isSearching ? 'Searching...' : 'Track'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && <OrderDetails order={order} />}

        {/* Demo Notice */}
        {!order && (
          <div className="text-center text-muted-foreground text-sm">
            <p>Demo tracking numbers: ADV123456, ADV789012</p>
          </div>
        )}
      </div>
    </div>
  );
}
