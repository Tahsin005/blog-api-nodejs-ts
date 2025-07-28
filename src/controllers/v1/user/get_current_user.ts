import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select('-__v').lean().exec();

        res.status(200).json({
            user,
        });

        logger.info(`Current user retrieved successfully:`);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        logger.error(`Error retrieving current user: ${error}`);
    }
};

export default getCurrentUser;