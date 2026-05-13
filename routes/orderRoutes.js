import express from "express";

import { createOrder, createCheckoutSession } from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post(
  "/checkout",
  protect,
  createCheckoutSession
);

export default router;