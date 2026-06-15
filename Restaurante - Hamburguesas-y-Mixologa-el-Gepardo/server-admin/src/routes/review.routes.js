import { Router } from "express";
import {
  getReviews,
  getReviewsByTarget,
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getReviews);
router.get("/:targetType/:targetId", getReviewsByTarget);
router.post("/", verifyToken, createReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;