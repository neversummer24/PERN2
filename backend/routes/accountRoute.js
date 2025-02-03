import express from "express";
import { getAccounts, createAccount, addMoneyToAccount } from "../controllers/accountController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAccounts);
router.post("/create", authMiddleware, createAccount);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);

export default router;