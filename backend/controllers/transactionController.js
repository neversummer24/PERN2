import {pool} from "../libs/database.js"
import { getMonthName } from "../libs/utils.js";

export const getTransactions = async (req, res) => {
    try {
        //getTransactions BY DATE
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const {df,dt,s} = req.query;
        const {userId} = req.body.user;

        //new Date()  Date对象
        const startDate = df ? new Date(df) : sevenDaysAgo;
        const endDate = dt ? new Date(dt) : today;

        
        const result = await pool.query(`SELECT * FROM tbltransaction where  user_id = $1 AND createdat BETWEEN $2 AND $3
            AND description ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%' `, 
            [userId, startDate, endDate,s]);
        
           
        res.status(200).json({
            status: "success", 
            data: result.rows,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "get transaction fail",
            message: error.message
        })
    }
} 

export const addTransaction = async (req, res) => {
    try {
        const {userId} = req.body.user;
        const {account_id} = req.params;
        const {description, amount, source} = req.body;

        if(!(description && amount && source)) return res.status(400).json({
            status: "fail",
            message: "All fields are required"
        })

        if(Number(amount) < 0) return res.status(400).json({
            status: "fail",
            message: "Amount must be greater than 0"
        })

        const accountQuery = await pool.query("SELECT * FROM tblaccount where id = $1 AND user_id = $2", [account_id,userId]);
        const accountInfo = accountQuery.rows[0];
        if(!accountInfo) return res.status(400).json({
            status: "fail",
            message: "Account not found"
        })
        const accountBalance = accountInfo.account_balance;
        if(Number(amount) > Number(accountBalance)) return res.status(400).json({
            status: "fail",
            message: "Insufficient account balance"
        })

        await pool.query("BEGIN");

        await pool.query("UPDATE tblaccount SET account_balance = (account_balance - $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [amount, account_id]);

        await pool.query(`INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [userId, description, "expense", "Completed", amount, source]);
        
        await pool.query("COMMIT")





        const type = "expense";
        const status = "Completed"; 

        const transactionQuery = {
          text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source, account_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          values: [
                    userId,
                    description,
                    type,
                    status,
                    amount,
                    source,
                    account_id
                  ],
        };
        const result = await pool.query(transactionQuery);
        res.status(200).json({
            status: "success",
            data: result.rows
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "add transaction fail",
            message: error.message
        })
    }
}   

export const transferMoneyToAccount = async (req, res) => { 
    try {
        const {userId} = req.body.user;
        const {from_account_id, to_account_id,  amount} = req.body;

        if(!(from_account_id && to_account_id && amount)) return res.status(400).json({
            status: "fail", 
            message: "All fields are required"
        })

        if(Number(amount) < 0) return res.status(400).json({
            status: "fail",
            message: "Amount must be greater than 0"
        })

        const fromAccountQuery = await pool.query("SELECT * FROM tblaccount where id = $1 AND user_id = $2", [from_account_id,userId]);
        const fromAccountInfo = fromAccountQuery.rows[0];
        if(!fromAccountInfo) return res.status(400).json({
            status: "fail",
            message: "Account not found"
        })
        const fromAccountBalance = fromAccountInfo.account_balance;
        if(Number(amount) > Number(fromAccountBalance)) return res.status(400).json({
            status: "fail",
            message: "Insufficient account balance"
        })

        const toAccountQuery = await pool.query("SELECT * FROM tblaccount where id = $1 AND user_id = $2", [to_account_id,userId]);
        const toAccountInfo = toAccountQuery.rows[0];
        if(!toAccountInfo) return res.status(400).json({
            status: "fail",
            message: "Account not found"
        })

        const status = "Completed"; 
        const source = fromAccountInfo.account_name;
        let description = `Transfer from ${source} to ${toAccountInfo.account_name}`;
        const account_id = to_account_id;

        await pool.query("BEGIN");

        await pool.query("UPDATE tblaccount SET account_balance = (account_balance - $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [amount, from_account_id]);

        await pool.query("UPDATE tblaccount SET account_balance = (account_balance + $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [amount, to_account_id]);

        await pool.query(`INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [userId, description, "expense", status, amount, source]);

        description = `Received from ${source} to ${toAccountInfo.account_name}`;

        await pool.query(`INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [userId, description, "income", status, amount, source]);
        
        await pool.query("COMMIT")

        res.status(200).json({
            status: "success",    
            message: "transfer successful"
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "transfer fail",
            message: error.message
        })
    }
}   


export const getDashboard = async (req, res) => {
    try {
        const {userId} = req.body.user;

        let totalIncome = 0;
        let totalExpense = 0;


       const result =await pool.query(`SELECT type, SUM(amount) as totalAmount FROM tbltransaction where user_id = $1 GROUP BY type`, [userId]);
       const transactions = result.rows;
       
       transactions.forEach((transaction) => {
        if(transaction.type === "income") totalIncome += transaction.totalAmount;
        if(transaction.type === "expense") totalExpense += transaction.totalAmount;
       })

       const balance = totalIncome - totalExpense; 

       //aggregate by type and month of this year
       const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
       const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

       const aggregateQuery = await pool.query(`SELECT type, EXTRACT(MONTH FROM createdat) as month, SUM(amount) as totalAmount FROM tbltransaction
       where user_id = $1 AND createdat BETWEEN $2 AND $3 GROUP BY type, month`, [userId, firstDayOfYear, lastDayOfYear]);

       const aggregate = aggregateQuery.rows;

       const monthlyData = Array.from({length: 12}, (_, index) => {
        const month = index + 1;
        const income = aggregate.find((item) => item.type === "income" && parseInt(item.month) === month)?.totalAmount || 0;
        const expense = aggregate.find((item) => item.type === "expense" && parseInt(item.month) === month)?.totalAmount || 0;
        return {
            month: getMonthName(index),
            income,
            expense
        }
       })

       //last 5 transactions
       const lastTransactionsQuery = await pool.query(`SELECT * FROM tbltransaction where user_id = $1 ORDER BY createdat DESC LIMIT 5`, [userId]);

       const lastTransactions = lastTransactionsQuery.rows;

       //last 5 accounts
       const lastAccountsQuery = await pool.query(`SELECT * FROM tblaccount where user_id = $1 ORDER BY createdat DESC LIMIT 5`, [userId]);

       const lastAccounts = lastAccountsQuery.rows;

       res.status(200).json({
            status: "success", 
            data: {
                totalIncome,
                totalExpense,
                balance,
                monthlyData,
                lastTransactions,
                lastAccounts
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "dashboard fail",
            message: error.message
        })
    }
}  