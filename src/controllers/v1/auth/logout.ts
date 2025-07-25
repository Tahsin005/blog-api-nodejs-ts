import config from "@/config";
import { logger } from "@/lib/winston";

import Token from "@/models/token";

import type { Request, Response } from "express";
import { ref } from "process";


const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refresh_token as string;

        if (refreshToken) {
            await Token.deleteOne({ token: refreshToken });
            logger.info(`Refresh token deleted for user:`, {
                userId: req.userId,
                token: refreshToken,
            });
        }

        // clear the cookie
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.sendStatus(204);

        logger.info(`User logged out successfully:`, {
            userId: req.userId,
        });
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error
        });
        logger.error(`Error during logout: ${error}`);
    }
};

export default logout;