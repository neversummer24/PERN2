import { hashPassword,comparePassword,createJWT } from "../libs/auth.js";
import {pool} from "../libs/database.js"

export const signupUser = async (req, res) => {
    try {
      const {firstName, email, password} = req.body

      if(!firstName || !email || !password) return res.status(400).json({
        status: "fail",
        message: "All fields are required"
      })
      

      //email unique
      const userExists = await pool.query("SELECT EXISTS(SELECT 1 FROM tbluser WHERE email = $1)", [email]);
    

      if(userExists.rows[0].exists) return res.status(400).json({
        status: "fail",
        message: "Email already exists"
      })

      const hashedPassword = await hashPassword(password);
      console.log("hashedPassword", hashedPassword);

      //RETURNING * returns all the columns
      const user = await pool.query("INSERT INTO tbluser (firstName, email, password) VALUES ($1, $2, $3) RETURNING *", 
        [firstName, email, hashedPassword]);

      user.rows[0].password = undefined; //hide password

      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: user.rows[0]
      });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
}

export const signinUser = async (req, res) => {
    try {
      const {email, password} = req.body;

      if(!email || !password) return res.status(400).json({
        status: "fail",
        message: "All fields are required"
      })

      const result = await pool.query("SELECT * FROM tbluser WHERE email = $1", [email]);

      const user = result.rows[0];

      if(!user) return res.status(400).json({
        status: "fail",
        message: "User does not exist"
      })

      const validPassword = await comparePassword(password, user?.password);
      if(!validPassword) return res.status(400).json({
        status: "fail",
        message: "Invalid password"
      })

      //Create JWT token
      const token = createJWT(user.id);

      user.password = undefined; //hide password

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        user,
        token
      });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
}