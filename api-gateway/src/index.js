import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import https from "https";
import fs from "fs";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:4001";
const PAYMENTS_SERVICE_URL =
  process.env.PAYMENTS_SERVICE_URL || "http://localhost:4002";

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const sslOptions = {
  key: fs.readFileSync("../key.pem"),
  cert: fs.readFileSync("../cert.pem"),
};

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySuperSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 20 * 60 * 1000,
    },
  })
);

app.use(morgan("dev"));
// app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static login page
app.use("/", express.static(path.join(_dirname, "../public")));

// Proxy to services (no auth, no header changes)
app.use(
  ["/auth", "/auth/*"],
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/auth": "/api/auth" },
  })
);

app.use(
  "/payments",
  createProxyMiddleware({
    target: PAYMENTS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/payments": "/api/payments" },
  })
);

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Auth service listening at https://localhost:${PORT}`);
});
