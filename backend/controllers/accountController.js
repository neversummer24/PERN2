

export const getAccount =  async (req, res) => {
    try {
        const {userId} = req.body.user;
        const result = await pool.query("SELECT * FROM tblaccount where userId = $1", [userId]);
        const account = result.rows[0];
        if(!account) return res.status(400).json({
            status: "fail",
            message: "Account does not exist"
        })

        res.status(200).json({
            status: "success",
            account,
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
        const {accountName} = req.body;

        const result = await pool.query("INSERT INTO tblaccount (userId, accountName) VALUES ($1, $2) RETURNING *",
        [userId, accountName]);

        const account = result.rows[0];

        res.status(200).json({
            status: "success",
            message: "Account created successfully",
            account,
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
        const {amount} = req.body;

        await pool.query("UPDATE tblaccount SET balance = balance + $1 WHERE userId = $2 RETURNING *",
        [amount, userId]);

        res.status(200).json({
            status: "success",
            message: "Account created successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "create account fail",
            message: error.message
        })
    }   
} 