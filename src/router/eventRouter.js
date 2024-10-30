import express from "express";
import {
  createEvent,
  getVisibleEvents,
  getEventById,
} from "../controllers/eventController.js";
import upload from "../multerConfig.js";

const router = express.Router();

router.post("/events", upload.single("image"), createEvent);
router.get("/events", getVisibleEvents);
router.get("/events/:id", getEventById);

export default router;
