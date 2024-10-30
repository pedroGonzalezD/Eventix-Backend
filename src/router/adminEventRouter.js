import express from "express";
import {
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../controllers/adminEvent.js";
import upload from "../multerConfig.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.use(verifyAdmin);

router.get("/events", getAllEvents);
router.put("/events/:id", upload.single("image"), updateEvent);
router.delete("/events/:id", deleteEvent);

export default router;
