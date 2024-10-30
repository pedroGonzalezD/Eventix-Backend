import express from "express";
import { getUserTickets } from "../controllers/ticketController.js";

const router = express.Router();

router.get("/tickets", getUserTickets);

export default router;
