import mysql from 'mysql2/promise';

export async function createPool() {
  return mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'ims_auth',
    waitForConnections: true,
    connectionLimit: 10,
  });
}
