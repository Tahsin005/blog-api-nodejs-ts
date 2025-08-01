import { Router } from "express";
import { param, query, body } from "express-validator";
import multer from "multer";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize, { AuthRole } from "@/middlewares/authorize";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";

import createBlog from "@/controllers/v1/blog/create_blog";
import getAllBlogs from "@/controllers/v1/blog/get_all_blogs";
import getBlogsByUser from "@/controllers/v1/blog/get_blogs_by_user";
import getBlogBySlug from "@/controllers/v1/blog/get_blog_by_slug";

const upload = multer();

const router = Router();

router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 180 })
        .withMessage('Title must be less than 180 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),
    body('status')
        .optional()
        .isIn(['draft', 'published'])
        .withMessage('Status must be either draft or published'),
    validationError,
    uploadBlogBanner('post'),
    createBlog
);

router.get(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be an integer between 1 and 50'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer'),
    validationError,
    getAllBlogs,
);

router.get(
    '/user/:userId',
    authenticate,
    authorize(['admin', 'user']),
    param('userId')
        .isMongoId()
        .withMessage('Invalid user id'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be an integer between 1 and 50'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer'),
    validationError,
    getBlogsByUser,
);

router.get(
    '/:slug',
    authenticate,
    authorize(['admin', 'user']),
    param('slug')
        .isSlug()
        .withMessage('Slug is required'),
    validationError,
    getBlogBySlug,
);

export default router;