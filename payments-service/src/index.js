import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4002;
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok:true }));

app.post('/api/payments/charge', (req, res) => {
  const { amount = 0, currency = 'INR' } = req.body || {};
  return res.json({
    ok: true,
    message: 'Payment stub executed (open endpoint)',
    charge: { id: 'pay_' + Math.random().toString(36).slice(2,8), amount, currency, when: new Date().toISOString() }
  });
});

app.listen(PORT, ()=> console.log(`Payments service at http://localhost:${PORT}`));
