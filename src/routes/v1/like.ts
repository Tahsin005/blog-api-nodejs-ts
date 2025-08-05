import { Router } from "express";
import { body, param } from "express-validator";

// controllers
import likeBlog from "@/controllers/v1/like/like_blog";

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
    body('userId')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid user ID'),
    validationError,
    likeBlog,
);

export default router;