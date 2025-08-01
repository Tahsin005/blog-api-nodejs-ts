import { Router } from "express";
import { param, query, body } from "express-validator";
import multer from "multer";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize, { AuthRole } from "@/middlewares/authorize";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";

import createBlog from "@/controllers/v1/blog/create_blog";

const upload = multer();

const router = Router();

router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    uploadBlogBanner('post'),
    createBlog
);

export default router;