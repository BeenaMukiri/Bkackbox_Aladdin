import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Import bcryptjs
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { createPool } from "./db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

const users = new Map(); // In-memory store for users (mock)
const pool = await createPool();

app.get("/health", (_, res) => res.json({ ok: true }));

// Register route
app.post("/api/auth/register", async (req, res) => {
  try {
    debugger;
    const { username, email, password } = req.body || {};
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ error: "username, email, password required" });

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in the mock in-memory store
    users.set(username, { username, email, passwordHash: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res.status(400).json({ error: "username and password required" });
    const connection = await pool.getConnection();

    const result = await connection.execute(
      "SELECT id, username, PASSWORDPLAIN FROM users WHERE username = :username",
      { username }
    );
    console.log("rows", result);

    await connection.close();

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    let user = null;
    if (result.rows.length > 0) {
      const row = result.rows[0];
      user = {
        id: row[0],
        username: row[1],
        password_plain: row[2],
      };
      console.log("user", user);
    } else {
      console.log("No user found");
    }

    // Compare the hashed password with the stored one
    if (password !== user.password_plain)
      return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT token
    // const token = jwt.sign(
    //   { username: user.username },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () =>
  console.log(`Auth service listening at http://localhost:${PORT}`)
);
