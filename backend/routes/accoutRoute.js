import express from "express";
import { getAccounts, createAccount, addMoneyToAccount } from "../controllers/accountController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id?", authMiddleware, getAccounts);
router.put("/create", authMiddleware, createAccount);
router.put("/add-money", authMiddleware, addMoneyToAccount);

export default router;