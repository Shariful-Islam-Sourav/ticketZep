import express from "express";

import {
  createEvent,
  getEvents,
  getSingleEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvent);

router.get("/", getEvents);

router.get("/:id", getSingleEvent);

export default router;