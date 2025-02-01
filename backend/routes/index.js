import express from "express";

import authRouter from "./authRoute.js";
import userRouter from "./userRoute.js";
// import accountRouter from "./accountRoute.js";
// import transactionRouter from "./transactionRoute.js";


//main router
const routers = express.Router();
routers.use("/auth", authRouter);
routers.use("/user", userRouter);
// routers.use("/account", accountRouter);
// routers.use("/transaction", transactionRouter);


export default routers;