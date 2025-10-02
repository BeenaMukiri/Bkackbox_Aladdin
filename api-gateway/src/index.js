import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
const PAYMENTS_SERVICE_URL = process.env.PAYMENTS_SERVICE_URL || 'http://localhost:4002';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static login page
app.use('/', express.static(path.join(__dirname, '../static')));

// Proxy to services (no auth, no header changes)
app.use('/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/auth': '/api/auth' }
}));

app.use('/payments', createProxyMiddleware({
  target: PAYMENTS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/payments': '/api/payments' }
}));

app.listen(PORT, () => console.log(`API Gateway at http://localhost:${PORT}`));
