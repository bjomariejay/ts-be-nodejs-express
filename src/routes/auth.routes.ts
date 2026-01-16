import { Router } from "express";
import { login, signup, getCurrentUser } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authenticate, getCurrentUser);

export default router;
