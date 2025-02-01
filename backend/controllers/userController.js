import {pool} from "../libs/database.js"
import {hashPassword,comparePassword} from "../libs/auth.js"

export const getUser = async (req, res) => {
    try {
        const {userId} = req.body.user;
        const userExist = await pool.query("SELECT * FROM tbluser where id = $1", [userId]);
        const user = await userExist.rows[0];

        if(!user) return res.status(400).json({
            status: "fail",
            message: "User does not exist"
        })

        user.password = undefined; //hide password

        res.status(200).json({
            status: "success",
            user,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "get userfail",
            message: error.message
        })
    }
}


export const updateUser = async (req, res) => {
    try {
        const {userId} = req.body.user; 
        const {firstname, lastname} = req.body;

        const userExist = await pool.query("SELECT * FROM tbluser where id = $1", [userId]);
        const user = userExist.rows[0];
        if(!user) return res.status(400).json({
            status: "fail",
            message: "User does not exist"
        })

       
        const updatedUser = await pool.query("UPDATE tbluser SET firstname = $1, lastname = $2 WHERE id = $3 RETURNING *",
        [firstname, lastname, userId]);

        updatedUser.rows[0].password = undefined; //hide password

        res.status(200).json({
            status: "success",
            user: updatedUser.rows[0]
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "update user fail",
            message: error.message
        })
    }
}


export const changePassword = async (req, res) => {
    try {
        const {userId} = req.body.user;
        const {currentPassword, newPassword, confirmNewPassword} = req.body;

        const userExist = await pool.query("SELECT * FROM tbluser where id = $1", [userId]);
        const user = await userExist.rows[0];

        if(!user) return res.status(400).json({
            status: "fail",
            message: "User does not exist"
        })

        if(newPassword !== confirmNewPassword) return res.status(400).json({
            status: "fail",
            message: "Passwords do not match"
        })

        const validPassword = await comparePassword(currentPassword, user?.password);
        if(!validPassword) return res.status(400).json({
            status: "fail",
            message: "Invalid password"
        })

        const hashedPassword = await hashPassword(newPassword);

        await pool.query("UPDATE tbluser SET password = $1 WHERE id = $2 RETURNING *",
        [hashedPassword, userId]);

        res.status(200).json({
            status: "success",
            message: "Password changed successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}