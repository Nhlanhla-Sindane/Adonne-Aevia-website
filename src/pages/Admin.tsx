import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  Home,
  Edit,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/ThemeContext';
import { useAwayStatus } from '@/context/AwayStatusContext';
import type { Order, Booking, Product, OrderStatus, BookingStatus } from '@/types';

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+27 12 345 6789',
    items: [{ id: '1', name: 'Lash Shampoo', price: 120, quantity: 1, description: '', category: 'aftercare', image: '', inStock: true }],
    total: 120,
    status: 'pending',
    preferredContact: 'whatsapp',
    contactValue: '+27 12 345 6789',
    trackingNumber: 'ADV123456',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '+27 98 765 4321',
    items: [{ id: '2', name: 'Lash Serum', price: 180, quantity: 2, description: '', category: 'aftercare', image: '', inStock: true }],
    total: 360,
    status: 'processing',
    preferredContact: 'email',
    contactValue: 'john@example.com',
    trackingNumber: 'ADV789012',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerPhone: '+27 11 222 3333',
    service: 'Classic Lashes',
    date: new Date('2024-01-25'),
    time: '10:00',
    status: 'confirmed',
    preferredContact: 'whatsapp',
    contactValue: '+27 11 222 3333',
    createdAt: new Date(),
  },
  {
    id: '2',
    customerName: 'Mike Brown',
    customerEmail: 'mike@example.com',
    customerPhone: '+27 44 555 6666',
    service: 'Hybrid Lashes',
    date: new Date('2024-01-26'),
    time: '14:00',
    status: 'pending',
    preferredContact: 'instagram',
    contactValue: '@mikebrown',
    createdAt: new Date(),
  },
];

const mockProducts: Product[] = [
  { id: '1', name: 'Lash Shampoo', description: 'Gentle cleanser', price: 120, category: 'aftercare', image: '', inStock: true },
  { id: '2', name: 'Lash Serum', description: 'Growth serum', price: 180, category: 'aftercare', image: '', inStock: true },
];

const servicePrices = [
  { id: 'classic-lashes', name: 'Classic Lashes', price: 150 },
  { id: 'hybrid-lashes', name: 'Hybrid Lashes', price: 200 },
  { id: 'volume-lashes', name: 'Volume Lashes', price: 280 },
  { id: 'wig-installation', name: 'Basic Wig Installation', price: 250 },
  { id: 'wig-styling', name: 'Wig Styling', price: 150 },
];

export function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState(mockOrders);
  const [bookings, setBookings] = useState(mockBookings);
  const [products, setProducts] = useState(mockProducts);
  const [prices, setPrices] = useState(servicePrices);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAway, setIsAway } = useAwayStatus();
  const { toast } = useToast();

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o));
    toast({ title: 'Order updated', description: `Status changed to ${status}` });
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    toast({ title: 'Booking updated', description: `Status changed to ${status}` });
  };

  const saveProduct = (product: Product) => {
    if (product.id) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, { ...product, id: Date.now().toString() }]);
    }
    setIsProductDialogOpen(false);
    setEditingProduct(null);
    toast({ title: 'Product saved' });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({ title: 'Product deleted' });
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setPrices(prev => prev.map(p => p.id === serviceId ? { ...p, price: newPrice } : p));
    toast({ title: 'Price updated' });
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    pop_verified: CheckCircle,
    processing: Package,
    shipped: Truck,
    delivered: Home,
    cancelled: XCircle,
    confirmed: CheckCircle,
    completed: CheckCircle,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="h-6 w-6 text-[hsl(var(--pink))]" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-500">{stats.pendingOrders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-500">{stats.pendingBookings}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[hsl(var(--pink))]">R{stats.revenue}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                        </div>
                        <Badge className="capitalize">{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                        </div>
                        <Badge className="capitalize">{booking.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold">{order.trackingNumber}</p>
                          <p className="text-sm text-muted-foreground">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[hsl(var(--pink))]">R{order.total}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(['pending', 'pop_verified', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map(status => {
                          const Icon = statusIcons[status];
                          return (
                            <Button
                              key={status}
                              variant={order.status === status ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, status)}
                              className={order.status === status ? 'bg-[hsl(var(--pink))]' : ''}
                            >
                              <Icon className="h-4 w-4 mr-1" />
                              {status.replace('_', ' ')}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                        </div>
                        <Badge className="capitalize w-fit">{booking.status}</Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map(status => (
                          <Button
                            key={status}
                            variant={booking.status === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, status)}
                            className={booking.status === status ? 'bg-[hsl(var(--pink))]' : ''}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            {/* Away Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Business Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Away Mode</p>
                    <p className="text-sm text-muted-foreground">
                      When enabled, customers will see an away message and bookings will be disabled.
                      The favicon will also change to indicate unavailability.
                    </p>
                  </div>
                  <Switch 
                    checked={isAway} 
                    onCheckedChange={setIsAway}
                  />
                </div>
                {isAway && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      😴 Away mode is active. The favicon has changed to indicate unavailability.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Prices */}
            <Card>
              <CardHeader>
                <CardTitle>Service Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prices.map(service => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">{service.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">R</span>
                        <Input
                          type="number"
                          value={service.price}
                          onChange={e => updateServicePrice(service.id, parseInt(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setEditingProduct({ id: '', name: '', description: '', price: 0, category: 'aftercare', image: '', inStock: true });
                    setIsProductDialogOpen(true);
                  }}
                  className="bg-[hsl(var(--pink))]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">R{product.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Edit Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form 
              onSubmit={e => {
                e.preventDefault();
                saveProduct(editingProduct);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                >
                  <option value="aftercare">Aftercare</option>
                  <option value="accessories">Accessories</option>
                  <option value="wigs">Wigs</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-[hsl(var(--pink))]">
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
