import { Router } from "express";

// controllers
import register from "@/controllers/v1/auth/register";

// middlewares

// models


const router = Router();

router.post('/register', register);

export default router;