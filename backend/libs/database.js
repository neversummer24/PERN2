import pg from "pg";
import dotenv from "dotenv";


dotenv.config();

const { Pool, types } = pg;

//By default, pg returns numeric values as strings, but we want them as numbers
const NUMERIC_OID = 1700;
types.setTypeParser(NUMERIC_OID, (stringValue) => {
    return parseFloat(stringValue);
})

//ssl设置为false 忽略证书连接数据库
export const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
    ssl: { rejectUnauthorized: false },
});


pool.on("connect", () => {
    console.log("connected to database");
});