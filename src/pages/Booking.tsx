import { useState } from 'react';
import { Clock, User, Mail, Phone, MessageSquare, Instagram, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAwayStatus } from '@/context/AwayStatusContext';

const services = [
  {
    id: 'classic-lashes',
    name: 'Classic Lashes',
    price: 150,
    duration: '1.5 hours',
    description: 'Natural-looking individual lash extensions',
  },
  {
    id: 'hybrid-lashes',
    name: 'Hybrid Lashes',
    price: 200,
    duration: '2 hours',
    description: 'Blend of classic and volume lashes',
  },
  {
    id: 'volume-lashes',
    name: 'Volume Lashes',
    price: 280,
    duration: '2.5 hours',
    description: 'Full, dramatic volume lash set',
  },
  {
    id: 'wig-installation',
    name: 'Basic Wig Installation',
    price: 250,
    duration: '2 hours',
    description: 'Professional lace-front wig installation',
  },
  {
    id: 'wig-styling',
    name: 'Wig Styling',
    price: 150,
    duration: '1 hour',
    description: 'Cut, style, and customize your wig',
  },
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00'
];

export function Booking() {
  const { isAway } = useAwayStatus();
  const { toast } = useToast();

  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    contactMethod: 'whatsapp',
    contactValue: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    setShowConfirmation(false);
    toast({
      title: 'Booking Confirmed!',
      description: 'We\'ll send you a confirmation via your preferred contact method.',
    });
    // Reset form
    setSelectedService('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      notes: '',
      contactMethod: 'whatsapp',
      contactValue: '',
    });
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  if (isAway) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center p-12">
            <div className="text-6xl mb-6">😴</div>
            <h1 className="text-3xl font-bold mb-4">We're Currently Away</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest! We're currently not accepting new bookings. 
              Please check back later or contact us directly.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Appointment</h1>
          <p className="text-muted-foreground">
            Select your service, date, and time. We'll confirm your booking shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Selection */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[hsl(var(--pink))] text-white flex items-center justify-center text-sm">1</span>
              Select Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all ${
                    selectedService === service.id 
                      ? 'ring-2 ring-[hsl(var(--pink))] bg-[hsl(var(--pink))]/5' 
                      : 'hover:border-[hsl(var(--pink))]'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[hsl(var(--pink))]">
                        R{service.price}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Date & Time Selection */}
          {selectedService && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[hsl(var(--pink))] text-white flex items-center justify-center text-sm">2</span>
                Select Date & Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md"
                    />
                  </CardContent>
                </Card>

                {selectedDate && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-4 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Available Times
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={selectedTime === time ? 'bg-[hsl(var(--pink))]' : ''}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}

          {/* Contact Details */}
          {selectedDate && selectedTime && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[hsl(var(--pink))] text-white flex items-center justify-center text-sm">3</span>
                Your Details
              </h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                      placeholder="+27 12 345 6789"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[
                        { value: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                        { value: 'email', icon: Mail, label: 'Email' },
                        { value: 'instagram', icon: Instagram, label: 'Instagram' },
                      ].map(method => (
                        <Button
                          key={method.value}
                          type="button"
                          variant={formData.contactMethod === method.value ? 'default' : 'outline'}
                          onClick={() => setFormData({ ...formData, contactMethod: method.value })}
                          className={formData.contactMethod === method.value ? 'bg-[hsl(var(--pink))]' : ''}
                        >
                          <method.icon className="h-4 w-4 mr-2" />
                          {method.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      {formData.contactMethod === 'whatsapp' && 'WhatsApp Number'}
                      {formData.contactMethod === 'email' && 'Email Address'}
                      {formData.contactMethod === 'instagram' && 'Instagram Username'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactValue}
                      onChange={e => setFormData({ ...formData, contactValue: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                      placeholder={
                        formData.contactMethod === 'whatsapp' ? '+27 12 345 6789' :
                        formData.contactMethod === 'email' ? 'your@email.com' :
                        '@yourusername'
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Additional Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                      rows={3}
                      placeholder="Any special requests or allergies..."
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Submit Button */}
          {formData.name && formData.email && formData.phone && (
            <div className="flex justify-end">
              <Button 
                type="submit"
                size="lg"
                className="bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]"
              >
                Confirm Booking
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Your Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Service:</strong> {selectedServiceData?.name}</p>
                <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Price:</strong> R{selectedServiceData?.price}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Contact:</strong> {formData.contactValue} ({formData.contactMethod})</p>
              </div>
              <p className="text-sm text-muted-foreground">
                We'll send a confirmation to your preferred contact method. 
                Please arrive 10 minutes before your appointment.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmBooking} className="flex-1 bg-[hsl(var(--pink))] hover:bg-[hsl(var(--pink-dark))]">
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
