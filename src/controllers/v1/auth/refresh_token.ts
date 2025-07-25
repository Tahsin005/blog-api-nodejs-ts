import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { logger } from "@/lib/winston";
import config from "@/config";
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";

import Token from "@/models/token";

import type { Request, Response } from "express";
import { Types } from "mongoose";

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refresh_token as string;

    try {
        const tokenExists = await Token.findOne({ token: refreshToken });

        if (!tokenExists) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            logger.warn(`Unauthorized access attempt with invalid refresh token`);
            return;
        }

        // verify the refresh token
        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId };

        const accessToken = generateAccessToken(jwtPayload.userId);

        res.status(200).json({
            accessToken,
        });
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token has expired, please log in again',
            });
            logger.warn(`Refresh token expired for user: ${error.message}`);
            return;
        }

        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            logger.warn(`Invalid refresh token used: ${error.message}`);
            return;
        }
        
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error
        });

        logger.error(`Error in refresh token endpoint:`, {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export default refreshToken;