import { Router } from "express";
const router = Router();

import authRoutes from "@/routes/v1/auth";

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

export default router;