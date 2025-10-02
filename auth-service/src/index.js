import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createPool } from './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4001;
app.use(morgan('dev'));
app.use(express.json());

const pool = await createPool();

app.get('/health', (_, res)=> res.json({ ok:true }));

app.post('/api/auth/register', async (req, res) => {
  try{
    const { username, email, password } = req.body || {};
    if(!username || !email || !password) return res.status(400).json({ error: 'username, email, password required' });
    const [exists] = await pool.query('SELECT id FROM users WHERE username=? OR email=?', [username, email]);
    if(exists.length) return res.status(409).json({ error: 'User exists' });
    await pool.query('INSERT INTO users (username, email, password_plain) VALUES (?,?,?)', [username, email, password]);
    const [row] = await pool.query('SELECT id, username, email FROM users WHERE username=?', [username]);
    return res.json({ user: row[0] });
  }catch(e){
    console.error(e); return res.status(500).json({ error: 'register failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try{
    const { username, password } = req.body || {};
    if(!username || !password) return res.status(400).json({ error: 'username, password required' });
    const [rows] = await pool.query('SELECT * FROM users WHERE username=?', [username]);
    if(!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    if(user.password_plain !== password) return res.status(401).json({ error: 'Invalid credentials' });
    return res.json({ user: { id: user.id, username: user.username, email: user.email } });
  }catch(e){
    console.error(e); return res.status(500).json({ error: 'login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => res.json({ ok:true }));

app.listen(PORT, ()=> console.log(`Auth service at http://localhost:${PORT}`));
