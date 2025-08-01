import { logger } from '@/lib/winston';

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import type { Request, Response } from 'express';

import User from '@/models/user';

// purify HTML content to prevent XSS attacks
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        logger.error(`Error while creating a blog: ${error}`);
    }
};

export default createBlog;
