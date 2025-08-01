import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select('-__v').exec();

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            user,
        });
        logger.info(`User ${userId} retrieved successfully`);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        logger.error(`Error while gettting user by id: ${error}`);
    }
};

export default getUser;