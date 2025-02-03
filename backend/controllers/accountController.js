import {pool} from "../libs/database.js"

export const getAccounts =  async (req, res) => {
    try {
        const {userId} = req.body.user;
        const result = await pool.query("SELECT * FROM tblaccount where  user_id = $1", [userId]);
        console.log("getAccounts res ", result); 
        res.status(200).json({
            status: "success", 
            data: result.rows,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "get account fail",
            message: error.message
        })
    }

}


export const createAccount =  async (req, res) => {
    try {
        const {userId} = req.body.user;
        const {account_name,amount,account_number} = req.body;

        const accountExistQuery = await pool.query("SELECT * FROM tblaccount where account_name = $1 AND user_id = $2", [account_name,userId]);
        const accountExist = accountExistQuery.rows[0];
        if(accountExist) return res.status(400).json({
            status: "fail",
            message: "Account already exists"
        })

        const createAccountQuery = await pool.query("INSERT INTO tblaccount (user_id,account_balance,account_name,account_number) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId,amount,account_name, account_number]);

        const account = createAccountQuery.rows[0];

        await pool.query("UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [[account_name], userId]);

        const description = account.account_name + " (Initial Deposit)";

        const initialDepositQuery = {
          text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
          values: [
                    userId,
                    description,
                    "income",
                    "Completed",
                    amount,
                    account_name,
                  ],
        };
        await pool.query(initialDepositQuery);

        res.status(201).json({
            status: "success",
            message: "Account created successfully",
            data:account,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "create account fail",
            message: error.message
        })
    }
}
export const addMoneyToAccount =  async (req, res) => {
    try {
        const {userId} = req.body.user;
        const {id} = req.params;  //account id
        const {amount} = req.body;

        const newAmount = Number(amount);

        const result =await pool.query(`UPDATE tblaccount SET account_balance = (account_balance + $1),
             updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [newAmount, id]);

        const account  = result.rows[0];

        const description = account.account_name + " (Deposit)";

        const transactionQuery = {
          text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
          values: [
                    userId,
                    description,
                    "income",
                    "Completed",
                    amount,
                    account.account_name,
                  ],
        };
        await pool.query(transactionQuery);

        res.status(200).json({
            status: "success",
            message: "Money added successfully",
            data:account,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "add money fail",
            message: error.message
        })
    }   
} 