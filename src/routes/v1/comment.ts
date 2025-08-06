import { Router } from "express";
import { body, param } from "express-validator";

// controllers
import commentBlog from "@/controllers/v1/comment/comment_blog";
import getCommentsBySlug from "@/controllers/v1/comment/get_comments_by_blog";

// middlewares
import validationError from "@/middlewares/validationError";
import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";

// models
import User from "@/models/user";
import Blog from "@/models/blog";


const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    param('blogId')
        .isMongoId()
        .withMessage('Invalid blog ID'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),
    validationError,
    commentBlog,
);

router.get(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    param('blogId')
        .isMongoId()
        .withMessage('Invalid blog ID'),
    validationError,
    getCommentsBySlug,
);

export default router;