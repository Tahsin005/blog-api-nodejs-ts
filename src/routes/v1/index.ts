import { Router } from "express";
const router = Router();

import authRoutes from "@/routes/v1/auth";
import userRoutes from "@/routes/v1/user";
import blogRoutes from "@/routes/v1/blog";

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the API!',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://example.com/docs',
        time: new Date().toISOString(),
    });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

export default router;