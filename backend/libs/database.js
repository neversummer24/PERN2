import pg from "pg";
import dotenv from "dotenv";


dotenv.config();

const { Pool } = pg;


//ssl设置为false 忽略证书连接数据库
export const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
    ssl: { rejectUnauthorized: false },
});


pool.on("connect", () => {
    console.log("connected to database");
});