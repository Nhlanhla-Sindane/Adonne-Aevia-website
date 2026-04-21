const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adone_aevia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  inStock: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  items: Array,
  total: Number,
  status: { type: String, default: 'pending' }, // pending, pop_verified, processing, shipped, delivered
  paymentProof: String,
  preferredContact: String, // whatsapp, email, instagram
  contactValue: String,
  trackingNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  service: String,
  date: Date,
  time: String,
  status: { type: String, default: 'pending' }, // pending, confirmed, completed, cancelled
  notes: String,
  preferredContact: String,
  contactValue: String,
  createdAt: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now }
});

const Models = {
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
  Booking: mongoose.model('Booking', bookingSchema),
  Settings: mongoose.model('Settings', settingsSchema)
};

// Routes

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Models.Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Models.Product(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Models.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Models.Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Models.Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Models.Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/tracking/:trackingNumber', async (req, res) => {
  try {
    const order = await Models.Order.findOne({ trackingNumber: req.params.trackingNumber });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const trackingNumber = 'ADV' + Date.now().toString(36).toUpperCase();
    const order = new Models.Order({ ...req.body, trackingNumber });
    await order.save();
    
    // Send notification
    await sendNotification(order, 'order_received');
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Models.Order.findByIdAndUpdate(
      req.params.id, 
      { status, updatedAt: new Date() }, 
      { new: true }
    );
    
    // Send notification based on status
    await sendNotification(order, status);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/verify-payment', async (req, res) => {
  try {
    const order = await Models.Order.findByIdAndUpdate(
      req.params.id,
      { status: 'pop_verified', updatedAt: new Date() },
      { new: true }
    );
    
    await sendNotification(order, 'pop_verified');
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Models.Booking.find().sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Models.Booking(req.body);
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const booking = await Models.Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings (Away Status, etc.)
app.get('/api/settings/:key', async (req, res) => {
  try {
    const setting = await Models.Settings.findOne({ key: req.params.key });
    res.json(setting ? setting.value : null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings/:key', async (req, res) => {
  try {
    const setting = await Models.Settings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(setting.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notification Service
async function sendNotification(order, event) {
  const { preferredContact, contactValue } = order;
  
  const messages = {
    order_received: `Hi! Your order #${order.trackingNumber} has been received. We'll verify your payment and update you soon. - Adonńe Aevia`,
    pop_verified: `Great news! Your payment for order #${order.trackingNumber} has been verified. We're now processing your order. - Adonńe Aevia`,
    processing: `Your order #${order.trackingNumber} is being prepared for shipping. - Adonńe Aevia`,
    shipped: `Your order #${order.trackingNumber} has been shipped! Track it on our website. - Adonńe Aevia`,
    delivered: `Your order #${order.trackingNumber} has been delivered. Enjoy! - Adonńe Aevia`
  };
  
  const message = messages[event] || messages.order_received;
  
  try {
    switch (preferredContact) {
      case 'whatsapp':
        await sendWhatsApp(contactValue, message);
        break;
      case 'email':
        await sendEmail(contactValue, `Order Update - ${order.trackingNumber}`, message);
        break;
      case 'instagram':
        await sendInstagramDM(contactValue, message);
        break;
    }
  } catch (error) {
    console.error('Notification error:', error);
  }
}

async function sendWhatsApp(phone, message) {
  // Twilio integration would go here
  console.log(`[WhatsApp] To: ${phone}, Message: ${message}`);
}

async function sendEmail(email, subject, message) {
  // SendGrid integration would go here
  console.log(`[Email] To: ${email}, Subject: ${subject}, Message: ${message}`);
}

async function sendInstagramDM(username, message) {
  // Meta Graph API integration would go here
  console.log(`[Instagram DM] To: ${username}, Message: ${message}`);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
