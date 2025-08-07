import { logger } from '@/lib/winston';

import Blog from '@/models/blog';
import Comment from '@/models/comment';
import User from '@/models/user';

import type { Request, Response } from 'express';

const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const currentUserId = req.userId;
    try {
        const comment = await Comment.findById(commentId).select('useId blogId').lean().exec();
        const user = await User.findById(currentUserId).select('role').lean().exec();

        if (!comment) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Comment not found',
            });
            return;
        }

        const blog = await Blog.findById(comment.blogId).select('commentsCount').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }

        if (comment.userId !== currentUserId && user?.role !== 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });

            logger.warn('A user tried to delete a comment without permission', {
                userId: currentUserId,
                comment,
            });
            return;
        }

        await Comment.deleteOne({ _id: commentId });
        logger.info(`A comment was deleted successfully:`, commentId);

        blog.commentsCount -= 1;
        await blog.save();
        logger.info(`A blog comment count was updated successfully:`, {
            blogId: blog._id,
            commentsCount: blog.commentsCount,
        });

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        logger.error(`Error while deleting a comment: ${error}`);
    }
};

export default deleteComment;
