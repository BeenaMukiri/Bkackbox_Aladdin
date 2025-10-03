import oracledb from "oracledb";

export async function createPool() {
  return await oracledb.createPool({
    user: process.env.DB_USER || "system",
    password: process.env.DB_PASS || "8790769603@Us",
    connectString: process.env.DB_CONNECT || "localhost:1521/orclpdb",
    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1,
  });
}
