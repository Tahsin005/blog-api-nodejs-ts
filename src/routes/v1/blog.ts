import { Router } from "express";
import { param, query, body } from "express-validator";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize, { AuthRole } from "@/middlewares/authorize";

import createBlog from "@/controllers/v1/blog/create_blog";


const router = Router();

router.post(
    '/',
    authenticate,
    authorize(['admin']),
    createBlog
);

export default router;