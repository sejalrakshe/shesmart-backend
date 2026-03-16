// server.js
const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Your Stripe secret key will be added later
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Test endpoint to check if server is running
app.get('/', (req, res) => {
  res.send('SheSmart Payment Server is running!');
});

// Main payment endpoint
app.post('/create-payment-intent', async (req, res) => {
  console.log('Payment request received');

  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});