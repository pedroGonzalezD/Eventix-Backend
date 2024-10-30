import express from "express";
import { validatePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payments/validate", validatePayment);

export default router;
