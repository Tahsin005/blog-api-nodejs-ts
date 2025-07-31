import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response } from "express";

const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const user = await User.deleteOne({ _id: userId });
        logger.info(`A user was account was deleted successfully:`, userId);

        res.sendStatus(204); 
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        logger.error(`Error while deleting current user: ${error}`);
    }
};

export default deleteCurrentUser;