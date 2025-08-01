import { logger } from '@/lib/winston';

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import type { Request, Response } from 'express';
import type { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

import Blog from '@/models/blog';

// purify HTML content to prevent XSS attacks
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, banner, status } = req.body as BlogData;
        const userId = req.userId;

        const cleanedContent = purify.sanitize(content);

        const newBlog = await Blog.create({
            title,
            content: cleanedContent,
            banner,
            status,
            author: userId,
        });

        logger.info(`Blog created successfully by user ${userId}`);

        res.status(201).json({
            blog: newBlog,
        });
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
