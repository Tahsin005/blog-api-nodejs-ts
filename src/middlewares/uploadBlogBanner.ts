import { logger } from "@/lib/winston";

import Blog from "@/models/blog";

import type { Request, Response, NextFunction } from "express";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadBlogBanner = (method: 'post' | 'put') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (method === 'post' && !req.file) {
            next();
            return;
        }

        if (!req.file) {
            res.status(400).json({
                code: 'ValidationError',
                message: 'Blog banner image is required',
            });
            return;
        }

        if (req.file.size > MAX_FILE_SIZE) {
            res.status(413).json({
                code: 'ValidationError',
                message: 'Blog banner image size exceeds the limit of 5 MB',
            });
            return;
        }

        try {
        } catch (error) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal server error',
                error: error,
            });
            logger.error(`Error while processing blog banner upload: ${error}`);
        }
    };
};

export default uploadBlogBanner;