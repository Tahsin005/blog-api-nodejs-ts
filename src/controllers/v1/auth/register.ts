import { logger } from "@/lib/winston";
import config from "@/config";

import type { Request, Response } from "express";

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(201).json({
            message: 'Registration successful',
        });
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error
        });
        logger.error(`Error during registration: ${error}`);
    }
};

export default register;