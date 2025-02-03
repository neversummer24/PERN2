import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTransactions, getDashboard, addTransaction, transferMoneyToAccount } from "../controllers/transactionController.js";


const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.get("/dashboard", authMiddleware, getDashboard);
router.post("/add/:account_id", authMiddleware, addTransaction);
router.put("/transfer-money", authMiddleware, transferMoneyToAccount);

export default router;