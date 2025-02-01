import express from "express";
import { getUser, changePassword, updateUser } from "../controllers/userController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

//routers.use("/user", userRouter);  
router.get("/", authMiddleware, getUser);
router.put("/password", authMiddleware, changePassword);
router.put("/", authMiddleware, updateUser);

export default router;