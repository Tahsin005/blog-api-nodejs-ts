import { logger } from '@/lib/winston';

import User from '@/models/user';
import Blog from '@/models/blog';
import Like from '@/models/like';

import type { Request, Response } from 'express';

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
    const { blogId } = req.params;
    const { userId } = req.body;
    try {
        const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
        if (!existingLike) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Like not found',
            });
            return;
        }

        const blog = await Blog.findById(blogId).select('likesCount').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }


        await Like.deleteOne({ _id: existingLike._id })

        blog.likesCount -= 1;
        await blog.save();

        logger.info(`A blog was unliked successfully:`, {
            blogId,
            userId,
            likesCount: blog.likesCount,
        });

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        logger.error(`Error while unliking a blog: ${error}`);
    }
};

export default unlikeBlog;
