import { logger } from '@/lib/winston';
import { v2 as cloudinary } from 'cloudinary';

import User from '@/models/user';
import Blog from '@/models/blog';

import type { Request, Response } from 'express';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    try {
        const blogs = await Blog.find({ author: userId })
            .select('banner.publicId')
            .lean()
            .exec();
        const publicIds = blogs.map(({ banner }) => banner.publicId);

        await cloudinary.api.delete_resources(publicIds);
        logger.info(
            'Multiple blog banners were deleted successfully from Cloudinary',
        );

        await Blog.deleteMany({ author: userId });
        logger.info('Multiple blog posts were deleted successfully', userId);

        await User.deleteOne({ _id: userId });
        logger.info(`A user was account was deleted successfully:`, userId);

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error,
        });
        logger.error(`Error while deleting user by id: ${error}`);
    }
};

export default deleteUser;
