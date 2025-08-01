import { logger } from "@/lib/winston";

import User from "@/models/user";

import type { Request, Response, NextFunction } from "express";

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.userId;

        try {
            const user = await User.findById(userId).select('role').exec();
            if (!user) {
                res.status(404).json({
                    code: 'NotFound',
                    message: 'User not found',
                });
                return;
            }

            if (!roles.includes(user.role)) {
                res.status(403).json({
                    code: 'Forbidden',
                    message: 'Access denied, insufficient permissions',
                });
                return;
            }

            return next();
        } catch (error) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal server error',
                error: error,
            });
            logger.error(`Authorization error for user ${userId}: ${error}`);
        }
    };
};

export default authorize;