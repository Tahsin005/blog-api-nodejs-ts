import { verifyAccessToken } from "@/lib/jwt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { logger } from "@/lib/winston";
import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Unauthorized',
        });
        logger.warn('Unauthorized access attempt');
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
        req.userId = jwtPayload.userId;
        return next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token has expired, please log in again',
            });
            logger.warn(`Access token expired for user: ${error.message}`);
            return;
        }

        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid access token',
            });
            logger.warn(`Invalid access token used: ${error.message}`);
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });

        logger.error(`Error in authentication middleware:`, { error });
    }
};

export default authenticate;