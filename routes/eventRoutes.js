import express from "express";

import {
  createEvent,
  getEvents,
  getSingleEvent,
} from "../controllers/eventController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createEvent);

router.get("/", getEvents);

router.get("/:id", getSingleEvent);

export default router;